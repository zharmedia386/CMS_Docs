import { createStore } from 'vuex'

export const store = createStore({
  state: {
    user: false,
    token: null,
  },
  mutations: {
    // setUser(state, user) {
    //   state.user = user;
    // },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    setAccessTokens(context, tokens) {
      context.commit('setToken', tokens)
    },
    // setUsersAuthorization(context, authorization) {
    //   context.commit('setUser', authorization)
    // }
  },
  getters: {
    getTokens: function (state) {
        return `${state.token}`
      },
    // getAuthorization: function (state) {
    //   return `${state.user}`
    // },
  },
});
