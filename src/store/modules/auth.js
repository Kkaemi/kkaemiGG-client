import router from "@/router";
import { kkaemiGGApi } from "../../api/client";

export const auth = {
  namespaced: true,

  state: {
    token: null,
  },

  getters: {
    token: (state) => state.token,
  },

  actions: {
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
