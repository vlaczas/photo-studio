<template>
  <div>
    <error-notification></error-notification>
    <router-view></router-view>
  </div>
</template>

<script>
import ErrorNotification from '@/components/UI/ErrorNotification.vue';

export default {
  components: {
    ErrorNotification,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
@import './assets/css/constants.scss';

a {
  text-decoration: none;
  color: var(--col-fio);
  font-weight: 800;

  &:visited,
  &:active {
    color: var(--col-fio);
  }
}

textarea {
  padding: 8px;
  width: 100%;
  resize: none;
}

h1 {
  font-size: var(--font-h1);
  font-weight: 800;
  text-align: center;
}
#app {
  background-color: var(--col-lgrey);
}
.closer {
  font-size: var(--font-h2);
  font-weight: 800;
  position: absolute;
  top: -12px;
  right: -7px;
  text-align: center;
  background-color: var(--col-deepBlue);
  user-select: none;
  cursor: pointer;
  border: solid white 1px;
  border-radius: 50%;
  width: 35px;
  padding: 5px;
}

.bold-btn {
  display: block;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-weight: 800;

  &:hover {
    text-decoration: underline;
  }
}

.focus-ring {
  -webkit-tap-highlight-color: transparent;
}
.focus-ring:focus:not(:focus-visible) {
  outline: none;
  outline-width: 0;
}
.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgb(95, 105, 255);
}
.focus-ring:-moz-focusring {
  outline: none;
  box-shadow: 0 0 0 3px rgb(95, 105, 255);
}

/* ANIMATIONS */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
