import { kkaemiGGApi } from "@/api/kkaemigg";
import router from "@/router";

export default {
  namespaced: true,

  state: {
    title: "",
    content: "",
  },

  getters: {
    getRequestBody: ({ title, content }) => ({
      title,
      content,
    }),
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

    async writePost({ getters, rootGetters, dispatch, commit }) {
      commit("loading/setIsLoading", true, { root: true });
      await dispatch("auth/checkAuth", null, { root: true });

      const accessToken = rootGetters["auth/token"];
      const requestBody = getters.getRequestBody;
      const { data } = await kkaemiGGApi.post("/v1/posts", requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      commit("loading/setIsLoading", false, { root: true });
      commit("setTitle", "");
      commit("setContent", "");

      router.push({ name: "postView", params: { postId: data } });
    },
  },

  mutations: {
    setTitle(state, title) {
      state.title = title;
    },

    setContent(state, content) {
      state.content = content;
    },
  },
};
