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
};
