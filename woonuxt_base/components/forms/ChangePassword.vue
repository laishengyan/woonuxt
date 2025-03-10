<template>
  <div class="grid gap-8 account-form">
    <form class="bg-white mt-4" @submit.prevent="updatePassword">
      <div class="grid p-8 gap-6 pb-2 md:grid-cols-2">
        <h3 class="font-semibold text-xl col-span-full">{{ $t('messages.account.changePassword') }}</h3>
  
        <input v-model="viewer.username" type="hidden" />
  
        <div class="w-full">
          <label for="new-password">{{ $t('messages.account.newPassword') }}</label>
          <input v-model="password.new" placeholder="••••••••••" type="text" required />
        </div>
  
        <div class="w-full">
          <label for="new-password-confirm">{{ $t('messages.account.confirmNewPassword') }}</label>
          <input v-model="password.confirm" placeholder="••••••••••" type="text" required />
        </div>
  
        <Transition name="scale-y" mode="out-in">
          <div v-if="errorMessage" class="w-full text-sm text-red-500" v-html="errorMessage"></div>
        </Transition>
      </div>
  
      <div class="bg-white backdrop-blur-sm bg-opacity-75 col-span-full p-4 sticky bottom-0">
        <button
          class="rounded-md flex font-semibold text-white py-2 px-4 ml-4 gap-4 items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          :class="button.color"
          :disabled="loading">
          <LoadingIcon v-if="loading" color="#fff" size="20" />
          <span>{{ button.text }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { viewer, loginUser } = useAuth();
const { t } = useI18n();

const password = ref<{ new: string; confirm: string }>({ new: '', confirm: '' });
const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('messages.account.updatePassword'), color: 'bg-primary hover:bg-primary-dark' });
const errorMessage = ref<string>('');

const updatePassword = async () => {
  errorMessage.value = '';
  if (password.value.new !== password.value.confirm) {
    errorMessage.value = t("messages.account.updatePsdError");
    return;
  }

  try {
    loading.value = true;
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, password: password.value.new } });
    if (updateCustomer) {
      button.value = { text: t('messages.account.updateSuccess'), color: 'bg-green-500' };
      const { success, error } = await loginUser({ username: viewer.value.username, password: password.value.new });
      if (error) {
        errorMessage.value = error;
        button.value = { text: t('messages.account.failed'), color: 'bg-red-500' };
      }
      if (success) {
        password.value = { new: '', confirm: '' };
      }
    }
  } catch (error) {
    console.error(error);
    const gqlError = error?.gqlErrors?.[0]?.message;
    errorMessage.value = gqlError || t('messages.account.updatePsdError2');
    button.value = { text: t('messages.account.failed'), color: 'bg-red-500' };
  }

  loading.value = false;

  setTimeout(() => {
    button.value = { text: t('messages.account.updatePassword'), color: 'bg-primary hover:bg-primary-dark' };
  }, 2000);
};
</script>
<style lang="postcss">
.account-form input[type='text'],
.account-form input[type='email'],
.account-form input[type='tel'],
.account-form input[type='password'],
.account-form textarea,
.account-form .StripeElement,
.account-form select {
  @apply bg-white border rounded-md outline-none w-full py-2 px-4 block md:bg-gray-50;
}

.account-form label {
  @apply text-xs mb-1 text-gray-600 inline-block uppercase;
}
</style>