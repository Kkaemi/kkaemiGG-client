import { kkaemiGGApi } from "@/api/kkaemigg";
import router from "@/router";
import { toLocalDateTime } from "@/utils/date-utils";
import comment from "./comment";

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

    currentUserId: (state, getters, rootState, rootGetters) =>
      rootGetters["auth/currentUserId"],
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

    async writePost({ rootGetters, dispatch }, payload) {
      await dispatch("auth/checkAuth", null, { root: true });
      const accessToken = rootGetters["auth/token"];

      try {
        const { data } = await kkaemiGGApi.post("/v1/posts", payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        router.push({ name: "postView", params: { postId: data } });
      } catch (error) {
        alert("게시글 저장 실패");
      }
    },

    async modifyPost({ dispatch, rootGetters, state }, requestBody) {
      await dispatch("auth/checkAuth", null, { root: true });
      const accessToken = rootGetters["auth/token"];
      const postId = state.postId;

      try {
        await kkaemiGGApi.patch(`/v1/posts/${postId}`, requestBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        alert("수정을 완료했습니다.");

        router.push({ name: "postView", params: { postId } });
      } catch (error) {
        alert("게시글 수정 실패");
      }
    },

    async removePost({ dispatch, rootGetters, state }) {
      await dispatch("auth/checkAuth", null, { root: true });
      const accessToken = rootGetters["auth/token"];
      const postId = state.postId;

      try {
        await kkaemiGGApi.delete(`/v1/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        alert("삭제를 완료했습니다.");
        router.push({ name: "postSearch" });
      } catch (error) {
        alert("삭제 실패");
      }
    },

    async fetchPost({ commit }, postId) {
      try {
        const { data } = await kkaemiGGApi.get(`/v1/posts/${postId}`);
        commit("setPostState", data);
      } catch (error) {
        router.push({ name: "notFound" });
      }
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

    setTitle(state, title) {
      state.title = title;
    },
  },

  modules: {
    comment,
  },
};
