export default {
  namespaced: true,

  state: {
    isLoading: false,
  },

  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
};
