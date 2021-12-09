import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "@/store/modules/auth";
import summoner from "@/store/modules/summoner";
import loading from "./modules/loading";

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
  },

  strict: process.env.NODE_ENV !== "production",
});
