<template>
  <header>
    <span class="logo focus-ring">
      P&S
    </span>
    <router-link
      v-if="getUserStatus === false"
      :to="{ name: 'LoginForm' }"
    >
      <base-button>Вход</base-button>
    </router-link>
    <router-link
      v-else-if="getUserStatus === true"
      :to="{ name: 'LoginForm' }"
    >
      <base-button>Мой профиль</base-button>
    </router-link>
  </header>
</template>

<script>
export default {
  computed: {
    getUserStatus() {
      return this.$store.getters['auth/getUserStatus'];
    },
  },
};
</script>

<style lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 4vw;

  .logo {
    font-size: 22px;
    font-weight: 800;
    padding: 6px;
    border-radius: 10px;
    border: 1px solid black;
    cursor: pointer;
  }
}
</style>
