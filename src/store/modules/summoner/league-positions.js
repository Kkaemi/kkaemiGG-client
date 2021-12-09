import { kkaemiGGApi } from "@/api/kkaemigg";

export default {
  namespaced: true,

  state: {
    soloRankInfo: null,
    freeRankInfo: null,
  },

  actions: {
    async fetchLeaguePositions({ commit, rootState }) {
      const userName = rootState.summoner.userName;

      const { data } = await kkaemiGGApi.get(
        `/v1/summoners/${userName}/league-positions`
      );

      commit("setLeaguePositions", data);
    },
  },

  mutations: {
    setLeaguePositions(state, { soloRank, freeRank }) {
      state.soloRankInfo = soloRank;
      state.freeRankInfo = freeRank;
    },

    initLeaguePositionsModuleState(state) {
      state.soloRankInfo = null;
      state.freeRankInfo = null;
    },
  },
};
