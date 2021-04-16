import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index';
import Home from '../views/Home.vue';
import LoginForm from '../views/LoginForm.vue';

/* eslint-disable*/
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
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
      // {
      //   path: 'studio',
      //   name: 'MyStudio',
      //   component: () => import('../views/Dashboard/Studio.vue')
      // }
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
        next('/');
      });
  } else next();
});

export default router;
