import myAxios from '@/config/axios';

export default {
  async createStudio(context, studioData) {
    const response = await myAxios.post('/studios', studioData);

    context.commit(
      'auth/updateUser',
      { studio: response.data.data._id },
      { root: true },
    );
    context.commit('setOwnerStudio', response.data.data);
    return response;
  },

  async getOwnStudio(context, studioData) {
    const response = await myAxios.get('/studios', studioData);

    context.commit('setOwnerStudio', response.data.data);
    return response;
  },

  async updateStudio(context, studioData) {
    const studioId = context.getters.getStudioId;
    const response = await myAxios.put(`/studios?_id=${studioId}`, studioData);

    context.commit('setOwnerStudio', response.data.data);
    return response;
  },

  async getSingleStudio(context, studioData) {
    const response = await myAxios.get('/studios', studioData);

    return response;
  },

  async setLogo(context, formData) {
    const studioId = context.getters.getStudioId;

    const response = await myAxios.put(`/studios?_id=${studioId}`, formData);

    context.commit('setOwnerStudio', response.data.data);
    return response;
  },
};
