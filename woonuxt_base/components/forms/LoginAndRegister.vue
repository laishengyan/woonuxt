<template>
  <div class="login-card-container">
    <div class="login-card-border">
      <div class="hidden sm:flex flex-col items-start">
        <h1 class="text-xl font-semibold lg:text-3xl">{{ $t('messages.account.loginToAccount') }}</h1>
      </div>
      <div class="site_title pt-[2.5rem] pl-[1.25rem] sm:hidden">{{ logoTitle }}</div>
      <form class="px-[1.25rem] mt-[3.25rem] sm:px-0 sm:mt-8" @submit.prevent="handleFormSubmit(userInfo)">
        <label v-if="formView == 'register' || formView == 'forgotPassword'" for="email">
          <input class="login-form-input" id="email" v-model="userInfo.email" :placeholder="$t('messages.account.Email')" type="text" required />
        </label>
        <p v-if="formView == 'forgotPassword'" class="text-sm text-gray-500">{{ $t("messages.account.loginTip") }}</p>
        <div v-if="formView != 'forgotPassword'">
          <label for="username"
            >
            <input class="login-form-input" id="username" v-model="userInfo.username" :placeholder="$t('messages.account.Username')" type="text" required />
          </label>
          <label for="password"
            >
            <PasswordInput  id="password" class="login-form-input mb-4" className="border w-full p-3 px-4 bg-white" v-model="userInfo.password" :placeholder="$t('messages.account.Password')" :required="true" />
          </label>
        </div>
        <Transition name="scale-y" mode="out-in">
          <div v-if="message" class="my-4 text-sm text-green-500" v-html="message"></div>
        </Transition>
        <Transition name="scale-y" mode="out-in">
          <div v-if="errorMessage" class="my-4 text-sm text-red-500" v-html="errorMessage"></div>
        </Transition>
        <div class="text-right cursor-pointer" @click="formView = 'forgotPassword'" v-if="formView == 'login'">{{ $t("messages.account.forgotPassword") }}</div>
        <button class="login-button-back flex items-center justify-center gap-4 mt-4 text-lg">
          <LoadingIcon v-if="isPending" stroke="4" size="16" color="#fff" />
          <span>{{ buttonText }}</span>
        </button>
      </form>
      <div class="my-8 text-center cursor-pointer" @click="handleCheckForm('login')" v-if="formView == 'forgotPassword'">{{ $t("messages.account.backToLogin") }}</div>
      <div v-if="formView == 'login'" class="my-2 text-center">
        {{ $t('messages.account.noAccount') }}
        <span class="font-semibold cursor-pointer text-primary" @click="handleCheckForm('register')">{{ $t('messages.account.accountRegister') }}</span>.
      </div>
      <div v-if="formView == 'register'" class="my-2 text-center">
        {{ $t('messages.account.hasAccount') }}
        <span class="font-semibold cursor-pointer text-primary" @click="handleCheckForm('login')">{{ $t('messages.general.please') }} {{ $t('messages.account.accountLogin') }}</span>.
      </div>
      <div v-if="formView == 'login'" class="flex items-center justify-center">
        <div class="or-line-split"></div>
        <div>{{ $t('messages.account.or') }}</div>
        <div class="or-line-split"></div>
      </div>
      <div v-if="formView == 'login'" class="login-btn-setting">
        <img src="/images/G.png" alt="" loading="lazy">
        <span>{{ $t('messages.account.googleLogin') }}</span>
        <span> </span>
      </div>
      <div v-if="formView == 'login'" class="login-btn-setting">
        <img src="/images/F.png" alt="" loading="lazy">
        <span>{{ $t('messages.account.facebookLogin') }}</span>
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
const generalSettings = inject('generalSettings');
const logoTitle = computed(() => {
  return generalSettings?.value?.generalSettings?.title || "oriental-art.net"
})
const login = async (userInfo) => {
  const { success, error } = await loginUser(userInfo, t);
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
    message.value = t("messages.account.passwordResetTip");
  } else {
    errorMessage.value = error;
  }
};

const handleCheckForm = (val) => {
  formView.value = val;
  message.value = '';
  errorMessage.value = '';
}

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
  @apply w-full sm:w-[500px] min-h-[594px] bg-[#fff] sm:mt-[143px] sm:ml-[650px] sm:p-[8px];
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
  background: url("/images/login-btn-setting.png") no-repeat;
  background-size: 100% 100%;
  @apply mx-[1.25rem] sm:mx-0 sm:w-[420px] h-[50px] mt-[1rem] sm:mt-[20px] px-[20px] flex items-center justify-between cursor-pointer;
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
.site_title {
  font-family: PingFang SC-Heavy;
  font-weight: 800;
  font-size: 1.88rem;
  color: #1A1A1A;
}
@media (min-width: 640px) {
  .login-card-border {
    width: 100%;
    height: 100%;
    min-height: 578px;
    background-image: url("/images/login-card-border.png");
    background-size: 100% 100%;
    padding: 32px;
  }
  .login-card-container {
    box-shadow: 0px 4px 40px 1px rgba(32,32,32,0.1);
    border-radius: 2px 2px 2px 2px;
  }
  .login-btn-setting:hover {
    background: url("/images/login-btn-setting-hover.png") no-repeat;
  }
}
</style>
