<template>
  <section class="container">
    <spinner v-if="!studio._id"></spinner>
    <section class="studio-profile" v-else>
      <span v-if="isOwner"
        >Рекоммендуемый размер баннера - 800x200 и меньше 5 мегабайт</span
      >
      <div class="studio-profile__header">
        <div class="studio-profile__header-banner">
          <button v-if="isOwner" @click="openFS" class="edit-icon focus-ring">
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
          </button>
          <img
            :src="studio.banner || 'https://picsum.photos/800/200'"
            alt="Баннер студии"
          />
          <img :src="studio.logo" alt="Логотип студии" class="logo" />
        </div>
        <div class="studio-profile__header-info">
          <button
            v-if="isOwner"
            @click="editSocials = !editSocials"
            class="edit-icon focus-ring"
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
          </button>
          <base-modal
            @close-modal="editSocials = !editSocials"
            :open="editSocials"
          >
            <form @submit.prevent="saveEdits" class="basic-form">
              <div class="basic-form__block">
                <label for="insta">Instagram</label>
                <input type="url" id="insta" v-model="studio.contacts.insta" />
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
          <div class="header-info__contacts">
            <span>
              <img src="@/assets/images/location.png" />{{
                studio.address.address
              }}</span
            >
            <span>
              <img src="@/assets/images/room.png" />Количество залов:
              {{ studio.rooms.length || 'Еще нет залов' }}</span
            >
            <span>
              <img src="@/assets/images/phone.png" />Телефон:
              <a :href="'tel:' + studio.contacts.phone">
                {{ studio.contacts.phone }}</a
              ></span
            >
            <span v-if="studio.contacts.addPhone">
              <img src="@/assets/images/phone.png" />Доп. телефон:
              <a :href="'tel:' + studio.contacts.addPhone">
                {{ studio.contacts.addPhone }}</a
              >
            </span>
          </div>
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
      <div class="map">
        <div id="Gmap"></div>
      </div>
      <div class="studio-profile__rooms">
        <button v-if="isOwner" class="add-room" @click="openRoomForm(false)">
          Добавить зал в студию
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 0 24 24"
            width="36px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
          </svg>
        </button>
        <base-modal @close-modal="roomForm = false" :open="roomForm">
          <room-form :roomToChange="roomToChange"></room-form>
        </base-modal>
        <div class="room" v-for="(room, idx) in studio.rooms" :key="room">
          <button
            v-if="isOwner"
            @click="openRoomForm(idx)"
            class="edit-icon focus-ring"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 0 24 24"
              width="20px"
              fill="#000000"
              data-v-6df31cae=""
            >
              <path d="M0 0h24v24H0V0z" fill="none" data-v-6df31cae=""></path>
              <path
                d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                data-v-6df31cae=""
              ></path>
            </svg>
          </button>
          <room-preview :room="room" :studioSlug="studio.slug"></room-preview>
        </div>
      </div>
      <div class="description">
        <button
          v-if="isOwner"
          @click="editDesc = !editDesc"
          class="edit-icon focus-ring"
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
        </button>
        <base-modal @close-modal="editDesc = !editDesc" :open="editDesc">
          <form @submit.prevent="saveEdits" class="basic-form">
            <div class="basic-form__block">
              <label for="desc">Описание</label>
              <textarea rows="20" id="desc" v-model.lazy="studio.description" />
            </div>
            <base-button type="submit" :isLoading="isApiCall"
              >Сохранить</base-button
            >
          </form>
        </base-modal>
        <h2>Описание студии</h2>
        <p>
          {{
            studio.description ||
              'Тут могли бы быть пару слов о студии и ее залах...'
          }}
        </p>
      </div>
    </section>
  </section>
</template>

<script>
import showNotification from '@/hooks/showNotification';
import { defineAsyncComponent } from 'vue';
import RoomPreview from '@/components/studio/RoomPreview.vue';

const RoomForm = defineAsyncComponent({
  loader: () => import('@/components/studio/RoomForm.vue'),
});

