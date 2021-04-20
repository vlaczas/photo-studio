<template>
  <section
    class="dashboard"
    @keyup.esc="isOpenModal ? (isOpenModal = false) : isOpenModal"
  >
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
          <li><img src="@/assets/images/settings.png" />Настройки</li>
        </router-link>
      </ul>
      <div class="be-somebody" v-if="showBeSomebody">
        <span @click="deleteBeSomebody" class="closer">X</span>
        <p
          tabindex="0"
          @click="openModal('studio')"
          @keyup.enter="openModal('photographer')"
          class="focus-ring"
        >
          Добавить свою студию
        </p>
        <hr />
        <p
          tabindex="0"
          @click="openModal('photographer')"
          @keyup.enter="openModal('photographer')"
          class="focus-ring"
        >
          Стать фотографом
        </p>
        <base-modal
          :open="isOpenModal"
          @close-modal="isOpenModal = !isOpenModal"
        >
          <become-ph-or-studio
            @add-success="isOpenModal = !isOpenModal"
            :userRole="roleName"
            :userInfo="user"
          ></become-ph-or-studio>
        </base-modal>
      </div>
      <ul
        class="logout focus-ring"
        tabindex="0"
        @click="logout"
        @keyup.enter="logout"
      >
        <li>
          <img src="@/assets/images/logout.png" />
          Выход
        </li>
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
import { defineAsyncComponent } from 'vue';

const BecomePhOrStudio = defineAsyncComponent({
  loader: () => import('@/components/BecomePhOrStudio.vue'),
});

export default {
  components: {
    BecomePhOrStudio,
  },
  data() {
    return {
      hideNav: false,
      isOpenModal: false,
      roleName: '',
      showBeSomebody: true,
    };
  },
  methods: {
    openModal(string) {
      this.roleName = string;
      this.isOpenModal = true;
    },
    deleteBeSomebody() {
      this.showBeSomebody = false;
      localStorage.setItem('beSomebody', '0');
    },
    logout() {
      this.$store
        .dispatch('auth/logout')
        .finally(() => this.$router.replace('/'));
    },
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
    if (localStorage.getItem('beSomebody') !== null) {
      this.showBeSomebody = false;
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

<style lang="scss">
.dashboard {
  display: flex;
  color: var(--col-white);

  &__header {
    margin-top: 30px;
  }

  .basic-form {
    background-color: transparent;

    input {
      background-color: transparent;
      color: var(--col-white);
    }
  }
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

  ul {
    flex-grow: 1;

    li {
      display: flex;
      align-items: center;
      padding: 15px 0 15px 40px;
      font-weight: 800;
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
    user-select: none;
  }
  figcaption {
    color: var(--col-grey);
    margin: 20px 0 25px;
    text-align: center;
    word-wrap: break-word;
  }
}

.be-somebody {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  margin: 10px auto;
  width: 75%;
  border: var(--col-white) 1px solid;
  border-radius: 10px;
  padding: 0 5px;

  hr {
    width: 100%;
  }
  p {
    font-weight: 800;
    margin: 20px auto;
    cursor: pointer;
  }
}
.logout {
  flex-grow: 0 !important;
  margin-bottom: 10px;
  cursor: pointer;
}
.dashboard__tab {
  display: flex;
  flex-direction: column;
  background-color: var(--col-dashBlack);
  width: 100%;
  height: 100vh;
  z-index: 0;
  overflow-y: auto;
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
