import { createStore } from 'vuex';

import authModule from './modules/auth/index';
import helpersModule from './modules/helpers/index';

export default createStore({
  state: () => ({
    isLoggedIn: null,
  }),
  modules: {
    auth: authModule,
    helpers: helpersModule,
  },
});
