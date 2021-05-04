<template>
  <div class="room">
    <router-link :to="{ name: 'StudioRoom', params: { roomId: room._id } }">
      <h2 class="room-name">{{ room.name }}</h2>
    </router-link>
    <p class="room-desc">{{ room.description }}</p>
    <span class="room-price"> {{ room.price }} грн/час </span>
    <div class="room-tags">
      <span class="room-tag" v-for="tag in room.tags" :key="tag">{{
        tag
      }}</span>
    </div>
    <div class="thumb-gallery">
      <figure
        v-for="(img, idx) in room.photos"
        :key="idx"
        class="thumb"
        @click="index = idx"
      >
        <img :src="img" />
      </figure>
    </div>
    <image-viewer
      v-if="index !== null"
      :images="room.photos"
      :index="index"
      @close-modal="index = null"
    ></image-viewer>
  </div>
</template>

<script>
import ImageViewer from '@/components/UI/ImageViewer.vue';

export default {
  components: {
    ImageViewer,
  },
  props: {
    room: {
      type: Object,
      required: true,
    },
    imgSize: {
      type: String,
      required: false,
      default: '20%',
    },
  },
  data() {
    return {
      index: null,
    };
  },
  mounted() {
    /* eslint-disable */
    document
      .querySelectorAll('.thumb')
      .forEach((elem) => (elem.style.width = this.imgSize));
  },
};
</script>

<style lang="scss" scoped>
.room {
  width: 100%;
  padding: 15px;
}
.room-name {
  font-size: var(--font-h2);
  font-weight: 600;
  margin-bottom: 20px;
  width: fit-content;
}
.room-desc {
  margin-bottom: 20px;
  font-size: var(--font-lst);
  white-space: pre-line;
  word-wrap: break-word;
}
.room-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 25px;
}
.room-price {
  display: block;
  font-weight: 600;
  margin: 25px 0;
}
.room-tag {
  border-radius: 20px;
  font-size: var(--font-lst);
  font-weight: 600;
  color: var(--col-white);
  padding: 5px 10px;
  margin-right: 5px;
  margin-top: 5px;
  width: fit-content;
  background-color: var(--col-fio);
}
.thumb-gallery {
  display: flex;
  flex-wrap: wrap;
  background-color: var(--col-lgrey);

  .thumb {
    aspect-ratio: 1 / 1;
    cursor: pointer;
    overflow: hidden;

    img {
      width: 100%;
      transform: scale(1.4);
    }
  }
}
</style>
