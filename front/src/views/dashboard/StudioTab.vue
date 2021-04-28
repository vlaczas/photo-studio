<template>
  <section>
    <h1 class="dashboard__header">Настройки студии</h1>
    <div class="studioTab">
      <figure v-if="userState.studio" class="add-photo">
        <div
          class="add-photo__btn focus-ring"
          role="button"
          tabindex="0"
          @click="openFS"
        >
          <svg viewBox="0 0 24 24">
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
          :src="studio.logo || '/img/default-studio-logo.png'"
          alt="Ваша фото"
        />
      </figure>
      <base-modal @close-modal="openPhotoDown = false" :open="openPhotoDown">
        <photo-downloader
          @image-uploaded="updateLogo"
          :srcPhoto="srcPhoto"
          :dispatchPath="'studio/setLogo'"
        ></photo-downloader>
      </base-modal>
      <div v-if="studio.slug">
        <router-link
          v-if="studio.slug"
          :to="{
            name: 'StudioProfile',
            params: { slug: studio.slug },
          }"
        >
          <base-button color="white">Профиль студии</base-button>
        </router-link>
      </div>
      <form class="basic-form">
        <div class="basic-form__block">
          <label for="address">Адрес</label>
          <span class="basic-form__warning">
            💡 Если ваша студия есть на Гугл Картах, вы можете ввести просто
            название студии
          </span>
          <input
            ref="address"
            required
            type="text"
            id="address"
            v-model="studio.address.address"
            placeholder="Введите название студии или адрес"
          />
        </div>
        <div class="basic-form__block">
          <label for="studioName">Название студии</label>
          <input
            required
            type="text"
            id="studioName"
            v-model.trim.lazy="studio.name"
          />
        </div>
        <div class="basic-form__block">
          <label for="phone">Телефоны для записи</label>
          <input
            required
            placeholder="+380 99 099 0909"
            v-maska="'+380 ## ### ####'"
            type="tel"
            id="phone"
            v-model.trim.lazy="studio.contacts.phone"
          />
        </div>
        <div class="basic-form__block">
          <label for="addPhone">Дополнительный телефон</label>
          <input
            placeholder="+380 99 099 0909"
            v-maska="'+380 ## ### ####'"
            type="tel"
            id="addPhone"
            v-model.trim.lazy="studio.contacts.addPhone"
          />
        </div>
        <div class="basic-form__block">
          <label for="website">Сайт</label>
          <input
            placeholder="https://website.com"
            type="url"
            id="website"
            v-model.trim.lazy="studio.contacts.website"
          />
        </div>

        <base-button
          @click.prevent="updateStudio"
          :isLoading="isApiCall"
          color="white"
          >Cохранить</base-button
        >
      </form>
    </div>
  </section>
</template>

<script>
import showNotification from '@/hooks/showNotification';
import PhotoDownloader from '@/components/UI/PhotoDownloader.vue';
import { maska } from 'maska';

export default {
  components: {
    PhotoDownloader,
  },
  directives: {
    maska,
  },
  data() {
    return {
      openPhotoDown: false,
      srcPhoto: '',
      user: null,
      isApiCall: false,
      studio: {
        contacts: {},
        address: {},
        name: '',
      },
    };
  },
  computed: {
    userState() {
      return this.$store.getters['auth/getUser'];
    },
    studioState() {
      return this.$store.getters['studio/getStudio'];
    },
  },
  mounted() {
    const input = this.$refs.address;
    /* eslint-disable no-undef */
    // this is a center of Kharkiv
    const center = { lat: 49.989867, lng: 36.25731 };
    // rect 10km
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: 'ua' },
      fields: [
        'geometry',
        'international_phone_number',
        'name',
        'place_id',
        'formatted_address',
        'website',
        'types',
      ],
      origin: center,
      strictBounds: true,
    };

    const initAutocomplete = () => {
      window.autocomplete = new google.maps.places.Autocomplete(input, options);
      window.autocomplete.addListener('place_changed', () => {
        const place = window.autocomplete.getPlace();
        if (!place.geometry) {
          showNotification('Выберите правильный адрес студии 🚧');
        } else {
          this.fillOutFields(place);
        }
      });
    };

    if (!document.getElementById('maps')) {
      const GMapsScript = document.createElement('script');
      GMapsScript.id = 'maps';
      GMapsScript.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAETvDj_QtUBYl45XJZGza56rNkiGQtaMI&libraries=places&region=UA&language=ru';
      document.head.append(GMapsScript);

      GMapsScript.onload = () => initAutocomplete();
    } else initAutocomplete();
  },
  created() {
    this.user = this.$store.getters['auth/getUser'];
    if (this.user.studio && !this.studioState) {
      this.$store
        .dispatch('studio/getOwnStudio', { _id: this.user.studio })
        .then((res) => (this.studio = res.data.data))
        .catch((err) => err.response?.data);
    } else if (this.studioState) {
      this.studio = { ...this.studioState };
    }
  },
  methods: {
    updateLogo() {
      this.openPhotoDown = false;
      this.studio = this.$store.getters['studio/getStudio'];
    },
    updateStudio(event) {
      /* eslint-disable operator-linebreak */
      if (!event.clientY && !event.clientX) return;
      this.isApiCall = true;
      const action = this.userState.studio
        ? 'studio/updateStudio'
        : 'studio/createStudio';
      this.$store
        .dispatch(action, this.studio)
        .then((res) => {
          if (res.status === 201) {
            showNotification(
              'Ваша студия создана, теперь можете загрузить логотип 👏',
            );
          } else {
            showNotification('Сохранено ✅');
          }
          this.studio = res.data.data;
        })
        .catch(() => showNotification('Что-то пошло не так 🤷‍♂️'))
        .finally(() => (this.isApiCall = false));
    },
    fillOutFields(place) {
      if (place.types.indexOf('establishment') >= 0) {
        this.studio.name = place.name;
      } else {
        this.studio.name = '';
      }
      this.studio.address = {
        address: place.formatted_address.split(', Харківська')[0],
        location: [
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ],
        gPlaceId: place.place_id,
      };
      this.studio.contacts = {
        website: place.website,
        phone: place.international_phone_number,
      };
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
};
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.studioTab {
  & > div {
    width: fit-content;
    margin: 0 auto;
  }
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
</style>
