import myAxios from '@/config/axios';

export default {
  async createRoom(context, roomForm) {
    const response = await myAxios.post('/rooms', roomForm);

    context.commit('addRoom', response.data.data);
    return response;
  },
};
