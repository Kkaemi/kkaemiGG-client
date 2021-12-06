import { kkaemiGGApi } from "@/api/kkaemigg";

export default {
  namespaced: true,

  state: {
    level: 0,
    name: "",
    profileIconImageUrl: "",
  },

  actions: {
    async fetchProfile({ commit, rootState }) {
      const userName = rootState.summoner.userName;

      const { data } = await kkaemiGGApi.get(
        `/v1/summoners/${userName}/profile`
      );
      commit("setProfile", data);
    },
  },

  mutations: {
    setProfile(state, { level, name, profileIconImageUrl }) {
      state.level = level;
      state.name = name;
      state.profileIconImageUrl = profileIconImageUrl;
    },
  },
};
