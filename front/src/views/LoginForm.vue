<template>
  <base-modal @close-modal="toggleModal" :open="true">
    <form class="basic-form" @submit.prevent="submitCreds">
      <h1 class="basic-form__header">ВХОД</h1>
      <div
        tabindex="0"
        id="googleBtn"
        class="customGPlusSignIn focus-ring"
      >
        <span class="g-icon"></span>
        <span class="buttonText">Войти через Google</span>
      </div>
      <p>или</p>
      <div class="basic-form__block">
        <label for="email">Электронная почта</label>
        <input
          type="email"
          id="email"
          autocomplete="email"
          v-model="email"
        />
      </div>
      <div class="basic-form__block">
        <label for="password">Пароль</label>
        <input
          type="password"
          id="password"
          v-model="password"
        />
      </div>
      <p>Еще не зарегистрированы?</p>
      <router-link
        class="focus-ring"
        :to="{ name: 'RegisterForm' }"
        >Создать аккаунт</router-link
      >
      <base-button type="submit" :isLoading="false"
        >Войти</base-button
      >
    </form>
  </base-modal>
</template>

<script>
import BaseButton from '../components/UI/BaseButton.vue';

export default {
  components: { BaseButton },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    toggleModal() {
      this.$router.push('/');
    },
    submitCreds() {
      this.$store.dispatch('auth/loginUser');
    },
  },
  mounted() {
    /* eslint-disable no-undef */
    // window.googleUser = {};
    // window.startGoogle = () => {
    //   gapi.load('auth2', () => {
    //     const auth2 = gapi.auth2.init({
    //       client_id:
    //         '1011107927314-ql5jokbt0f5nktn3mtcnpr6daqj7qk9m.apps.googleusercontent.com',
    //       cookiepolicy: 'single_host_origin',
    //     });
    //     const googleBtn = document.getElementById('googleBtn');
    //     auth2.attachClickHandler(googleBtn, {}, (googleUser) => {
    //       const token = googleUser.getAuthResponse().id_token;
    //       store
    //         .dispatch('auth/loginUser', token)
    //         .then(() => router.replace('/'))
    //         .catch(() => {
    //           console.log('Google поломался!');
    //         });
    //     });
    //   });
    // };
    // window.startGoogle();
  },
};
</script>

<style lang="scss">
.basic-form {
  width: 100vw;
  background-color: white;
  padding: 25px;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: auto;

  &__header {
    margin: 25px auto;
  }

  p {
    margin: 15px auto;
  }

  .base-btn {
    align-self: flex-end;
    margin-top: 35px;
  }

  a {
    width: fit-content;
    margin: 0 auto;
  }

  &__error-msg {
    color: var(--col-red);
    font-size: var(--font-sm);
    position: absolute;
    bottom: -12px;
  }
}
.basic-form__block {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;

  & input {
    width: 70%;
    padding: 5px;
    border-top: none;
    border-right: none;
    border-left: none;
    margin: 5px auto;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 1px rgb(95, 105, 255);
    }
  }
}
#googleBtn {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  width: 70%;
  min-width: 230px;
  margin: 0 auto;
  padding: 0 10px;
  border: 2px solid black;
  border-radius: 7px;
  cursor: pointer;
  &:active {
    transform: scale(0.97);
  }
}

span.buttonText {
  flex-grow: 1;
  text-align: center;
}
span.g-icon {
  background: url('/img/g-normal.png') transparent 0 50%
    no-repeat;
  background-size: 36px;
  width: 36px;
  height: 36px;
  display: block;
}
@media (min-width: 768px) {
  .basic-form {
    width: 60vw;
    border-radius: 20px;
  }
}
@media (min-width: 1367px) {
  .basic-form {
    width: 30vw;
  }
}
</style>
