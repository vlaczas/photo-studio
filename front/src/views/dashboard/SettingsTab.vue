<template>
  <section>
    <h1 class="dashboard__header">Настройки</h1>
    <div class="settings-tab">
      <div class="settings-section">
        <figure class="add-photo">
          <div
            class="add-photo__btn focus-ring"
            role="button"
            tabindex="0"
            @click="openFS"
          >
            <svg viewBox="0 0 24 24" class="">
              <g>
                <path
                  d="M19.708 22H4.292C3.028 22 2 20.972 2 19.708V7.375C2 6.11 3.028 5.083 4.292 5.083h2.146C7.633 3.17 9.722 2 12 2c2.277 0 4.367 1.17 5.562 3.083h2.146C20.972 5.083 22 6.11 22 7.375v12.333C22 20.972 20.972 22 19.708 22zM4.292 6.583c-.437 0-.792.355-.792.792v12.333c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V7.375c0-.437-.355-.792-.792-.792h-2.45c-.317.05-.632-.095-.782-.382-.88-1.665-2.594-2.7-4.476-2.7-1.883 0-3.598 1.035-4.476 2.702-.16.302-.502.46-.833.38H4.293z"
                ></path>
                <path
                  d="M12 8.167c-2.68 0-4.86 2.18-4.86 4.86s2.18 4.86 4.86 4.86 4.86-2.18 4.86-4.86-2.18-4.86-4.86-4.86zm2 5.583h-1.25V15c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.25H10c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.25V11c0-.414.336-.75.75-.75s.75.336.75.75v1.25H14c.414 0 .75.336.75.75s-.336.75-.75.75z"
                ></path>
              </g>
            </svg>
          </div>
          <img
            draggable="false"
            class="user-img"
            :src="userState.photo"
            alt="Ваша фото"
          />
        </figure>
        <base-modal @close-modal="openPhotoDown = false" :open="openPhotoDown">
          <photo-downloader
            @image-uploaded="openPhotoDown = false"
            :srcPhoto="srcPhoto"
            :dispatchPath="'auth/setAvatar'"
          ></photo-downloader>
        </base-modal>
        <div v-if="userState.role !== 'user'" class="additional-details">
          <form @submit.prevent class="basic-form" novalidate>
            <div class="basic-form__block">
              <label for="firstName">Имя</label>
              <input
                type="text"
                id="firstName"
                v-model.trim.lazy="user.firstName"
                autocomplete="given-name"
              />
              <span
                v-if="
                  v$.user.firstName.isName.$invalid ||
                    v$.user.firstName.minLength.$invalid
                "
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
                v-if="
                  v$.user.lastName.isName.$invalid ||
                    v$.user.lastName.minLength.$invalid
                "
                class="basic-form__error-msg"
                >Введите настоящую фамилию</span
              >
            </div>
          </form>
        </div>
      </div>
      <div class="settings-section">
        <form class="basic-form" @submit.prevent="updateUser" novalidate>
          <div class="basic-form__block">
            <label for="username">Никнейм</label>
            <input
              type="text"
              id="username"
              v-model.trim.lazy="user.username"
            />
            <check-input
              @check-result="isFree = $event"
              :inputText="user.username"
              :isInvalidUsername="v$.user.username.$invalid"
              actionName="auth/checkUsername"
              :initValue="initUsername"
            ></check-input>
            <span
              v-if="
                v$.user.username.isValid.$invalid ||
                  v$.user.username.minLength.$invalid
              "
              class="basic-form__error-msg"
              >Разрешены буквы от a-z, _ и точки. Минимум 4 символа</span
            >
          </div>

          <div class="basic-form__block">
            <label for="email">Электронная почта</label>
            <span v-if="userState.googleId" class="basic-form__warning">
              ❗❗ Ваш аккаунт связан с Google. В случае изменения имейла, связь
              с Google будет утрачена. <br /><br />💡 Чтобы позже войти в этот
              аккаунт используйте пароль или гугл с новым имейлом!
            </span>
            <input
              type="email"
              id="email"
              autocomplete="email"
              v-model.trim.lazy="user.email"
            />
            <span
              v-if="v$.user.email.email.$invalid"
              class="basic-form__error-msg"
              >Введите настоящий имейл</span
            >
          </div>

          <div v-if="userState.hasPassword" class="basic-form__block">
            <label for="password">Введите текущий пароль</label>
            <input
              type="password"
              id="password"
              autocomplete="current-password"
              v-model.trim.lazy="user.password"
            />
          </div>

          <div class="basic-form__block">
            <label for="newPassword">Новый пароль</label>
            <input
              type="password"
              id="newPassword"
              autocomplete="new-password"
              v-model.trim.lazy="user.newPassword"
            />
            <span
              v-if="
                v$.user.newPassword.alphaNum.$invalid ||
                  v$.user.newPassword.minLength.$invalid
              "
              class="basic-form__error-msg"
              >Mинимум 6 символов, латинские буквы и цифры</span
            >
          </div>
          <base-button :isLoading="isApiCall" color="white"
            >Сохранить</base-button
          >
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import showNotification from '@/hooks/showNotification';
import useVuelidate from '@vuelidate/core';
import { email, minLength, alphaNum } from '@vuelidate/validators';
import PhotoDownloader from '@/components/UI/PhotoDownloader.vue';
import CheckInput from '@/components/UI/checkInput.vue';

