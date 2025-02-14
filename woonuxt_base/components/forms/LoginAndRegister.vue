<template>
  <div class="login-card-container">
    <div class="login-card-border">
      <div class="flex flex-col items-start">
        <h1 class="text-xl font-semibold lg:text-3xl">{{ $t('messages.account.loginToAccount') }}</h1>
      </div>
      <form class="login-form-container mt-8" @submit.prevent="handleFormSubmit(userInfo)">
        <label v-if="formView == 'register' || formView == 'forgotPassword'" for="email">
          <input class="login-form-input" id="email" v-model="userInfo.email" placeholder="Email" type="text" required />
        </label>
        <p v-if="formView == 'forgotPassword'" class="text-sm text-gray-500">Please enter your email address and we will send you a link to reset your password.</p>
        <div v-if="formView != 'forgotPassword'">
          <label for="username"
            >
            <input class="login-form-input" id="username" v-model="userInfo.username" placeholder="Username" type="text" required />
          </label>
          <label for="password"
            >
            <PasswordInput  id="password" class="login-form-input mb-4" className="border w-full p-3 px-4 bg-white" v-model="userInfo.password" placeholder="Password" :required="true" />
          </label>
        </div>
        <Transition name="scale-y" mode="out-in">
          <div v-if="message" class="my-4 text-sm text-green-500" v-html="message"></div>
        </Transition>
        <Transition name="scale-y" mode="out-in">
          <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
        </Transition>
        <div class="text-right cursor-pointer" @click="formView = 'forgotPassword'" v-if="formView == 'login'">Forgot password?</div>
        <button class="login-button-back flex items-center justify-center gap-4 mt-4 text-lg">
          <LoadingIcon v-if="isPending" stroke="4" size="16" color="#fff" />
          <span>{{ buttonText }}</span>
        </button>
      </form>
      <div class="my-8 text-center cursor-pointer" @click="formView = 'login'" v-if="formView == 'forgotPassword'">Back to login</div>
      <div v-if="formView == 'login'" class="my-2 text-center">
        {{ $t('messages.account.noAccount') }}
        <a class="font-semibold cursor-pointer text-primary" @click="formView = 'register'">{{ $t('messages.account.accountRegister') }}</a
        >.
      </div>
      <div v-if="formView == 'register'" class="my-2 text-center">
        {{ $t('messages.account.hasAccount') }}
        <a class="font-semibold cursor-pointer text-primary" @click="formView = 'login'">{{ $t('messages.general.please') }} {{ $t('messages.account.accountLogin') }}</a
        >.
      </div>
      <div v-if="formView == 'login'" class="flex items-center justify-center">
        <div class="or-line-split"></div>
        <div>or</div>
        <div class="or-line-split"></div>
      </div>
      <div v-if="formView == 'login'" class="login-btn-setting">
        <img src="/images/G.png" alt="">
        <span>Log in with Google</span>
        <span> </span>
      </div>
      <div v-if="formView == 'login'" class="login-btn-setting">
        <img src="/images/F.png" alt="">
        <span>Log in with Facebook</span>
        <span> </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const { loginUser, isPending, registerUser, sendResetPasswordEmail } = useAuth();
const userInfo = ref({ email: '', password: '', username: '' });
const formView = ref('login');
const message = ref('');
const errorMessage = ref('');

const login = async (userInfo) => {
  const { success, error } = await loginUser(userInfo);
  switch (error) {
    case 'invalid_username':
      errorMessage.value = t('messages.error.invalidUsername');
      break;
    case 'incorrect_password':
      errorMessage.value = t('messages.error.incorrectPassword');
      break;
    default:
      errorMessage.value = error;
      break;
  }

  if (success) {
    errorMessage.value = '';
    message.value = t('messages.account.loggingIn');
  }
};

const handleFormSubmit = async (userInfo) => {
  if (formView.value === 'register') {
    const { success, error } = await registerUser(userInfo);
    if (success) {
      errorMessage.value = '';
      message.value = t('messages.account.accountCreated') + ' ' + t('messages.account.loggingIn');
      setTimeout(() => {
        login(userInfo);
      }, 2000);
    } else {
      errorMessage.value = error;
    }
  } else if (formView.value === 'forgotPassword') {
    resetPassword(userInfo);
  } else {
    login(userInfo);
  }
};

const resetPassword = async (userInfo) => {
  const { success, error } = await sendResetPasswordEmail(userInfo.email);
  if (success) {
    errorMessage.value = '';
    message.value = 'If your email address is registered with us, you will receive an email with a link to reset your password.';
  } else {
    errorMessage.value = error;
  }
};

const buttonText = computed(() => {
  if (formView.value === 'login') {
    return t('messages.account.login');
  } else if (formView.value === 'register') {
    return t('messages.account.register');
  } else if (formView.value === 'forgotPassword') {
    return t('messages.account.sendPasswordResetEmail');
  }
  return 'login';
});
</script>

<style lang="postcss" scoped>
input,
button {
  @apply border rounded-lg mb-4 w-full p-3 px-4 bg-white;
}

form button {
  @apply rounded-lg font-bold bg-gray-800 text-white py-3 px-8 hover:bg-gray-800;
}
.login-card-container {
  width: 500px;
  height: 594px;
  background: #fff;
  margin-top: 143px;
  margin-left: 650px;
  box-shadow: 0px 4px 40px 1px rgba(32,32,32,0.1);
  border-radius: 2px 2px 2px 2px;
  padding: 8px;
}
.login-card-border {
  width: 100%;
  height: 100%;
  background-image: url("/images/login-card-border.png");
  background-size: cover;
  padding: 32px;
}
.login-form-input {
  border-radius: 0;
}
.login-form-input:focus {
  border: 1px solid red;
  border-color: red;
}
.login-button-back {
  background: #fff;
  border: none;
  background: url("/images/login-btn.png") no-repeat;
}
.login-button-back:hover {
  background: url("/images/login-btn-hover.png") no-repeat;
}
.or-line-split {
  width: 54px;
  height: 1px;
  background: #CBCBCB;
  margin: 0 7px;
}
.login-btn-setting {
  width: 420px;
  height: 50px;
  margin-top: 20px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: url("/images/login-btn-setting.png") no-repeat;
}
.login-btn-setting:hover {
  background: url("/images/login-btn-setting-hover.png") no-repeat;
}
.login-btn-setting >img {
  width: 16px;
  height: 16px;
}
.login-btn-setting >span {
  font-family: HarmonyOS Sans-Medium;
  font-weight: 500;
  font-size: 13px;
  color: #686868;
}
.login-btn-setting >span:nth-child(3) {
  display: inline-block;
  width: 16px;
}
</style>
