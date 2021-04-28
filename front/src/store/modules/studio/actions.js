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
    const query = new URLSearchParams(studioData).toString();
    const response = await myAxios.get(`/studios?${query}`);

    context.commit('setOwnerStudio', response.data.data);
    return response;
  },

  async setLogo(context, formData) {
    const studioId = context.getters.getStudioId;

    const response = await myAxios.put(`/studios?_id=${studioId}`, formData);

    context.commit('setOwnerStudio', response.data.data);
    return response;
  },

  async setBanner(context, formData) {
    const studioId = context.getters.getStudioId;

    const response = await myAxios.patch(`/studios?_id=${studioId}`, formData);

    context.commit('setOwnerStudio', response.data.data);
    return response;
  },

  async updateStudio(context, studioData) {
    const studioId = studioData._id || context.getters.getStudioId;
    const response = await myAxios.put(`/studios?_id=${studioId}`, studioData);

    context.commit('setOwnerStudio', response.data.data);
    return response;
  },

  async getSingleStudio(context, studioData) {
    const query = new URLSearchParams(studioData).toString();
    const response = await myAxios.get(`/studios?${query}`);

    return response;
  },
};
