<template>
  <form @submit.prevent="saveRoom" class="basic-form">
    <div class="basic-form__block">
      <label for="roomName">Название зала</label>
      <input required type="text" id="roomName" v-model.trim.lazy="room.name" />
    </div>
    <div class="basic-form__block">
      <label for="roomPrice">Цена в час (грн.)</label>
      <input
        required
        pattern="[0-9]+$"
        type="text"
        id="roomPrice"
        v-model.number="room.price"
      />
    </div>
    <div class="basic-form__block">
      <label for="dragInput">Добавить фотографии зала</label>
      <span class="basic-form__warning"
        >📌 Рекоммендуемое разрешение фотографий - 3х4, размером до 5 мегабайт.
        Максимальное количество фотографий на 1 зал - 10 штук.</span
      >
      <input-image
        :alreadyUploaded="room.photos.length"
        @images-change="newPhotos = $event"
      ></input-image>
    </div>
    <div class="basic-form__block">
      <label for="roomDesc">Описание зала</label>
      <textarea
        id="roomDesc"
        rows="7"
        v-model.lazy="room.description"
      ></textarea>
    </div>
    <div class="basic-form__block">
      <label for="dragInput">Теги</label>
      <span class="basic-form__warning"
        >📌 Теги зала - это поисковые ключи по которым ваш зал можно будет найти
        в поиске. Просим вас быть честными, во избежание неловких ситуаций с
        клиентами 🤬
      </span>
      <fieldset>
        <input
          id="tag1"
          type="checkbox"
          value="Дневной свет"
          v-model="room.tags"
        />
        <label for="tag1">Дневной свет</label>

        <input id="tag2" type="checkbox" value="Вспышки" v-model="room.tags" />
        <label for="tag2">Вспышки</label>
      </fieldset>
    </div>
    <base-button type="submit" :isLoading="isApiCall">Сохранить</base-button>
  </form>
</template>

<script>
import showNotification from '../../hooks/showNotification';
import InputImage from '../UI/InputImage.vue';

export default {
  components: { InputImage },
  emits: ['close-modal'],
  props: {
    roomToChange: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      room: { ...this.roomToChange },
      newPhotos: [],
      isApiCall: false,
    };
  },
  computed: {
    studio() {
      return this.$store.getters['studio/getStudio'];
    },
  },
  methods: {
    saveRoom() {
      /* eslint-disable */
      this.isApiCall = true;

      const action = this.room._id ? 'room/updateRoom' : 'room/createRoom';
      const form = new FormData();
      this.room.studioRooms = this.studio.rooms.map((room) => room._id);
      console.log(this.room.studioRooms);
      const room = JSON.stringify(this.room);
      form.append('room', room);
      this.newPhotos.forEach((file) => {
        form.append('photos', file);
      });

      this.$store
        .dispatch(action, form)
        .then(() => {
          showNotification('Сохранено ✅');
          this.$emit('close-modal');
        })
        .catch(() => {
          showNotification('Что-то пошло не так 🤷‍♂️');
        })
        .finally(() => (this.isApiCall = false));
    },
  },
};
</script>

<style lang="scss" scoped>
fieldset {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  label {
    width: calc(50% - 26px);
  }
  input {
    width: fit-content;
    margin: 5px;
  }
}
</style>
