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
                :modifyFunction="modifyPost"
                :removeFunction="removePost"
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

          <div class="pa-6" v-html="content"></div>
        </v-card>

        <Comment />
      </v-col>
    </v-row>

    <v-row style="height: 500px"></v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import Comment from "./Comment.vue";
import ModifyRemoveButton from "./ModifyRemoveButton.vue";

const { mapActions, mapState, mapGetters } =
  createNamespacedHelpers("community/post");

const commentMappers = createNamespacedHelpers("community/post/comment");

export default {
  name: "PostView",

  async mounted() {
    await this.fetchPost(this.$route.params.postId);

    this.initCommentModuleState();
    await this.fetchCommentList(this.$route.params.postId);
  },

  components: {
    Comment,
    ModifyRemoveButton,
  },

  computed: {
    ...mapState(["userId", "userNickname", "viewCount", "title", "content"]),
    ...mapGetters(["getCreatedDate"]),

    currentUserId() {
      return this.$store.getters["auth/currentUserId"];
    },
  },

  methods: {
    ...mapActions(["fetchPost"]),
    ...commentMappers.mapActions(["fetchCommentList"]),
    ...commentMappers.mapMutations(["initCommentModuleState"]),

    modifyPost() {
      console.log("modify");
    },
    removePost() {
      console.log("remove");
    },
  },

  async beforeRouteUpdate(to, from, next) {
    const postId = to.params.postId;
    await this.fetchPost(postId);

    this.initCommentModuleState();
    await this.fetchCommentList(postId);

    next();
  },
};
</script>

<style></style>
