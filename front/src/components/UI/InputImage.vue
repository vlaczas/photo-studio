<template>
  <div class="image-input">
    <label for="dragInput" @dragover.prevent.stop @drop.prevent.stop="upload"
      >Перетащите картинки или добавьте их
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enable-background="new 0 0 24 24"
        height="70px"
        viewBox="0 0 24 24"
        width="70px"
        fill="#000000"
      >
        <g><rect fill="none" height="70" width="70" /></g>
        <g>
          <path
            d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"
          />
        </g>
      </svg>
    </label>
    <input
      id="dragInput"
      type="file"
      @change.prevent.stop="upload"
      multiple
      accept="image/*"
    />
    <div class="image-preview">
      <figure class="image" v-for="img in imgPreview" :key="img">
        <img :src="img" />
        <span @click="deleteItem(img)"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 24 24"
            width="20px"
            fill="#00000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
            /></svg
        ></span>
      </figure>
    </div>
  </div>
</template>

<script>
import showNotification from '../../hooks/showNotification';

export default {
  props: {
    alreadyUploaded: {
      type: Number,
      required: true,
    },
  },
  emits: ['images-change'],
  data() {
    return {
      imgPreview: [],
      imgFiles: [],
    };
  },
  computed: {
    maxNumOfNewPh() {
      return 10 - this.alreadyUploaded;
    },
  },
  methods: {
    upload(event) {
      let imgArray = [];
      if (event.type === 'change') imgArray = Object.values(event.target.files);
      else imgArray = Object.values(event.dataTransfer.files);

      imgArray.forEach((img) => {
        if (img.type.startsWith('image/') && img.size < 6000000) {
          if (this.imgFiles.length >= this.maxNumOfNewPh) {
            showNotification(
              `Вы можете загрузить не более 10 фото в каждый зал! Сейчас можно загрузить ${this.maxNumOfNewPh} картинок.`,
            );
            return;
          }
          this.imgFiles.push(img);
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onloadend = () => {
            this.imgPreview.push(reader.result);
          };
        } else {
          showNotification(
            'Файл должен быть в формате картинки и меньше 5 мегабайт',
          );
        }
      });
      this.$emit('images-change', this.imgFiles);
    },
    deleteItem(event) {
      const idx = this.imgPreview.indexOf(event);
      this.imgPreview.splice(idx, 1);
      this.imgFiles.splice(idx, 1);
      this.$emit('images-change', this.imgFiles);
    },
  },
};
</script>

<style lang="scss" scoped>
.image-input {
  margin: 20px auto;
  width: 100%;
  background-color: var(--col-lgrey);
  border: grey 2px dashed;
  border-radius: 20px;
  padding: 10px;

  &:hover {
    border: var(--col-blue) 2px solid;
  }
  label {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 200px;
    cursor: pointer;
  }
}
input {
  display: none;
}
.image-preview {
  display: flex;
  flex-wrap: wrap;
  .image {
    width: 18%;
    aspect-ratio: 3 / 4;
    background-color: rgba($color: black, $alpha: 0.4);
    border-radius: 5px;
    display: flex;
    margin: 5px;
    align-items: center;
    overflow: hidden;
    position: relative;

    span {
      position: absolute;
      border-radius: 50%;
      display: flex;
      align-items: center;
      cursor: pointer;
      top: 1px;
      right: 1px;

      &:hover {
        background-color: rgba($color: white, $alpha: 0.5);
      }
    }

    img {
      width: 100%;
    }
  }
}
</style>
