<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-0 pa-4 my-10" outlined elevation="0">
          <v-card-title class="px-0">
            <h2 class="ml-3">자유 게시판</h2>
            <v-spacer></v-spacer>
            <v-btn
              small
              icon
              plain
              elevation="0"
              color="grey lighten-1"
              class="justify-end pa-0"
              :to="{ name: 'postWrite' }"
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
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="text-center"
                  v-for="(header, index) in headers"
                  :key="index"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="post in postList"
                :key="post.postId"
                style="cursor: pointer"
                @click.stop="clickRow(post.postId)"
              >
                <td class="text-center">{{ post.postId }}</td>
                <td>{{ post.title }}</td>
                <td class="text-center">{{ post.userNickname }}</td>
                <v-tooltip top color="black">
                  <template v-slot:activator="{ attr, on }">
                    <td v-bind="attr" v-on="on" class="text-center">
                      {{ post.fromNow }}
                    </td>
                  </template>
                  <span>
                    {{ post.createdDate }}
                  </span>
                </v-tooltip>
                <td class="text-center">
                  {{ post.views }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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

    <v-row style="height: 300px"></v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters, mapActions, mapMutations } =
  createNamespacedHelpers("community");

export default {
  name: "Community",

  async mounted() {
    const { target, keyword, page } = this.$route.query;

    this.setTarget(target || "TITLE");
    this.setKeyword(keyword || "");
    this.setPage(page ? page - 1 : 0);

    await this.fetchPostList();
  },

  data: () => ({
    headers: ["번호", "제목", "글쓴이", "작성일", "조회수"],
  }),

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

      this.setPage(0);

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
        query: {
          ...this.$route.query,
          page: displayedPage,
        },
      });
    },

    clickRow(postId) {
      this.$router.push({ name: "postView", params: { postId } });
    },
  },

  async beforeRouteUpdate(to, from, next) {
    const { target, keyword, page } = to.query;

    this.setTarget(target || "TITLE");
    this.setKeyword(keyword || "");
    this.setPage(page ? page - 1 : 0);

    await this.fetchPostList();

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
</style>
