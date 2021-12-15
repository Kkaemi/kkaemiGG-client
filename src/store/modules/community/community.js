import { kkaemiGGApi } from "@/api/kkaemigg";
import { calcPast, toLocalDateTime } from "../../../utils/date-utils";
import post from "./post";

export default {
  namespaced: true,

  state: {
    selectItems: [
      { text: "제목", value: "TITLE" },
      { text: "작성자", value: "AUTHOR" },
    ],
    target: "TITLE",
    keyword: "",

    page: 0,
    size: 10,
    sort: [],

    postList: [],
    totalPages: 0,
  },

  getters: {
    getTarget: ({ selectItems, target }) => {
      return selectItems.find((item) => item.value === target);
    },

    getDisplayedPage: (state) => {
      return state.page + 1;
    },

    getRequestParams: ({ target, keyword, page, size, sort }) => {
      return {
        target,
        keyword,
        page,
        size,
        sort: sort.join(","),
      };
    },
  },

  actions: {
    async fetchPostList({ commit, getters }) {
      const params = getters.getRequestParams;

      const { content, totalPages } = await kkaemiGGApi
        .get("/v1/posts", { params: { ...params } })
        .then(({ data }) => data.data);

      commit("setPostList", content);
      commit("setTotalPages", totalPages);
    },
  },

  mutations: {
    setTarget(state, target) {
      state.target = target;
    },

    setKeyword(state, keyword) {
      state.keyword = keyword;
    },

    setPage(state, page) {
      state.page = page;
    },

    setSize(state, size) {
      state.size = size;
    },

    setSort(state, sort) {
      state.sort = sort;
    },

    setPostList(state, postList) {
      state.postList = postList.map((post) => {
        return {
          ...post,
          fromNow: calcPast(post.createdDate),
          createdDate: toLocalDateTime(post.createdDate),
        };
      });
    },

    setTotalPages(state, totalPages) {
      state.totalPages = totalPages;
    },
  },

  modules: {
    post,
  },
};
