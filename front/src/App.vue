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
  font-weight: 700;

  &:visited,
  &:active {
    color: var(--col-fio);
  }
}
h1 {
  font-size: var(--font-h1);
  font-weight: 800;
  text-align: center;
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
</style>
