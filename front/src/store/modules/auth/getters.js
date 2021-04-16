export default {
  getUserStatus(state, getters, rootState) {
    return rootState.isLoggedIn;
  },
};
