export default {
  setNotification(state, message) {
    state.notification = message;
  },
  clearNotification(state) {
    state.notification = '';
  },
};
