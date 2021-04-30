import { createStore } from 'vuex';

import authModule from './modules/auth/index';
import helpersModule from './modules/helpers/index';
import studioModule from './modules/studio/index';
import roomModule from './modules/room/index';

export default createStore({
  state: () => ({
    isLoggedIn: null,
  }),
  modules: {
    auth: authModule,
    studio: studioModule,
    helpers: helpersModule,
    room: roomModule,
  },
});
