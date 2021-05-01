export default {
  addRoom(state, roomData) {
    this.state.studio.studio.rooms.push(roomData);
  },
  updateRoom(state, roomData) {
    /* eslint-disable */
    const idx = this.state.studio.studio.rooms.findIndex((room) => {
      room._id === roomData._id;
    });
    this.state.studio.studio.rooms[idx] = roomData;
  },
};
