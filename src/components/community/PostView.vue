<template>
  <v-container>
    <v-row class="mt-10">
      <v-col cols="12">
        <v-card rounded="0">
          <v-card-title class="d-flex flex-column align-start pa-6">
            <v-col cols="12" class="mb-5 d-flex justify-space-between pa-0">
              <div class="text-h4">
                {{ title }}
              </div>

              <ModifyRemoveButton
                v-if="userId === currentUserId"
                @click-modify="clickModifyBtn"
                @click-remove="clickRemoveBtn"
              />
            </v-col>

            <v-col
              cols="12"
              class="d-flex justify-space-between pa-0 text-body-2 text--secondary"
            >
              <div>
                {{ userNickname }}
                <span class="mx-3">|</span>
                {{ getCreatedDate }}
              </div>

              <div>
                조회
                {{ viewCount }}
              </div>
            </v-col>
          </v-card-title>

          <v-divider></v-divider>

          <Viewer class="pa-6" :initialValue="content" />
        </v-card>

        <Comment />
      </v-col>
    </v-row>

    <v-row style="height: 500px"></v-row>
  </v-container>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/vue-editor";
import { createNamespacedHelpers } from "vuex";
import Comment from "./Comment.vue";
import ModifyRemoveButton from "./ModifyRemoveButton.vue";

const postMappers = createNamespacedHelpers("community/post");
const commentMappers = createNamespacedHelpers("community/post/comment");

export default {
  name: "PostView",

  async mounted() {
    this.initCommentModuleState();
    await this.fetchCommentList();
  },

  components: {
    Comment,
    ModifyRemoveButton,
    Viewer,
  },

  computed: {
    ...postMappers.mapState([
      "userId",
      "postId",
      "userNickname",
      "viewCount",
      "title",
      "content",
    ]),
    ...postMappers.mapGetters(["getCreatedDate", "currentUserId"]),
  },

  methods: {
    ...postMappers.mapActions(["fetchPost", "removePost"]),
    ...commentMappers.mapActions(["fetchCommentList"]),
    ...commentMappers.mapMutations(["initCommentModuleState"]),

    clickModifyBtn() {
      const postId = this.postId;
      this.$router.push({ name: "postModify", params: { postId } });
    },

    async clickRemoveBtn() {
      if (
        !confirm(
          "게시글을 삭제하면 복구할 수 없습니다.\n정말 삭제하시겠습니까?"
        )
      ) {
        return;
      }

      await this.removePost();
    },
  },

  async beforeRouteUpdate(to, from, next) {
    this.initCommentModuleState();
    await this.fetchCommentList();

    next();
  },
};
</script>

<style></style>
