<template>
  <div>
    <the-header></the-header>
    <router-view v-slot="slotProps">
      <transition name="modal" mode="out-in">
        <component :is="slotProps.Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';

export default {
  components: { TheHeader },
};
</script>
