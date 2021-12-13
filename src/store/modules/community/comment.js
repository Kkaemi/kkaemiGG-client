import { kkaemiGGApi } from "@/api/kkaemigg";
import { calcPast, toLocalDateTime } from "@/utils/date-utils";

export default {
  namespaced: true,

  state: {
    commentList: [],
    totalElements: 0,
    isMore: true,
    isMoreFetchLoading: false,
    page: 0,
    size: 50,

    parentCommentContent: "",
  },

  getters: {
    parentCommentContent: (state) =>
      state.parentCommentContent.replace(/\r/g, "").replace(/\n/g, "<br>"),
    currentUserId: (state, getters, rootState, rootGetters) =>
      rootGetters["auth/currentUserId"],
    pageableGetter: (state) => ({ page: state.page, size: state.size }),
  },

  actions: {
    async fetchCommentList({ commit, getters, state, rootState }) {
      const params = getters.pageableGetter;
      const postId = rootState.community.post.postId;
      const size = state.size;
      const { content, totalElements } = await kkaemiGGApi
        .get(`/v1/posts/${postId}/comments`, {
          params: { ...params },
        })
        .then(({ data }) => data.data);

      if (content.length < size) {
        commit("setIsMore", false);
      }

      commit("setCommentList", content);
      commit("setTotalElements", totalElements);
    },

    async writeComment(
      { dispatch, state, getters, rootState, rootGetters, commit },
      { parentCommentId, groupId }
    ) {
      await dispatch("auth/checkAuth", null, { root: true });
      const accessToken = rootGetters["auth/token"];

      const postId = rootState.community.post.postId;
      const content = parentCommentId
        ? state.commentList.find(
            (comment) => comment.commentId === parentCommentId
          ).childCommentContent
        : getters.parentCommentContent;

      commit("initCommentModuleState");

      await kkaemiGGApi.post(
        "/v1/comments",
        {
          parentCommentId,
          groupId,
          content,
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await dispatch("fetchCommentList");
    },

    async removeComment({ dispatch, rootGetters, commit }, commentId) {
      await dispatch("auth/checkAuth", null, { root: true });
      const accessToken = rootGetters["auth/token"];

      commit("initCommentModuleState");

      try {
        await kkaemiGGApi.delete(`/v1/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        await dispatch("fetchCommentList");
      } catch (error) {
        alert("댓글 삭제 실패");
      }
    },

    async toggleIsReplyBoxOpen({ dispatch, rootGetters, commit }, commentId) {
      await dispatch("auth/checkAuth", null, { root: true });
      const accessToken = rootGetters["auth/token"];

      if (!accessToken) {
        alert("먼저 로그인 해 주세요.");
        return;
      }

      commit("openReplyBox", commentId);
    },
  },

  mutations: {
    initCommentModuleState(state) {
      state.page = 0;
      state.totalElements = 0;
      state.commentList = [];
      state.isMore = true;
      state.isMoreFetchLoading = false;
      state.parentCommentContent = "";
    },

    setParentCommentContent(state, content) {
      state.parentCommentContent = content;
    },

    setPage(state, page) {
      state.page = page;
    },

    setTotalElements(state, totalElements) {
      state.totalElements = totalElements;
    },

    setCommentList(state, commentList) {
      state.commentList = state.commentList.concat(
        commentList.map((comment) => ({
          ...comment,
          createdAt: calcPast(comment.createdDate),
          createdDate: toLocalDateTime(comment.createdDate),
          isReplyBoxOpen: false,
          childCommentContent: "",
        }))
      );
    },

    setChildCommentContent(state, { commentId, content }) {
      const comment = state.commentList.find(
        (comment) => comment.commentId === commentId
      );
      comment.childCommentContent = content
        .replace(/\r/g, "")
        .replace(/\n/g, "<br>");
    },

    setIsMore(state, isMore) {
      state.isMore = isMore;
    },

    setIsMoreFetchLoading(state, isMoreFetchLoading) {
      state.isMoreFetchLoading = isMoreFetchLoading;
    },

    openReplyBox(state, commentId) {
      state.commentList = state.commentList.reduce((acc, cur) => {
        if (cur.commentId === commentId) {
          cur.isReplyBoxOpen = !cur.isReplyBoxOpen;
        } else {
          cur.isReplyBoxOpen = false;
        }

        acc.push(cur);

        return acc;
      }, []);
    },

    addComment(state, comment) {
      comment = {
        ...comment,
        createdAt: calcPast(comment.createdDate),
        createdDate: toLocalDateTime(comment.createdDate),
        isReplyBoxOpen: false,
      };

      if (!comment.isChildComment) {
        state.commentList.unshift(comment);
      } else {
        const commentList = state.commentList;
        for (let i = commentList.length - 1; i >= 0; i--) {
          if (
            commentList[i].groupId ||
            commentList[i].commentId === comment.groupId
          ) {
            commentList.splice(i, 0, comment);
            break;
          }
        }
      }
    },

    removeComment(state, commentId) {
      const commentList = state.commentList;
      let index = 0;
      let lastIndex = commentList.length - 1;

      for (index; index < commentList.length; index++) {
        if (commentList[index].commentId === commentId) {
          break;
        }
      }

      // 자식이 있음
      if (commentList.some((comment) => comment.groupId === commentId)) {
        for (lastIndex; lastIndex >= 0; lastIndex--) {
          if (commentList[lastIndex].groupId === commentId) {
            break;
          }
        }

        commentList.splice(index, lastIndex - index + 1);
      } else {
        commentList.splice(index, 1);
      }
    },
  },
};
