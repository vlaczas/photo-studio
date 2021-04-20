<template>
  <section class="pic-load">
    <vue-cropper
      ref="cropper"
      :modal="false"
      :aspect-ratio="1 / 1"
      :src="srcPhoto"
      :viewMode="3"
      :background="false"
      :autoCropArea="1"
      :cropBoxResizable="false"
      :cropBoxMovable="false"
      :toggleDragModeOnDblclick="false"
      :center="false"
      :guides="false"
      @ready="setCropperConfig"
    />
    <base-button
      @click="getCroppedPhoto"
      :isLoading="isLoading"
      >Сохранить</base-button
    >
  </section>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.min.css';
import showNotification from '@/hooks/showNotification';

export default {
  props: {
    srcPhoto: {
      type: String,
      require: true,
      default: '',
    },
    dispatchPath: {
      type: String,
      require: true,
    },
  },
  components: {
    VueCropper,
  },
  emits: ['image-uploaded'],
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    setCropperConfig() {
      this.$refs.cropper.setDragMode('move');
    },
    getCroppedPhoto() {
      this.isLoading = true;

      const canvas = this.$refs.cropper.getCroppedCanvas({
        width: 500,
        height: 500,
        minWidth: 256,
        minHeight: 256,
        maxWidth: 1000,
        maxHeight: 1000,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high',
      });

      canvas.toBlob((blob) => {
        const form = new FormData();
        form.append('photos', blob);

        this.$store
          .dispatch(this.dispatchPath, form)
          .then((res) => {
            if (res.data.errorUploads) {
              showNotification(
                'Некоторые файлы были потеряны, проверьте пожалуйста 🤞',
              );
            }
            this.$emit('image-uploaded');
          })
          .catch((err) => {
            if (err.response?.status === 400) {
              showNotification(
                'Выберите картинку в правильном формате и до 5МБ 🙏',
              );
            } else {
              showNotification(
                'Что-то сломалось на нашей стороне 🤦‍♂️',
              );
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }, 'image/jpeg');
    },
  },
};
</script>

<style scoped>
.pic-load {
  display: flex;
  flex-direction: column;
  padding: 3vw 3vw;
}
.pic-load > div:first-child {
  margin: 0 auto 3vw 0;
  width: 70vw;
  aspect-ratio: 1 / 1;
}

.pic-load div:last-child {
  align-self: flex-end;
}

@media (min-width: 768px) {
  .pic-load {
    padding: 2vw 2vw;
  }
  .pic-load > div:first-child {
    margin: 0 auto 2vw 0;
    width: 500px;
  }
}
@media (min-width: 1365px) {
  .pic-load {
    padding: 1vw 1vw;
  }
  .pic-load > div:first-child {
    margin: 0 auto 1vw 0;
    width: 600px;
  }
}
</style>
