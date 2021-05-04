<template>
  <section class="container">
    <spinner v-if="!room._id"></spinner>
    <section v-else>
      <div class="room-profile">
        <img :src="room.studio[0].logo" class="logo" />
        <router-link
          :to="{ name: 'StudioProfile', params: { slug: room.studio[0].slug } }"
        >
          <h1>{{ room.studio[0].name }}</h1>
        </router-link>
        <div class="room-info">
          <room-preview :room="room"></room-preview>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import RoomPreview from '../components/studio/RoomPreview.vue';
import showNotification from '../hooks/showNotification';

export default {
  components: { RoomPreview },
  data() {
    return {
      room: {},
    };
  },
  created() {
    /* eslint-disable */
    this.$store
      .dispatch('room/getRoom', this.$route.params.roomId)
      .then((res) => {
        this.room = res.data.data;
      })
      .catch(() => showNotification('Похоже этой страницы нет 🤷‍♂️'));
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 88px);
  display: flex;
  justify-content: center;
  width: 100vw;
  margin: 0 auto;

  & > div {
    transform: scale(2);
    align-self: center;
  }
}

.room-profile {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border-radius: 15px;
  align-items: center;
  margin-bottom: 30px;

  .logo {
    width: 70px;
    border-radius: 50%;
    margin: 30px;
  }
}
.room-info {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    width: 80vw;
  }
}
</style>
