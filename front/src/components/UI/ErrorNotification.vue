<template>
  <transition name="notif">
    <div
      v-if="notification"
      class="notification"
      @click="closeNotif"
    >
      {{ notification }}
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    notification() {
      return this.$store.getters['helpers/getNotification'];
    },
  },
  methods: {
    closeNotif() {
      this.$store.commit('helpers/clearNotification');
    },
  },
};
</script>

<style scoped>
.notification {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 0.9rem;
  top: 0px;
  left: calc(50% - 50vw);
  text-align: center;
  width: 100vw;
  min-height: 10vh;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  color: var(--col-white);
  box-shadow: var(--shadow);
  background: rgba(48, 48, 48, 0.8);
  padding: 10px;
  z-index: 11;
  user-select: none;
}

@media (min-width: 768px) {
  .notification {
    width: 50vw;
    left: calc(50% - 25vw);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    min-height: 7vh;
  }
}
@media (min-width: 1367px) {
  .notification {
    width: 30vw;
    left: calc(50% - 15vw);
  }
}

.notif-enter-from,
.notif-leave-to {
  top: -10vh;
}

.notif-enter-active,
.notif-leave-active {
  transition: top 0.3s ease;
}

.notif-enter-to,
.notif-leave-from {
  top: 0;
}
</style>
