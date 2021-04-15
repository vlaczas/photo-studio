//* components that are almost everywhere
import BaseButton from '@/components/UI/BaseButton.vue';
import BaseModal from '@/components/UI/BaseModal.vue';
import Spinner from '@/components/UI/Spinner.vue';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)
  .use(store)
  .use(router)
  .component('base-button', BaseButton)
  .component('base-modal', BaseModal)
  .component('spinner', Spinner)
  .mount('#app');
