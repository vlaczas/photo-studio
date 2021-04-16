// import myAxios from '@/config/axios';
let timeout;
export default {
  showNotification(context, message) {
    clearTimeout(timeout);
    context.commit('setNotification', message);
    timeout = setTimeout(
      () => context.commit('clearNotification'),
      3000,
    );
  },
};
