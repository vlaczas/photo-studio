<template>
  <base-modal @close-modal="toggleModal" :open="true">
    <form
      class="basic-form"
      @submit.prevent="submitCreds"
      novalidate
    >
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
        <label for="username">Придумайте имя</label>
        <div class="checked-input">
          <span
            v-if="isFree === false"
            class="checked-input__checker"
            >❌</span
          >
          <span
            v-else-if="isFree === true"
            class="checked-input__checker"
            >✅</span
          >
          <span
            v-else-if="isApiCall"
            class="checked-input__checker"
            ><spinner></spinner
          ></span>
          <input
            @change="checkUsername"
            type="text"
            id="username"
            v-model.trim.lazy="username"
          />
        </div>
        <span
          v-if="
            (!v$.username.required.$invalid &&
              v$.username.isValid.$invalid) ||
              v$.username.minLength.$invalid
          "
          class="basic-form__error-msg"
          >Разрешены буквы от a-z, _ и точки. Минимум 4
          символа</span
        >
      </div>
      <div class="basic-form__block">
        <label for="email">Электронная почта</label>
        <input
          type="email"
          id="email"
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
          v-model.trim="Cpassword"
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
      <base-button type="submit" :isLoading="isApiCall"
        >Регистрация</base-button
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
import BaseButton from '@/components/UI/BaseButton.vue';
import showNotification from '../hooks/showNotification';

const regExp = new RegExp('^[a-z_.0-9]+$');
const isValid = (value) => regExp.test(value);

export default {
  components: { BaseButton },
  data() {
    return {
      email: '',
      password: '',
      Cpassword: '',
      username: '',
      v$: useVuelidate(),
      isApiCall: false,
      isFree: '',
    };
  },
  computed: {},
  methods: {
    checkUsername() {
      if (!this.username || this.v$.username.$invalid) {
        this.isFree = '';
        return;
      }
      if (!this.v$.username.$invalid) {
        this.isApiCall = true;
        this.$store
          .dispatch('auth/checkUsername', this.username)
          .then((res) => {
            if (res.data.success) {
              this.isFree = false;
              showNotification('Такое имя уже занято ❌');
            } else {
              this.isFree = true;
            }
          })
          .catch(() => {
            showNotification(
              'Что-то сломалось на нашей стороне 🤦‍♂️',
            );
          })
          .finally(() => (this.isApiCall = false));
      }
    },
    toggleModal() {
      this.$router.push('/');
    },
    submitCreds() {
      if (this.v$.$invalid || !this.isFree) {
        showNotification('Заполните форму правильно 😕');
        return;
      }
      this.isApiCall = true;
      this.$store
        .dispatch('auth/registerUser', {
          email: this.email,
          password: this.password,
          username: this.username,
        })
        .then(() => {
          showNotification('Добро пожаловать 🎈🎈🎈');
          this.$router.replace('/');
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            showNotification('Вы уже зарегистрированы  ✔');
          } else {
            showNotification(
              'Что-то сломалось на нашей стороне 🤦‍♂️',
            );
          }
        })
        .finally(() => (this.isApiCall = false));
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
          this.isApiCall = true;

          const token = googleUser.getAuthResponse()
            .id_token;
          this.$store
            .dispatch('auth/loginUser', { token })
            .then(() => this.$router.replace('/'))
            .catch(() => {
              this.$store.dispatch(
                'helpers/showNotification',
                'Google поломался 🤦‍♂️',
              );
            })
            .finally(() => (this.isApiCall = false));
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
      username: {
        required,
        minLength: minLength(4),
        isValid,
      },
    };
  },
};
</script>
