import { kkaemiGGApi } from "@/api/kkaemigg";
import router from "@/router";
import { toLocalDateTime } from "@/utils/date-utils";

export default {
  namespaced: true,

  state: {
    postId: 0,
    userId: 0,
    userNickname: "",
    viewCount: 0,
    title: "",
    content: "",
    createdDate: "",
  },

  getters: {
    getCreatedDate: (state) => toLocalDateTime(state.createdDate),
  },

  actions: {
    async uploadImage({ rootGetters, dispatch, commit }, payload) {
      commit("loading/setIsLoading", true, { root: true });

      await dispatch("auth/checkAuth", null, { root: true });

      const accessToken = rootGetters["auth/token"];
      const formData = new FormData();
      formData.append("image", payload);

      let imageUrl;

      try {
        const { data } = await kkaemiGGApi.post("/v1/images", formData, {
          headers: {
            "Content-Type": "multipart/formdata; charset=utf-8",
            Accept: "*/*",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        imageUrl = data;
      } catch (error) {
        alert("파일 업로드 실패");
        imageUrl = null;
      } finally {
        commit("loading/setIsLoading", false, { root: true });
      }

      return imageUrl;
    },

    async writePost({ rootGetters, dispatch, commit }, payload) {
      commit("loading/setIsLoading", true, { root: true });
      await dispatch("auth/checkAuth", null, { root: true });

      const accessToken = rootGetters["auth/token"];
      const { data } = await kkaemiGGApi.post("/v1/posts", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      commit("loading/setIsLoading", false, { root: true });

      router.push({ name: "postView", params: { postId: data } });
    },

    async fetchPost({ commit }, payload) {
      const { data } = await kkaemiGGApi.get(`/v1/posts/${payload}`);
      commit("setPostState", data);
    },
  },

  mutations: {
    setPostState(
      state,
      { postId, userId, userNickname, viewCount, title, content, createdDate }
    ) {
      state.postId = postId;
      state.userId = userId;
      state.userNickname = userNickname;
      state.viewCount = viewCount;
      state.title = title;
      state.content = content;
      state.createdDate = createdDate;
    },
  },
};
