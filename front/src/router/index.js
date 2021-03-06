import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index';
import Home from '../views/Home.vue';
import LoginForm from '../views/LoginForm.vue';
import SearchPage from '../views/SearchPage.vue';

/* eslint-disable*/
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        name: 'SearchPage',
        component: SearchPage,
      },
      {
        path: 'login',
        name: 'LoginForm',
        component: LoginForm,
      },
      {
        path: 'register',
        name: 'RegisterForm',
        component: () =>
          import(
            /* webpackChunkName: "register" */ '../views/RegisterForm.vue'
          ),
      },
      {
        path: 'studios/:slug',
        name: 'StudioProfile',
        component: () =>
          import(
            /* webpackChunkName: "studioProfile" */ '../views/StudioProfile.vue'
          ),
      },
      {
        path: 'studios/:slug/:roomId',
        name: 'StudioRoom',
        component: () =>
          import(
            /* webpackChunkName: "studioRoom" */ '../views/StudioRoom.vue'
          ),
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '../views/dashboard/Dashboard.vue'
      ),
    children: [
      {
        path: '',
        name: 'BookmarkedTab',
        component: () =>
          import(
            /* webpackChunkName: "bookmarkedTab" */ '../views/dashboard/BookmarkedTab.vue'
          ),
      },
      {
        path: 'settings',
        name: 'SettingsTab',
        component: () =>
          import(
            /* webpackChunkName: "settingsTab" */ '../views/dashboard/SettingsTab.vue'
          ),
      },
      {
        path: 'studio',
        name: 'StudioTab',
        component: () =>
          import(
            /* webpackChunkName: "studioTab" */ '../views/dashboard/StudioTab.vue'
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//* Get User session
let isInitialPageLoad = true;
router.beforeEach((to, from, next) => {
  if (isInitialPageLoad) {
    isInitialPageLoad = false;
    store
      .dispatch('auth/getMe')
      .then(() => next())
      .catch(() => {
        store.commit('auth/deAnonUser');
        if (to.fullPath.startsWith('/dash')) next('/login');
        else next();
      });
  } else next();
});

export default router;
