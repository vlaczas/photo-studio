<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@use './assets/css/constants.scss';

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
