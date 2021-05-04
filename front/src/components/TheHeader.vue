<template>
  <header>
    <router-link to="/">
      <span class="logo focus-ring">
        P&S
      </span></router-link
    >
    <router-link v-if="getUserStatus === false" :to="{ name: 'LoginForm' }">
      <base-button>Вход</base-button>
    </router-link>
    <router-link
      v-else-if="getUserStatus === true"
      :to="{ name: 'BookmarkedTab' }"
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
  created() {
    /* eslint-disable no-undef */
    if (!this.getUserStatus) {
      window.onload = () => {
        google.accounts.id.initialize({
          client_id:
            '1011107927314-ql5jokbt0f5nktn3mtcnpr6daqj7qk9m.apps.googleusercontent.com',
          auto_select: false,
          context: 'use',
          callback: (response) => {
            this.$store.dispatch('auth/loginUser', {
              token: response.credential,
            });
          },
        });
        google.accounts.id.prompt((status) => {
          if (status.h) {
            document.querySelector('#credential_picker_container').style.top =
              '60px';
          }
        });
      };
    }
  },
};
</script>

<style lang="scss">
header {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  margin-bottom: 30px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 4vw;
  background-color: white;

  .logo {
    font-size: 22px;
    font-weight: 800;
    padding: 6px;
    border-radius: 10px;
    border: 1px solid black;
    cursor: pointer;
    color: black;
  }
}

#googleAuth {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 400px;
  height: 200px;
  background-color: violet;
}
</style>
