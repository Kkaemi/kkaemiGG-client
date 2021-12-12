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

              <div v-if="userId == currentUserId">
                <v-btn
                  color="success"
                  class="mr-2"
                  elevation="0"
                  @click.stop="modifyPost"
                >
                  수정
                </v-btn>
                <v-btn color="error" elevation="0" @click.stop="removePost">
                  삭제
                </v-btn>
              </div>
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

        <v-card class="mt-10" rounded="0">
          <v-card-title>
            댓글
            <span class="ml-3 text--secondary text-body-2"
              >총 <span class="green--text">0</span> 개</span
            >
          </v-card-title>

          <v-divider></v-divider>

          <div class="pa-4">
            <div
              v-if="!currentUserId"
              class="text--disabled d-flex justify-center flex-column align-center"
            >
              <v-icon x-large>mdi-comment-processing</v-icon>
              <div class="mt-3">등록된 댓글이 없습니다.</div>
            </div>
            <div v-else>
              <div class="d-flex flex-column" rounded="0">
                <v-textarea
                  placeholder="댓글을 입력해 주세요."
                  no-resize
                  hide-details
                  outlined
                  class="rounded-0"
                >
                </v-textarea>
                <div class="text-right mt-1">
                  <v-btn class="rounded-0" color="success" elevation="0">
                    등록
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row style="height: 500px"></v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapState, mapGetters } =
  createNamespacedHelpers("community/post");

export default {
  name: "PostView",

  async mounted() {
    await this.fetchPost(this.$route.params.postId);
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

    next();
  },
};
</script>

<style></style>
