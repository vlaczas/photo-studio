<template>
  <div class="img-viewer" @click.self="$emit('close-modal')">
    <img :src="currImg" class="current-img" />
    <div class="gallery">
      <img
        v-for="(img, idx) in images"
        :key="idx"
        :src="img"
        @click="curIndex = idx"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      curIndex: this.index,
    };
  },
  computed: {
    currImg() {
      return this.images[this.curIndex];
    },
  },
};
</script>

<style lang="scss" scoped>
.img-viewer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: 102;
  background-color: rgba($color: black, $alpha: 0.7);

  .current-img {
    width: 90vw;
  }
  .gallery {
    margin-top: 50px;
    max-width: 90vw;
    display: flex;
    overflow: auto;
    cursor: pointer;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    img {
      width: 80px;
    }
  }
}
@media (min-width: 768px) {
  .img-viewer {
    .current-img {
      width: 65vw;
    }
  }
}
@media (min-width: 1024px) {
  .img-viewer {
    .current-img {
      width: 35vw;
    }
  }
}
@media (min-width: 1441px) {
  .img-viewer {
    .current-img {
      width: 25vw;
    }
  }
}
</style>
