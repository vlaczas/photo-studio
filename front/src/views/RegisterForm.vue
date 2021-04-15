<template>
  <base-modal @close-modal="toggleModal" :open="true">
    <form class="basic-form" @submit.prevent="submitCreds">
      <h1 class="basic-form__header">РЕГИСТРАЦИЯ</h1>
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
          v-model.lazy.trim="email"
        />
        <span
          v-if="v$.email.email.$invalid"
          class="basic-form__error-msg"
          >Введит настоящий имейл</span
        >
      </div>
      <div class="basic-form__block">
        <label for="password">Пароль</label>
        <input
          type="password"
          id="password"
          v-model.trim.lazy="password"
        />
        <span
          v-if="v$.password.minLength.$invalid"
          class="basic-form__error-msg"
          >Пароль должен быть минимум 6 символов</span
        >
      </div>
      <div class="basic-form__block">
        <label for="Сpassword">Подтвердите пароль</label>
        <input
          type="password"
          id="Сpassword"
          v-model.lazy.trim="Cpassword"
        />
        <span
          v-if="
            v$.Cpassword.sameAs.$invalid &&
              v$.Cpassword.required.$response
          "
          class="basic-form__error-msg"
          >Пароли должны совпадать</span
        >
      </div>
      <p>Уже зарегистрированы?</p>
      <router-link
        class="focus-ring"
        :to="{ name: 'LoginForm' }"
        >Войти в аккаунт</router-link
      >
      <base-button type="submit" :isLoading="false"
        >Войти</base-button
      >
    </form>
  </base-modal>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import {
  required,
  email,
  sameAs,
  minLength,
} from '@vuelidate/validators';
import BaseButton from '../components/UI/BaseButton.vue';

export default {
  components: { BaseButton },
  data() {
    return {
      email: '',
      password: '',
      Cpassword: '',
      v$: useVuelidate(),
    };
  },
  methods: {
    toggleModal() {
      this.$router.push('/');
    },
    submitCreds() {
      if (this.v$.$invalid) return;
      this.$store
        .dispatch('auth/registerUser', {
          email: this.email,
          password: this.password,
        })
        .then((res) => console.log(res.data.data))
        .catch((res) => console.error(res.error));
    },
  },
  mounted() {
    /* eslint-disable no-undef */
    window.googleUser = {};
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id:
          '1011107927314-ql5jokbt0f5nktn3mtcnpr6daqj7qk9m.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      const googleBtn = document.getElementById(
        'googleBtn',
      );
      auth2.attachClickHandler(
        googleBtn,
        {},
        (googleUser) => {
          const token = googleUser.getAuthResponse()
            .id_token;
          this.$store
            .dispatch('auth/registerUser', { token })
            .then(() => this.$router.replace('/'))
            .catch(() => {
              console.log('Google поломался!');
            });
        },
      );
    });
  },
  validations() {
    return {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      Cpassword: {
        required,
        sameAs: sameAs(this.password),
      },
    };
  },
};
</script>
