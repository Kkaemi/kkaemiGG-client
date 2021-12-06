import VueRouter from "vue-router";
import Home from "@/components/Home.vue";
import OAuth2RedirectHandler from "@/components/OAuth2RedirectHandler.vue";
import UserCheck from "@/components/summoner/UserCheck.vue";

export default new VueRouter({
  mode: "history",

  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/summoner/userName=:userName",
      name: "summoner",
      component: UserCheck,
    },
    {
      path: "/community",
    },
    {
      path: "/oauth2/redirect",
      component: OAuth2RedirectHandler,
    },
  ],
});
