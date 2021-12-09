import { kkaemiGGApi } from "@/api/kkaemigg";
import profile from "./summoner/profile";
import leaguePositions from "./summoner/league-positions";
import matchList from "./summoner/match-list";

export default {
  namespaced: true,

  state: {
    userName: null,
    isExists: false,
  },

  actions: {
    async checkUserName({ commit, state }) {
      const userName = state.userName;

      const { data } = await kkaemiGGApi.get(
        `/v1/summoners/${userName}/exists`
      );
      commit("setIsExists", data);
    },
  },

  mutations: {
    setUserName(state, userName) {
      state.userName = userName;
    },
    setIsExists(state, isExists) {
      state.isExists = isExists;
    },
  },

  modules: {
    profile,
    leaguePositions,
    matchList,
  },
};
