<template>
  <base-modal @close-modal="toggleModal" :open="true">
    <form class="basic-form" @submit.prevent="submitCreds">
      <h1 class="basic-form__header">ВХОД</h1>
      <div id="googleBtn">
        <div
          id="g_id_onload"
          data-client_id="1011107927314-ql5jokbt0f5nktn3mtcnpr6daqj7qk9m.apps.googleusercontent.com"
          data-ux_mode="popup"
          data-callback="handleGoogle"
          data-auto_prompt="false"
        ></div>

        <div
          class="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="filled_black"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
        ></div>
      </div>

      <p>или</p>
      <div class="basic-form__block">
        <label for="email">Электронная почта</label>
        <input type="email" id="email" autocomplete="email" v-model="email" />
      </div>
      <div class="basic-form__block">
        <label for="password">Пароль</label>
        <input
          type="password"
          autocomplete="current-password"
          id="password"
          v-model="password"
        />
      </div>
      <p>Еще не зарегистрированы?</p>
      <router-link class="focus-ring" :to="{ name: 'RegisterForm' }"
        >Создать аккаунт</router-link
      >
      <base-button type="submit" :isLoading="isApiCall">Войти</base-button>
    </form>
  </base-modal>
</template>

<script>
import BaseButton from '../components/UI/BaseButton.vue';
import showNotification from '../hooks/showNotification';

export default {
  components: { BaseButton },
  data() {
    return {
      email: '',
      password: '',
      isApiCall: false,
    };
  },
  methods: {
    toggleModal() {
      this.$router.push('/');
    },
    submitCreds() {
      if (this.password.length < 6) {
        showNotification('Слишком короткий пароль 👀');
        return;
      }
      this.isApiCall = true;
      this.$store
        .dispatch('auth/loginUser', {
          email: this.email,
          password: this.password,
        })
        .then(() => this.$router.replace('/'))
        .catch((error) => {
          if (error.response?.status === 400) {
            showNotification('Неверный пароль или имейл ⛔');
          } else if (error.response?.status === 403) {
            showNotification('Вы регистрировались через Google 🤳');
          } else {
            showNotification('Что-то сломалось на нашей стороне 🤦‍♂️');
          }
        })
        .finally(() => (this.isApiCall = false));
    },
  },
  beforeCreate() {
    /* eslint-disable */
    window.handleGoogle = (response) => {
      this.isApiCall = true;

      const token = response.credential;
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
    };

    const googleidentityservice = document.getElementById(
      'googleidentityservice',
    );
    if (googleidentityservice_button_styles) {
      googleidentityservice_button_styles.remove();
      googleidentity.remove();
      googleidentityservice ? googleidentityservice.remove() : false;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'googleidentity';
    script.async = true;
    document.head.append(script);
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

.basic-form__warning {
  color: var(--col-black);
  text-align: center;
  font-size: var(--font-sm);
  font-weight: 600;
  width: 70%;
  margin: 7px 0;
  background-color: rgb(184, 175, 3);
  border-radius: 5px;
  padding: 8px 5px;
}

.basic-form__block {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;

  label {
    font-weight: 600;
  }

  & input {
    width: 70%;
    padding: 5px;
    border: 2px solid var(--col-grey);
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
  height: 70px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .basic-form {
    width: 60vw !important;
    margin: 0 auto;
    border-radius: 20px;
  }
}
@media (min-width: 1366px) {
  .basic-form {
    width: 35vw !important  ;
  }
}
</style>
