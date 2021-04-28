<template>
  <section class="studio-profile">
    <spinner v-if="!studio._id"></spinner>
    <section v-else>
      <main>
        <span v-if="isOwner"
          >Рекоммендуемый размер баннера - 880x200 и меньше 5 мегабайт</span
        >
        <div class="studio-profile__header">
          <div class="studio-profile__header-banner">
            <div v-if="isOwner" @click="openFS" class="edit-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path
                  d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                />
              </svg>
            </div>
            <img
              :src="studio.banner || 'https://picsum.photos/880/200'"
              alt="Баннер студии"
            />
            <img :src="studio.logo" alt="Логотип студии" class="logo" />
          </div>
          <div class="studio-profile__header-info">
            <div
              v-if="isOwner"
              @click="editSocials = !editSocials"
              class="edit-icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path
                  d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                />
              </svg>
            </div>
            <base-modal
              @close-modal="editSocials = !editSocials"
              :open="editSocials"
            >
              <form @submit.prevent="saveSocials" class="basic-form">
                <div class="basic-form__block">
                  <label for="insta">Instagram</label>
                  <input
                    type="url"
                    id="insta"
                    v-model="studio.contacts.insta"
                  />
                </div>
                <div class="basic-form__block">
                  <label for="fb">Facebook</label>
                  <input type="url" id="fb" v-model="studio.contacts.fb" />
                </div>
                <div class="basic-form__block">
                  <label for="website">Сайт</label>
                  <input
                    type="url"
                    id="website"
                    v-model="studio.contacts.website"
                  />
                </div>
                <base-button type="submit" :isLoading="isApiCall"
                  >Сохранить</base-button
                >
              </form>
            </base-modal>
            <h1 class="header-info__name">
              {{ studio.name }}
            </h1>
            <span class="header-info__contacts">
              <img src="@/assets/images/location.png" />{{
                studio.address.address
              }}</span
            >
            <span class="header-info__contacts">
              <img src="@/assets/images/room.png" />Количество залов:
              {{ studio.rooms.length || 'Еще нет залов' }}</span
            >
            <span class="header-info__contacts">
              <img src="@/assets/images/phone.png" />Телефон:
              <a :href="'tel:' + studio.contacts.phone">
                {{ studio.contacts.phone }}</a
              ></span
            >
            <span class="header-info__contacts" v-if="studio.contacts.addPhone">
              <img src="@/assets/images/phone.png" />Доп. телефон:
              <a :href="'tel:' + studio.contacts.addPhone">
                {{ studio.contacts.addPhone }}</a
              >
            </span>
            <div class="header-info__socials">
              <a
                :href="studio.contacts.fb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span v-if="studio.contacts.insta || isOwner">
                  <img src="@/assets/images/instagram.png" alt="instagram" />
                  @{{ studio.contacts.insta?.split('/')[3] }}
                </span></a
              >
              <a
                :href="studio.contacts.insta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span v-if="studio.contacts.fb || isOwner"
                  ><img src="@/assets/images/facebook.png" alt="facebook" /> @{{
                    studio.contacts.fb?.split('/')[3]
                  }}</span
                ></a
              >
              <a
                :href="studio.contacts.website"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span v-if="studio.contacts.website || isOwner">
                  <img src="@/assets/images/website.png" alt="сайт" />
                  {{ studio.contacts.website }}</span
                ></a
              >
            </div>
          </div>
        </div>
      </main>
      <aside class="studio-profile__rooms"></aside>
    </section>
  </section>
</template>

<script>
import showNotification from '@/hooks/showNotification';

export default {
  data() {
    return {
      isOwner: false,
      studio: {},
      isApiCall: false,
      editSocials: false,
    };
  },
  methods: {
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
        const form = new FormData();
        form.append('photos', file);
        this.$store
          .dispatch('studio/setBanner', form)
          .then(showNotification('Баннер изменен ✅'))
          .catch(() => {
            showNotification(
              'Картинка не сохранена! Она должна быть в прафильном формате и меньше 5MB 📢',
            );
          });
        const reader = new FileReader();
        reader.onload = (event) => {
          this.studio.banner = event.target.result;
        };
        reader.readAsDataURL(file);
      };
    },
    saveSocials() {
      this.isApiCall = true;
      this.$store
        .dispatch('studio/updateStudio', this.studio)
        .then((res) => {
          this.studio = res.data.data;
          this.isApiCall = false;
          showNotification('Сохранено ✅');
          this.editSocials = false;
        })
        .catch(() => {
          showNotification('Что-то пошло не так 🤷‍♂️');
        });
    },
  },
  computed: {
    user() {
      return this.$store.getters['auth/getUser'];
    },
  },
  created() {
    this.$store
      .dispatch('studio/getSingleStudio', this.$route.params)
      .then((res) => {
        this.studio = res.data.data;
        if (this.studio._id === this.user?.studio) {
          this.isOwner = true;
          this.$store.commit('studio/setOwnerStudio', this.studio);
        }
      })
      .catch((res) => console.log(res.data.error));
  },
};
</script>

<style lang="scss" scoped>
.studio-profile {
  min-height: calc(100vh - 91px);
  display: flex;
  justify-content: center;
  & > div {
    align-self: center;
    transform: scale(2.5);
  }

  section {
    display: flex;
    justify-content: center;
  }
  span {
    font-size: var(--font-sm);
    font-weight: 600;
    display: flex;
    justify-content: center;
  }
  .edit-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: var(--col-grey);
    }
  }

  .logo {
    position: absolute;
    width: 150px;
    height: 150px;
    left: 25px;
    top: 110px;
    border-radius: 50%;
    border: 4px white solid;
    background-color: white;
  }

  &__header {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
    &-banner {
      position: relative;
      width: 45vw;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .studio-profile__header-info {
    position: relative;
    display: grid;
    grid-template-columns: 70% 30%;
    padding: 30px;
    padding-top: 70px;
    justify-items: flex-start;
  }
  .header-info__name {
    font-size: var(--font-h1);
    font-weight: 600;
  }

  .header-info__contacts {
    grid-column: 1 / 2;
    font-weight: 400;
    align-items: center;
    font-size: var(--font-st);
    margin-top: 10px;
    img {
      width: 24px;
      margin-right: 5px;
    }
    a {
      font-weight: 600;
      margin-left: 5px;
      color: black;
    }
  }

  .header-info__socials {
    grid-column: 2 / 3;
    grid-row: 2 / 5;
    span {
      align-items: center;
      justify-content: flex-start;
      word-break: break-all;
      margin-top: 10px;
      font-size: var(--font-st);
      font-weight: 400;
      a {
        font-weight: 400;
        color: black;
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
    }
  }

  .studio-profile__rooms {
    margin-left: 30px;
    background-color: white;
    width: 20vw;
    height: 420px;
    border-radius: 10px;
  }
}
</style>
