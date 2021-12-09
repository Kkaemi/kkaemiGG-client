import { kkaemiGGApi } from "@/api/kkaemigg";

export default {
  namespaced: true,

  state: {
    matchList: [],
    beginIndex: 0,
  },

  getters: {
    getUserName: (state, getters, rootState) => {
      return rootState.summoner.profile.name;
    },
  },

  actions: {
    async fetchMatchList({ commit, state, rootState }) {
      const userName = rootState.summoner.userName;
      const beginIndex = state.beginIndex;

      const { data } = await kkaemiGGApi.get(
        `/v1/summoners/${userName}/matches`,
        { params: { beginIndex } }
      );

      commit("setMatchList", data.data);
    },
  },

  mutations: {
    setMatchList(state, matchList) {
      state.matchList = matchList;
    },

    setBeginIndex(state, beginIndex) {
      state.beginIndex = beginIndex;
    },

    initMatchListModuleState(state) {
      state.matchList = [];
      state.beginIndex = 0;
    },
  },
};
