import myAxios from '@/config/axios';

export default {
  async createRoom(context, roomForm) {
    const response = await myAxios.post('/rooms', roomForm);

    context.commit('addRoom', response.data.data);
    return response;
  },

  async updateRoom(context, roomForm) {
    const response = await myAxios.put('/rooms', roomForm);

    context.commit('updateRoom', response.data.data);
    return response;
  },

  async getRoom(context, roomId) {
    const response = await myAxios.get(`/rooms?_id=${roomId}`);

    return response;
  },
};
