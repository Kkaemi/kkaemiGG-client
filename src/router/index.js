import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "@/components/NotFound.vue";
import Home from "@/components/Home.vue";
import OAuth2RedirectHandler from "@/components/OAuth2RedirectHandler.vue";
import UserCheck from "@/components/summoner/UserCheck.vue";
import Community from "@/components/community/Community.vue";
import PostWrite from "@/components/community/PostWrite.vue";
import PostModify from "@/components/community/PostModify.vue";
import PostView from "@/components/community/PostView.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  },
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
    path: "/community/posts/all",
    name: "postSearch",
    component: Community,
  },
  {
    path: "/community/posts/write",
    name: "postWrite",
    component: PostWrite,
    meta: { requiresLogin: true },
  },
  {
    path: "/community/posts/:postId",
    name: "postView",
    component: PostView,
    beforeEnter: async (to, from, next) => {
      await store.dispatch("community/post/fetchPost", to.params.postId);
      next();
    },
  },
  {
    path: "/community/posts/:postId/modify",
    name: "postModify",
    component: PostModify,
    meta: { requiresLogin: true },
  },
  {
    path: "/oauth2/redirect",
    component: OAuth2RedirectHandler,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("auth/checkAuth");

  if (!to.matched.some((record) => record.meta.requiresLogin)) {
    next();
    return;
  }

  if (!store.getters["auth/token"]) {
    alert("먼저 로그인 해 주세요.");
    next(
      from.name
        ? {
            ...from,
          }
        : { name: "home" }
    );
    return;
  }

  next();
});

export default router;
