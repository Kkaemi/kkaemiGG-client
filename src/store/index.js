import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "@/store/modules/auth";
import summoner from "@/store/modules/summoner/summoner";
import loading from "./modules/loading";
import community from "./modules/community/community";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["auth"],
    }),
  ],

  modules: {
    auth,
    summoner,
    loading,
    community,
  },

  strict: process.env.NODE_ENV !== "production",
});
