<template>
  <section class="dashboard">
    <nav
      :class="{
        'dashboard__left-nav': true,
        hiddenNav: hideNav,
        visibleNav: !hideNav,
      }"
    >
      <div
        tabindex="0"
        class="nav-arrow focus-ring"
        @click="hideNav = !hideNav"
      ></div>
      <figure class="avatar">
        <img
          referrerpolicy="no-referrer"
          :src="user.photo"
          alt="Фото пользователя"
        />
        <figcaption>@{{ user.username }}</figcaption>
      </figure>
      <ul ref="navUl">
        <router-link :to="{ name: 'BookmarkedTab' }">
          <li>
            <img src="@/assets/images/bookmarked.png" />
            Избранные
          </li>
        </router-link>
        <router-link :to="{ name: 'SettingsTab' }">
          <li>
            <img
              src="@/assets/images/settings.png"
            />Настройки
          </li>
        </router-link>
      </ul>
    </nav>
    <div class="dashboard__tab">
      <router-view v-slot="slotProps">
        <transition name="fade" mode="out-in">
          <component :is="slotProps.Component" />
        </transition>
      </router-view>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      hideNav: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters['auth/getUser'];
    },
  },
  beforeMount() {
    if (document.body.clientWidth < 1367) {
      this.hideNav = true;
    }
  },
  mounted() {
    if (document.body.clientWidth < 1367) {
      this.$refs.navUl.addEventListener(
        'click',
        () => (this.hideNav = !this.hideNav),
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  color: var(--col-white);
}
.dashboard__left-nav {
  display: flex;
  position: absolute;
  flex-direction: column;
  height: 100vh;
  width: 60vw;
  background-color: var(--col-deepBlue);
  z-index: 1;
  transition: all 0.3s ease;

  .nav-arrow {
    position: absolute;
    top: 50%;
    background-image: url('/img/arrow.png');
    background-size: 45%;
    background-position: 34px 50%;
    background-color: var(--col-deepBlue);
    background-repeat: no-repeat;
    border-radius: 50%;
    right: -25px;
    width: 60px;
    height: 60px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .router-link-exact-active::before {
    content: '';
    position: absolute;
    background-color: var(--col-blue);
    width: 10px;
    height: 60px;
  }
  ul {
    li {
      display: flex;
      align-items: center;
      padding: 15px 0 15px 40px;
      font-weight: 700;
      color: var(--col-white);

      &:hover {
        background: var(--col-blue);
        background: linear-gradient(
          90deg,
          rgba(27, 16, 222, 0.2) 0%,
          rgba(27, 16, 222, 0.1) 40%,
          rgba(27, 16, 222, 0.05) 80%
        );
      }

      img {
        width: 30px;
        margin-right: 20px;
      }
    }
  }
}

.visibleNav {
  left: 0;
}
.hiddenNav {
  left: -60vw;
}

.avatar {
  margin-top: 8vh;
  img {
    display: block;
    margin: 0 auto;
    width: min(45%, 170px);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
  }
  figcaption {
    color: var(--col-grey);
    margin: 20px 0 25px;
    text-align: center;
  }
}

.dashboard__tab {
  background-color: var(--col-dashBlack);
  width: 100%;
  height: 100vh;
  z-index: -1;
}
@media (min-width: 768px) {
  .dashboard__left-nav {
    width: 30vw;
  }
  .hiddenNav {
    left: -30vw;
  }
}
@media (min-width: 1367px) {
  .dashboard__left-nav {
    width: 15vw;
  }
  .dashboard__tab {
    margin-left: 15vw;
  }
  .nav-arrow {
    display: none;
  }

  .hiddenNav {
    left: -15vw;
  }
}
</style>
