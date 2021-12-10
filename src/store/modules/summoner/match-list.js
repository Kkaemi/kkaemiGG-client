import { kkaemiGGApi } from "@/api/kkaemigg";

export default {
  namespaced: true,

  state: {
    matchList: [],
    beginIndex: 0,
    isMore: true,
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

      const matchList = data.data;

      if (matchList.length < 20) {
        commit("setIsMore", false);
      } else {
        commit("setIsMore", true);
      }

      if (beginIndex === 0) {
        commit("setMatchList", matchList);
      } else {
        commit("setMatchList", [...state.matchList, ...matchList]);
      }
    },
  },

  mutations: {
    setMatchList(state, matchList) {
      state.matchList = matchList;
    },

    setBeginIndex(state, beginIndex) {
      state.beginIndex = beginIndex;
    },

    setIsMore(state, isMore) {
      state.isMore = isMore;
    },

    initMatchListModuleState(state) {
      state.matchList = [];
      state.beginIndex = 0;
      state.isMore = true;
    },
  },
};
