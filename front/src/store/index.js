import { createStore } from 'vuex';

import authModule from './modules/auth/index';

export default createStore({
  state() {
    return {
      isLoggedIn: false,
    };
  },
  modules: {
    auth: authModule,
  },
});
