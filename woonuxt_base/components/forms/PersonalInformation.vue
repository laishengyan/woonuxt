<template>
  <form v-if="customer" class="bg-white" @submit.prevent="saveChanges">
    <div class="grid gap-6 p-8 pb-2 md:grid-cols-2">
      <h3 class="text-xl font-semibold col-span-full">{{ $t('messages.account.personalInfo') }}</h3>
      <div class="w-full">
        <label for="user-name">{{ $t('messages.account.username') }}</label>
        <input disabled v-model="customer.userName" placeholder="John" type="text" />
      </div>
      <div class="w-full">
        <label for="first-name">{{ $t('messages.billing.firstName') }}</label>
        <input v-model="customer.firstName" placeholder="John" type="text" />
      </div>
      <div class="w-full">
        <label for="last-name">{{ $t('messages.billing.lastName') }}</label>
        <input v-model="customer.lastName" placeholder="Doe" type="text" />
      </div>
      <div class="w-full">
        <label for="email">{{ $t('messages.billing.email') }}</label>
        <input v-model="customer.email" placeholder="johndoe@email.com" type="email" />
      </div>
    </div>
    <div class="backdrop-blur-sm bg-opacity-75 col-span-full p-4 sticky bottom-0">
      <button
        class="rounded-md flex font-semibold mx-4 text-white py-2 px-4 gap-4 items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        :class="button.color"
        :disabled="loading">
        <LoadingIcon v-if="loading" color="#fff" size="20" />
        <span>{{ button.text }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const { viewer, customer } = useAuth();
const { t } = useI18n();

const loading = ref<boolean>(false);
const button = ref<{ text: string; color: string }>({ text: t('messages.account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' });

async function saveChanges() {
  loading.value = true;
  button.value.text = t('messages.account.updating');
  const firstName = customer.value.firstName;
  const lastName = customer.value.lastName;
  try {
    const { updateCustomer } = await GqlUpdateCustomer({ input: { id: viewer.value.id, firstName, lastName } });
    if (updateCustomer) button.value = { text: t('messages.account.updateSuccess'), color: 'bg-green-500' };
  } catch (error) {
    button.value = { text: t('messages.account.failed'), color: 'bg-red-500' };
  }

  loading.value = false;

  setTimeout(() => {
    button.value = { text: t('messages.account.updateDetails'), color: 'bg-primary hover:bg-primary-dark' };
  }, 2000);
}
</script>
