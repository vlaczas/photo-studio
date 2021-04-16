export default {
  getUserStatus(state, getters, rootState) {
    return rootState.isLoggedIn;
  },
  getUser(state) {
    return state.user;
  },
};
