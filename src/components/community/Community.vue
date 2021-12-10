<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-0 pa-4 my-10" outlined elevation="0">
          <v-card-title class="px-0">
            <h2 class="ml-3">자유 게시판</h2>
            <v-spacer></v-spacer>
            <v-btn
              plain
              color="grey lighten-1"
              elevation="0"
              class="justify-end pa-0"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-title>

          <v-row justify="end" no-gutters>
            <v-col cols="2">
              <v-select
                :value="getTarget"
                @input="setTarget"
                :items="selectItems"
                class="rounded-l-lg rounded-r-0 border border-r-0"
                hide-details
                flat
                solo
                dense
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-form @submit.prevent="submit">
                <v-text-field
                  :value="keyword"
                  @input="setKeyword"
                  placeholder="검색"
                  hide-details
                  dense
                  flat
                  solo
                  class="rounded-r-lg rounded-l-0 border"
                  background-color="grey lighten-3"
                >
                  <template v-slot:append>
                    <v-icon style="cursor: pointer" @click.stop="submit"
                      >mdi-magnify</v-icon
                    >
                  </template>
                </v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
        <v-data-table
          :headers="headers"
          :options.sync="options"
          :items="postList"
          :items-per-page="size"
          :page.sync="getDisplayedPage"
          :loading="isLoading"
          @click:row="clickRow"
          class="row-pointer"
          disable-pagination
          hide-default-footer
        />
        <div class="text-center mt-3">
          <v-pagination
            :value="getDisplayedPage"
            @input="goSelectPage"
            :length="totalPages"
            total-visible="7"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("community");

export default {
  name: "Community",

  data: () => ({
    isLoading: false,
    options: {},
    headers: [
      { text: "번호", value: "postId" },
      { text: "제목", value: "title" },
      { text: "글쓴이", value: "userNickname" },
      { text: "작성일", value: "createdDate" },
      { text: "조회수", value: "views" },
    ],
  }),

  watch: {
    options: {
      async handler() {
        this.isLoading = true;

        const { sortBy, sortDesc } = this.options;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          this.setSort([sortBy[0], sortDesc[0] ? "DESC" : "ASC"]);
        }

        await this.fetchPostList();

        this.isLoading = false;
      },
      deep: true,
    },
  },

  computed: {
    ...mapState([
      "selectItems",
      "target",
      "keyword",
      "page",
      "size",
      "postList",
      "totalPages",
    ]),
    ...mapGetters(["getTarget", "getDisplayedPage", "getRequestParams"]),
  },

  methods: {
    ...mapActions(["fetchPostList"]),
    ...mapMutations([
      "setTarget",
      "setKeyword",
      "setPage",
      "setSize",
      "setSort",
    ]),

    submit() {
      if (!this.keyword) {
        alert("검색어를 입력해 주세요.");
        return;
      }
      this.setSort([]);
      this.options.sortBy = [];
      this.options.sortDesc = [];

      this.$router.push({
        name: "postSearch",
        query: {
          target: this.target,
          keyword: this.keyword,
        },
      });
    },

    goSelectPage(displayedPage) {
      this.$router.push({
        name: "postSearch",
        params: {
          ...this.$route.query,
          page: displayedPage - 1,
        },
      });
    },

    clickRow() {
      console.log("click");
    },
  },

  async beforeRouteUpdate(to, from, next) {
    const { target, keyword, page } = to.query;

    this.setTarget(target || "TITLE");
    this.setKeyword(keyword || "");
    this.setPage(page || 0);

    this.isLoading = true;

    await this.fetchPostList();

    this.isLoading = false;

    next();
  },
};
</script>

<style scoped>
.border.border-r-0 {
  border-right: none;
}

.border {
  border: 1px solid lightgrey;
}

.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
