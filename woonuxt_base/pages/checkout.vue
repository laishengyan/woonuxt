<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';

const { t } = useI18n();
const { query } = useRoute();
const { cart, isUpdatingCart, paymentGateways } = useCart();
const { customer, viewer } = useAuth();
const { orderInput, isProcessingOrder, proccessCheckout } = useCheckout();
const runtimeConfig = useRuntimeConfig();
const stripeKey = runtimeConfig.public?.STRIPE_PUBLISHABLE_KEY || null;

const buttonText = ref<string>(isProcessingOrder.value ? t('messages.general.processing') : t('messages.shop.checkoutButton'));
const isCheckoutDisabled = computed<boolean>(() => 
  isProcessingOrder.value || isUpdatingCart.value || !orderInput.value.paymentMethod
);
const isInvalidEmail = ref<boolean>(false);
const stripe = stripeKey ? await loadStripe(stripeKey) : null;
let elements = ref(null);
const isPaid = ref<boolean>(false);

onBeforeMount(async () => {
  if (query.cancel_order) window.close();
});
const payNow = async () => {
  buttonText.value = t('messages.general.processing');

  const { stripePaymentIntent } = await GqlGetStripePaymentIntent();
  const { clientSecret } = stripePaymentIntent;

  try {
    if (orderInput.value.paymentMethod.id === 'stripe') {
      const cardElement = elements.value.getElement('card');
      const { setupIntent } = await stripe.confirmCardSetup(clientSecret, { payment_method: { card: cardElement } });
      const { source } = await stripe.createSource(cardElement);

      if (source) orderInput.value.metaData.push({ key: '_stripe_source_id', value: source.id });
      if (setupIntent) orderInput.value.metaData.push({ key: '_stripe_intent_id', value: setupIntent.id });

      isPaid.value = setupIntent?.status === 'succeeded' || false;
      orderInput.value.transactionId = source?.created?.toString() || new Date().getTime().toString();
    }
  } catch (error) {
    console.error(error);
    buttonText.value = t('messages.shop.placeOrder');
  }

  proccessCheckout(isPaid.value);
};

