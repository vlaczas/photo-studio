import store from '../store';

function showNotification(message) {
  store.dispatch('helpers/showNotification', message);
}

export default showNotification;
