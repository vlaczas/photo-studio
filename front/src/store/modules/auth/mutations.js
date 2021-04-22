export default {
  setUser(state, newUser) {
    state.user = { ...newUser };
    this.state.isLoggedIn = true;
  },

  unsetUser(state) {
    state.user = {};
    this.state.isLoggedIn = false;
  },

  deAnonUser() {
    this.state.isLoggedIn = false;
  },
  updateUser(state, dataToUpdate) {
    state.user = { ...state.user, ...dataToUpdate };
  },
};
