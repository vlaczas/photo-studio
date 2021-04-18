<template>
  <section>
    <div>
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
          :src="user.photo"
          alt="Ваша фото"
        />
      </figure>
      <base-modal
        @close-modal="openPhotoDown = false"
        :open="openPhotoDown"
      >
        <photo-downloader
          @image-uploaded="openPhotoDown = false"
          :srcPhoto="srcPhoto"
          :dispatchPath="'auth/setAvatar'"
        ></photo-downloader>
      </base-modal>
    </div>
  </section>
</template>

<script>
import showNotification from '@/hooks/showNotification';
import PhotoDownloader from '@/components/UI/PhotoDownloader.vue';

export default {
  components: {
    PhotoDownloader,
  },
  data() {
    return {
      openPhotoDown: false,
      srcPhoto: () => this.user,
    };
  },
  computed: {
    user() {
      return this.$store.getters['auth/getUser'];
    },
  },
  methods: {
    openFS() {
      const fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      fileInput.setAttribute(
        'accept',
        'image/png, image/jpeg',
      );
      fileInput.click();
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        fileInput.remove();
        if (file.type.indexOf('image/') === -1) {
          showNotification(
            'Выберите картинку, а не это 🙄',
          );
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

<style lang="scss">
.add-photo {
  width: 10vw;
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