export default {
  components: { RoomForm, RoomPreview },
  data() {
    return {
      isOwner: false,
      studio: {},
      room: {},
      isApiCall: false,
      editSocials: false,
      editDesc: false,
      roomForm: false,
      roomToChange: {},
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
    saveEdits() {
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
    checkMap() {
      /* eslint-disable */
      if (window.google.maps) {
        this.initMap();
      } else {
        window.initMap = this.initMap;
        const mapScript = document.createElement('script');
        mapScript.src =
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyAETvDj_QtUBYl45XJZGza56rNkiGQtaMI&libraries=places&region=UA&language=ru&map_ids=fa727c701462337e&callback=initMap';
        mapScript.async = true;
        mapScript.id = 'mapScript';
        document.body.append(mapScript);
      }
    },
    initMap() {
      /* eslint-disable */
      this.$nextTick(() => {
        const mapElem = document.querySelector('#Gmap');
        const map = new window.google.maps.Map(mapElem, {
          center: {
            lat: this.studio.address.location.location[0],
            lng: this.studio.address.location.location[1],
          },
          zoom: 15,
          mapId: 'fa727c701462337e',
        });
        const marker = new window.google.maps.Marker({
          position: {
            lat: this.studio.address.location.location[0],
            lng: this.studio.address.location.location[1],
          },
          map,
          animation: window.google.maps.Animation.DROP,
        });
      });
    },
    openRoomForm(idx) {
      if (idx === false) {
        this.roomToChange = {
          name: '',
          price: 0,
          tags: [],
          photos: [],
        };
      } else {
        this.roomToChange = this.studio.rooms[idx];
      }
      this.roomForm = true;
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
        this.checkMap();
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
.edit-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background-color: var(--col-white);
  }
}

.container {
  min-height: calc(100vh - 88px);
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    transform: scale(2);
  }
}
.studio-profile {
  display: flex;
  flex-direction: column;

  & > span {
    text-align: center;
    font-size: var(--font-lst);
    margin: 0 5px;
    grid-area: notice;
  }

  & > div {
    background-color: white;
    margin-bottom: 30px;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
  }
}
.studio-profile__header {
  grid-area: header;
}
.studio-profile__header-banner {
  position: relative;
  img {
    width: 100%;
    height: 120px;
  }
  .logo {
    position: absolute;
    width: 75px;
    height: 75px;
    top: 75px;
    left: 30px;
    border-radius: 50%;
    background-color: white;
    border: 3px white solid;
  }
}

.studio-profile__header-info {
  position: relative;
  .header-info__name {
    padding: 50px 30px 0;
    text-align: left;
  }

  .header-info__contacts {
    span {
      display: flex;
      align-items: center;
      margin: 15px 10px;
      img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
  }

  .header-info__socials {
    span {
      display: flex;
      align-items: center;
      margin: 15px 10px;
    }

    img {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
  }
}
.studio-profile__rooms {
  grid-area: rooms;
}
.add-room {
  width: 100%;
  border: none;
  background-color: rgb(185, 185, 185);
  padding: 10px 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--col-lgrey);
  }
}
.room {
  position: relative;
}
.map {
  grid-area: map;
  height: 450px;
  #Gmap {
    height: 100%;
  }
}
.description {
  grid-area: desc;
  padding: 30px;
  h2 {
    font-size: var(--font-h2);
    font-weight: 600;
    margin-bottom: 20px;
  }
  p {
    white-space: pre-line;
  }
}
@media (min-width: 768px) {
  .studio-profile {
    margin: 0 auto;
    width: 80vw;
  }
  .studio-profile__header-banner {
    img {
      height: 150px;
    }
    .logo {
      width: 75px;
      height: 75px;
      top: 100px;
      left: 30px;
      border-radius: 50%;
      background-color: white;
      border: 3px white solid;
    }
  }
}

@media (min-width: 1025px) {
  .studio-profile {
    width: 100vw;
    display: grid;
    grid-template-columns: 800px 20%;
    justify-content: center;
    grid-template-rows: 15px minmax(520px, min-content) 480px 400px auto;
    grid-template-areas: 'notice .' 'header rooms' 'map rooms' 'desc rooms' '. rooms';
    column-gap: 30px;
  }
  .studio-profile__header-banner {
    img {
      height: 200px;
    }

    .logo {
      width: 120px;
      height: 120px;
      top: 125px;
    }
  }
  .studio-profile__header-info {
    display: flex;
    flex-wrap: wrap;

    .header-info__name {
      width: 100%;
    }

    .header-info__contacts {
      width: 50%;
    }

    .header-info__socials {
      width: 50%;
    }
  }
}
</style>