const regExp = new RegExp('^[a-z_.0-9]+$');
const isValid = (value) => regExp.test(value);
const isNameReg = new RegExp("^[а-яА-ЯёЁЇїЄєІіa-zA-Z'‎’]+$");
const isName = (value) => isNameReg.test(value);

export default {
  components: {
    PhotoDownloader,
    CheckInput,
  },
  data() {
    return {
      openPhotoDown: false,
      srcPhoto: '',
      isApiCall: false,
      v$: useVuelidate(),
      user: null,
      initUsername: '',
      isFree: true,
    };
  },
  computed: {
    userState() {
      return this.$store.getters['auth/getUser'];
    },
  },
  created() {
    this.user = { ...this.userState };
    this.initUsername = this.user.username;
  },
  methods: {
    updateUser() {
      if (this.v$.$invalid || !this.isFree) {
        showNotification('Заполните форму правильно 😕');
        return;
      }
      if (
        this.user.newPassword &&
        !this.user.password &&
        this.user.hasPassword
      ) {
        showNotification('Нужно ввести текущий пароль 🔑');
        return;
      }
      if (!this.user.newPassword && this.user.password) {
        return;
      }
      this.isApiCall = true;

      const dataToChange = {};
      let needsGoogleLogOut = false;

      if (this.user.email !== this.userState.email) {
        dataToChange.email = this.user.email;
        if (this.userState.googleId) {
          needsGoogleLogOut = true;
        }
      }
      if (this.user.newPassword && this.user.password) {
        dataToChange.password = this.user.password;
        dataToChange.newPassword = this.user.newPassword;
      } else if (this.user.newPassword && !this.userState.hasPassword) {
        dataToChange.newPassword = this.user.newPassword;
      }

      if (this.user.username !== this.userState.username) {
        dataToChange.username = this.user.username;
      }

      if (dataToChange === {}) {
        this.isApiCall = false;
        return;
      }
      dataToChange._id = this.userState._id;
      dataToChange.firstName = this.user.firstName;
      dataToChange.lastName = this.user.lastName;
      /* eslint-disable no-undef */
      this.$store
        .dispatch('auth/updateUser', dataToChange)
        .then((res) => {
          showNotification('Сохранено ✅');
          if (needsGoogleLogOut && !res.data.data.googleId) {
            const auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut();
          }
        })
        .catch((err) => {
          if (err.response?.status === 400) {
            showNotification('Пароль неверный ❌');
          } else {
            showNotification('Что то сломалось у нас 🤷‍♂️');
          }
        })
        .finally(() => {
          this.isApiCall = false;
        });
    },
    openFS() {
      const fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute('accept', 'image/png, image/jpeg');
      fileInput.click();
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        fileInput.remove();
        if (file.type.indexOf('image/') === -1) {
          showNotification('Выберите картинку, а не это 🙄');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          this.srcPhoto = event.target.result;
          this.openPhotoDown = true;
        };
        reader.readAsDataURL(file);
      };
    },
  },
  validations() {
    return {
      user: {
        email: { email },
        newPassword: { minLength: minLength(6), alphaNum },
        username: {
          minLength: minLength(4),
          isValid,
        },
        firstName: { minLength: minLength(2), isName },
        lastName: { minLength: minLength(3), isName },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.settings-tab {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  flex-grow: 1;
}

.basic-form {
  width: 100%;
  padding: 0 25px 25px;
}

.add-photo {
  width: 200px;
  aspect-ratio: 1 / 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .user-img {
    width: 100%;
    border-radius: 50%;
  }

  &__btn {
    position: absolute;
    z-index: 10;
    width: 50px;
    height: 50px;
    fill: white;
    padding: 10px;
    border-radius: 50%;

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
}

.settings-section {
  flex-basis: 100%;
}
@media (min-width: 1366px) {
  .add-photo {
    width: 220px;
  }
  .settings-section {
    flex-basis: 40%;
  }
}
</style>
