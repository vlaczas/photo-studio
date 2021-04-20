import myAxios from '@/config/axios';

export default {
  async registerUser(context, payload) {
    let response;
    if (payload.token) {
      response = await myAxios.post(
        `/users/register?token=${payload.token}`,
      );
    } else {
      response = await myAxios.post(
        '/users/register',
        payload,
      );
    }

    context.commit('setUser', response.data.data);
    return response;
  },

  async loginUser(context, payload) {
    let response;
    if (payload.token) {
      response = await myAxios.post(
        `/users/login?token=${payload.token}`,
      );
    } else {
      response = await myAxios.post(
        '/users/login',
        payload,
      );
    }

    context.commit('setUser', response.data.data);
    return response;
  },

  async updateUser(context, dataToUpdate) {
    const { _id: userId } = dataToUpdate;
    const dataToSend = { ...dataToUpdate };
    delete dataToSend._id;

    const response = await myAxios.put(
      `/users/settings?_id=${userId}`,
      dataToSend,
    );

    context.commit('setUser', response.data.data);
    return response;
  },

  async getMe(context) {
    const response = await myAxios.get('/users/me');

    context.commit('setUser', response.data.data);
  },

  async checkUsername(context, username) {
    const response = await myAxios.get(
      `/users?username=${username}&private=true`,
    );
    return response;
  },

  async setAvatar(context, formData) {
    const userId = context.getters.getUserId;

    const response = await myAxios.put(
      `/users?_id=${userId}`,
      formData,
    );

    context.commit('setUser', response.data.data);
    return response;
  },
};
