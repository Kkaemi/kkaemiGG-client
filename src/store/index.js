import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { auth } from "@/store/modules/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["auth"],
    }),
  ],

  modules: {
    auth,
  },

  strict: process.env.NODE_ENV !== "production",
});
