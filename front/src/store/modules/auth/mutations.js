export default {
  setUser(state, newUser) {
    state.user = { ...newUser };
    this.state.isLoggedIn = true;
  },
};