const handleStripeElement = (stripeElements) => {
  elements.value = stripeElements;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const checkEmailOnBlur = (email) => {
  if (email) isInvalidEmail.value = !emailRegex.test(email);
};

const checkEmailOnInput = (email) => {
  if (email && isInvalidEmail.value) isInvalidEmail.value = !emailRegex.test(email);
};

useSeoMeta({
  title: t('messages.shop.checkout'),
});
</script>

<template>
  <div class="flex flex-col min-h-[600px]">
    <LoadingIcon v-if="!cart" class="m-auto" />
    <template v-else>
      <div v-if="cart.isEmpty" class="flex flex-col items-center justify-center flex-1 mb-12">
        <div class="mb-20 text-xl text-gray-300">{{ $t('messages.shop.cartEmpty') }}</div>
      </div>

      <form v-else class="container flex flex-wrap items-start gap-8 px-[0.63rem] sm:px-0 my-[0.63rem] sm:my-16 justify-evenly lg:gap-20 max-w-[1200px]" @submit.prevent="payNow">
        <div class="grid w-full max-w-2xl gap-8 checkout-form md:flex-1">
          <!-- Customer details -->
          <div v-if="!viewer">
            <h2 class="w-full mb-2 text-2xl font-semibold leading-none">{{ $t('messages.check_out.1') }}</h2>
            <p class="mt-1 text-sm text-gray-500">{{ $t('messages.check_out.2') }} <a href="/my-account" class="text-primary text-semibold">{{ $t('messages.check_out.3') }}</a>.</p>
            <div class="w-full mt-4">
              <label for="email">{{ $t('messages.billing.email') }}</label>
              <input
                v-model="customer.billing.email"
                placeholder="johndoe@email.com"
                type="email"
                name="email"
                :class="{ 'has-error': isInvalidEmail }"
                @blur="checkEmailOnBlur(customer.billing.email)"
                @input="checkEmailOnInput(customer.billing.email)"
                required />
              <Transition name="scale-y" mode="out-in">
                <div v-if="isInvalidEmail" class="mt-1 text-sm text-red-500">{{ $t('messages.check_out.4') }}</div>
              </Transition>
            </div>
            <template v-if="orderInput.createAccount">
              <div class="w-full mt-4">
                <label for="username">{{ $t('messages.account.username') }}</label>
                <input v-model="orderInput.username" placeholder="Username" type="text" name="username" required />
              </div>
              <div class="w-full my-2" v-if="orderInput.createAccount">
                <label for="email">{{ $t('messages.account.password') }}</label>
                <PasswordInput id="password" class="my-2" v-model="orderInput.password" placeholder="Password" :required="true" />
              </div>
            </template>
            <div v-if="!viewer" class="flex items-center gap-2 my-2">
              <label for="creat-account">{{ $t('messages.check_out.5') }}</label>
              <input id="creat-account" v-model="orderInput.createAccount" type="checkbox" name="creat-account" />
            </div>
          </div>

          <div>
            <h2 class="w-full mb-3 text-2xl font-semibold">{{ $t('messages.billing.billingDetails') }}</h2>
            <BillingDetails v-model="customer.billing" :sameAsShippingAddress="orderInput.shipToDifferentAddress" />
          </div>

          <label for="shipToDifferentAddress" class="flex items-center gap-2">
            <span>{{ $t('messages.billing.differentAddress') }}</span>
            <input id="shipToDifferentAddress" v-model="orderInput.shipToDifferentAddress" type="checkbox" name="shipToDifferentAddress" />
          </label>

          <Transition name="scale-y" mode="out-in">
            <div v-if="orderInput.shipToDifferentAddress">
              <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.general.shippingDetails') }}</h2>
              <ShippingDetails v-model="customer.shipping" />
            </div>
          </Transition>

          <!-- Shipping methods -->
          <div v-if="cart.availableShippingMethods.length">
            <h3 class="mb-4 text-xl font-semibold">{{ $t('messages.general.shippingSelect') }}</h3>
            <ShippingOptions :options="cart.availableShippingMethods[0].rates" :active-option="cart.chosenShippingMethods[0]" />
          </div>

          <!-- Pay methods -->
          <div v-if="paymentGateways && paymentGateways.nodes && paymentGateways.nodes.length" class="mt-2 col-span-full">
            <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.billing.paymentOptions') }}</h2>
            <PaymentOptions v-model="orderInput.paymentMethod" class="mb-4" :paymentGateways />
            <StripeElement v-if="stripe" v-show="orderInput.paymentMethod.id == 'stripe'" :stripe @updateElement="handleStripeElement" />
          </div>

          <!-- Order note -->
          <div>
            <h2 class="mb-4 text-xl font-semibold">{{ $t('messages.shop.orderNote') }} ({{ $t('messages.general.optional') }})</h2>
            <textarea
              id="order-note"
              v-model="orderInput.customerNote"
              name="order-note"
              class="w-full"
              rows="4"
              :placeholder="$t('messages.shop.orderNotePlaceholder')"></textarea>
          </div>
        </div>

        <OrderSummary>
          <button
            class="flex items-center justify-center w-full gap-3 p-3 mt-4 font-semibold text-center text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-gray-400"
            :disabled="isCheckoutDisabled">
            {{ buttonText }}<LoadingIcon v-if="isProcessingOrder" color="#fff" size="18" />
          </button>
        </OrderSummary>
      </form>
    </template>
  </div>
</template>

<style lang="postcss">
.checkout-form input[type='text'],
.checkout-form input[type='email'],
.checkout-form input[type='tel'],
.checkout-form input[type='password'],
.checkout-form textarea,
.checkout-form select,
.checkout-form .StripeElement {
  @apply bg-white border rounded-md outline-none border-gray-300 shadow-sm w-full py-2 px-4;
}

.checkout-form input.has-error,
.checkout-form textarea.has-error {
  @apply border-red-500;
}

.checkout-form label {
  @apply my-1.5 text-xs text-gray-600 uppercase;
}

.checkout-form .StripeElement {
  padding: 1rem 0.75rem;
}
</style>
