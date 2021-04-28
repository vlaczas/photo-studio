<template>
  <form @submit.prevent="submitPhone" class="basic-form" novalidate>
    <h1 class="basic-form__header">Я – {{ roleName }}</h1>
    <div class="basic-form__block">
      <label for="firstName">Имя</label>
      <input
        type="text"
        id="firstName"
        v-model.trim.lazy="user.firstName"
        autocomplete="given-name"
      />
      <span
        v-if="v$.user.firstName.isName.$invalid"
        class="basic-form__error-msg"
        >Введите настоящее имя</span
      >
    </div>
    <div class="basic-form__block">
      <label for="lastName">Фамилия</label>
      <input
        type="text"
        id="lastName"
        v-model.trim.lazy="user.lastName"
        autocomplete="family-name"
      />
      <span
        v-if="v$.user.lastName.isName.$invalid"
        class="basic-form__error-msg"
        >Введите настоящую фамилию</span
      >
    </div>
    <div class="basic-form__block">
      <label for="phone">Номер телефона</label>
      <span class="basic-form__warning">
        Вам нужно будет подтвердить этот номер телефона
      </span>
      <input
        type="tel"
        id="phone"
        placeholder="+380 99 099 0909"
        autocomplete="tel"
        v-maska="'+380 ## ### ####'"
        @maska="rawPhone"
      />
    </div>
    <base-button id="phone-sub" :isLoading="isApiCall">Готово</base-button>
  </form>
</template>

<script>
import showNotification from '@/hooks/showNotification';
import firebase from '@/assets/js/firebaseAuth';
import useVuelidate from '@vuelidate/core';
import { maska } from 'maska';
import { required } from '@vuelidate/validators';

const isNameReg = new RegExp("^[а-яА-ЯёЁЇїЄєІіa-zA-Z'‎’]+$");
const isName = (value) => isNameReg.test(value);

export default {
  props: {
    userRole: {
      type: String,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
  },
  directives: {
    maska,
  },
  emits: ['add-success'],
  data() {
    return {
      user: { ...this.userInfo },
      v$: useVuelidate(),
      isApiCall: false,
    };
  },
  methods: {
    rawPhone(event) {
      this.user.phone = `+380${event.target.dataset.maskRawValue}`;
    },
    submitPhone() {
      if (this.v$.$invalid) return;
      if (this.user.phone.length < 13) {
        showNotification('Телефон обязателен 📱');
        return;
      }
      this.isApiCall = true;
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'phone-sub',
        {
          size: 'invisible',
        },
      );
      // const phoneNumber = this.user.phone;
      this.user.role = this.userRole;
      const appVerifier = window.recaptchaVerifier;
      firebase
        .auth()
        .signInWithPhoneNumber('+16505553434', appVerifier)
        .then((confirmationResult) => {
          // eslint-disable-next-line
          const code = window.prompt('Введите код полученный в СМС:');
          confirmationResult
            .confirm(code)
            .then(() => {
              this.$store
                .dispatch('auth/updateUser', this.user)
                .then(() => {
                  showNotification(`Ура! теперь вы – ${this.roleName} 🙌`);
                  this.$emit('add-success');
                })
                .catch(() => {
                  showNotification('Такой номер уже используется 📞');
                })
                .finally(() => (this.isApiCall = false));
            })
            .catch(() => {
              this.isApiCall = false;
              showNotification('Неправильный СМС код 🤔');
            });
        })
        .catch(() => {
          this.isApiCall = false;
        });
    },
  },
  computed: {
    roleName() {
      return this.userRole === 'studio' ? 'Владелец студии' : 'Фотограф';
    },
  },
  validations() {
    return {
      user: {
        firstName: {
          isName,
          required,
        },
        lastName: {
          isName,
          required,
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.basic-form {
  color: var(--col-black);

  input {
    color: var(--col-black) !important;
  }
}
</style>
