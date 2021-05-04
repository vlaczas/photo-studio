<template>
  <section>
    <div class="studio-info">
      <div class="header">
        <img class="logo" src="https://picsum.photos/500/500" />
        <h2>Name Photostudio</h2>
        <div>
          <a :href="`tel:${studio}`">
            <figure>
              <img src="@/assets/images/phone_w.png" />
            </figure>
          </a>
        </div>
      </div>
    </div>
    <div class="rooms-info">
      <button
        v-for="(room, idx) in studio.rooms"
        :key="room.name"
        :class="{ tab: true, 'tab-active': idx == index }"
        @click="index = idx"
      >
        {{ `Зал ${idx + 1}` }}
      </button>
      <component
        :is="'room-preview'"
        :room="studio.rooms[index]"
        :studioSlug="studio.slug"
      ></component>
    </div>
  </section>
</template>

<script>
import RoomPreview from '../studio/RoomPreview.vue';

export default {
  components: { RoomPreview },
  // props: {
  //   studio: {
  //     type: Object,
  //     required: false,
  //   },
  // },
  data() {
    return {
      index: 0,
      studio: {
        slug: 'por-t-ret-studio',
        rooms: [
          {
            _id: '608c79f00abd08228381477a',
            photos: [
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/gnwk5ldx7hdqtgfumqr8.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/fx4eeuum17pb3hxgn6vl.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/mghwkw2381qu8mpfm9wh.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/u08zwt71jpvrub4svcxd.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/ikfzfstjalesrxvarx1j.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/zwi1eatc3zk0mod8jstj.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/cagcqif3rkwarp4pngzm.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/i5zomy1zsljneqwypt0g.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/xq3behk0uvyk9lhffbn6.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619818992/roomsPhotos/dboywkjphejvwijrxhrj.jpg',
            ],
            name: 'Clever',
            price: 555,
            tags: ['Дневной свет', 'Вспышки'],
            description:
              'Wikipedia (/ˌwɪkɪˈpiːdiə/ (About this soundlisten) wik-ih-PEE-dee-ə or /ˌwɪki-/ (About this soundlisten) wik-ee-) is a free, multilingual online encyclopedia written and maintained by a community of volunteer contributors through open collaboration, using a wiki-based editing system. Wikipedia is the largest general reference work on the Internet,[3] and one of the 15 most popular websites as ranked by Alexa; in 2021, it was ranked as the 13th most-visited.[4][note 3] The project carries no adve',
            studioRooms: [],
          },
          {
            _id: '608c7a130abd08228381477b',
            photos: [
              'https://res.cloudinary.com/studio-search/image/upload/v1619819028/roomsPhotos/m4crulwssvi8gw6xunaa.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619819028/roomsPhotos/k34g6swhlgjobz9cvynx.jpg',
              'https://res.cloudinary.com/studio-search/image/upload/v1619819028/roomsPhotos/uiwm4dtjl3kkrq7xgi7t.jpg',
            ],
            name: 'Stupid',
            price: 550,
            tags: ['Вспышки'],
            description: 'xfbhbb',
          },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  border-radius: 15px;
  background-color: white;
  width: 100vw;

  .studio-info {
    display: flex;
    flex-direction: column;
    width: 100vw;

    .header {
      display: flex;
      align-items: center;
      position: relative;
      div {
        display: flex;
        position: absolute;
        top: 10px;
        right: 0px;
        figure {
          width: 40px;
          height: 40px;
          margin: 0 13px;
          background-color: var(--col-black);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;

          img {
            width: 30px;
            margin: 0;
          }
        }
      }
      img {
        width: 50px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        margin: 10px 20px 10px 0;
      }
      h2 {
        font-weight: 600;
      }
    }
  }
}

.tab {
  background-color: var(--col-lgrey);
  border: none;
  padding: 10px 15px;
  margin-top: 15px;
  border-radius: 5px;
  cursor: pointer;
}
.tab-active {
  background-color: white;
}
@media (min-width: 768px) {
  section {
    width: max(443px, 61vw);
    .studio-info {
    }
  }
}
@media (min-width: 1024px) {
}
@media (min-width: 1439px) {
  section {
    width: max(443px, 50vw);
    .studio-info {
    }
  }
}
</style>
