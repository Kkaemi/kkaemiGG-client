import router from "@/router";
import { kkaemiGGApi } from "@/api/kkaemigg";

export default {
  namespaced: true,

  state: {
    token: null,
  },

  getters: {
    token: (state) => state.token,

    tokenPayloadGetter: (state) => {
      const accessToken = state.token;

      if (!accessToken) {
        return null;
      }

      const base64 = accessToken
        .split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        Buffer.from(base64, "base64").toString("utf-8")
      );
      return JSON.parse(jsonPayload);
    },

    getAccessTokenExp: (state, getters) => {
      return getters.tokenPayloadGetter?.exp || 0;
    },

    currentUserId: (state, getters) => {
      return getters.tokenPayloadGetter?.sub;
    },
  },

  actions: {
    async checkAuth({ commit, getters }) {
      const accessTokenExp = getters.getAccessTokenExp;

      if (accessTokenExp > Date.now() / 1000) {
        return;
      }

      const { data } = await kkaemiGGApi.get("/v1/token");
      data.length === 0 ? commit("setToken", null) : commit("setToken", data);
    },

    async logout({ commit }) {
      const { status } = await kkaemiGGApi.delete("/v1/token");

      if (status !== 200) {
        alert("로그아웃 실패");
        return;
      }

      commit("setToken", null);

      if (router.currentRoute.name !== "home") {
        router.push("/");
      }
    },
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
    },
  },
};
