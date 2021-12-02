import VueRouter from "vue-router";
import Home from "@/components/Home.vue";
import OAuth2RedirectHandler from "@/components/OAuth2RedirectHandler.vue";

export default new VueRouter({
  mode: "history",

  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/oauth2/redirect",
      component: OAuth2RedirectHandler,
    },
  ],
});
