<template>
  <v-card class="mt-10" rounded="0">
    <v-card-title>
      댓글
      <span class="ml-3 text--secondary text-body-2"
        >총 <span class="green--text">{{ totalElements }} </span> 개</span
      >
    </v-card-title>

    <v-divider v-if="currentUserId"></v-divider>

    <div class="pa-4">
      <div
        v-if="!currentUserId && !commentList.length"
        class="text--disabled d-flex justify-center flex-column align-center"
      >
        <v-icon x-large>mdi-comment-processing</v-icon>
        <div class="mt-3">등록된 댓글이 없습니다.</div>
      </div>
      <div v-else-if="currentUserId">
        <div class="d-flex flex-column" rounded="0">
          <v-textarea
            :value="parentCommentContent"
            @input="setParentCommentContent"
            placeholder="댓글을 입력해 주세요."
            no-resize
            hide-details
            outlined
            class="rounded-0"
          >
          </v-textarea>
          <div class="text-right mt-1">
            <v-btn
              class="rounded-0"
              color="success"
              elevation="0"
              @click.stop="submitParentComment"
            >
              등록
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(comment, index) in commentList" :key="index">
      <v-divider></v-divider>
      <div
        :class="`d-flex ${comment.isChildComment ? 'grey lighten-3' : ''} pa-4`"
        justify="center"
      >
        <div v-if="comment.isChildComment" class="mr-3">
          <v-icon>mdi-arrow-right-bottom</v-icon>
        </div>
        <div class="d-flex flex-column" style="width: 100%">
          <div>
            <span class="font-weight-bold">{{ comment.author }}</span>
            <span class="mx-2 text--secondary">|</span>
            <v-tooltip top color="black">
              <template v-slot:activator="{ attr, on }">
                <span v-bind="attr" v-on="on" class="text--secondary">
                  {{
                    comment.modifiedAt
                      ? `${comment.modifiedAt} (수정됨)`
                      : comment.createdAt
                  }}
                </span>
              </template>
              <span>
                {{ comment.modifiedDate || comment.createdDate }}
              </span>
            </v-tooltip>
          </div>
          <div class="my-3" v-html="comment.content"></div>
          <div class="d-flex align-center">
            <div>
              <a
                class="text-decoration-none text--secondary"
                @click.stop="toggleReplyBox(comment.commentId)"
              >
                <v-icon small>mdi-message-reply-text</v-icon>
                <span class="text-body-2 ml-1"> 답글 쓰기 </span>
              </a>
            </div>

            <ModifyRemoveButton
              class="ml-auto"
              v-if="currentUserId === comment.userId"
              @click-modify="clickModifyBtn(comment.commentId)"
              @click-remove="clickRemoveBtn(comment.commentId)"
            />
          </div>
        </div>
      </div>

      <div v-if="comment.isReplyBoxOpen">
        <div class="d-flex flex-column grey lighten-3 pa-4" rounded="0">
          <v-textarea
            :value="comment.childCommentContent"
            @input="
              (content) =>
                setChildCommentContent({
                  commentId: comment.commentId,
                  content,
                })
            "
            placeholder="댓글을 입력해 주세요."
            no-resize
            hide-details
            outlined
            class="rounded-0"
          >
            <template v-slot:prepend>
              <span class="text--disabled">
                <v-icon>mdi-arrow-right-bottom</v-icon>
              </span>
            </template>
          </v-textarea>
          <div class="text-right mt-1">
            <v-btn
              class="rounded-0"
              color="success"
              elevation="0"
              @click.stop="
                submitChildComment(comment.commentId, comment.groupId)
              "
            >
              등록
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <v-divider></v-divider>
    <div>
      <v-btn
        x-large
        block
        text
        plain
        class="rounded-0"
        v-if="isMore"
        :loading="isMoreFetchLoading"
        @click.stop="clickFetchMoreButton"
        >댓글 더 보기</v-btn
      >
    </div>

    <v-dialog v-model="modifyDialog" persistent>
      <v-card>
        <v-card-title> 댓글 수정 </v-card-title>

        <v-divider></v-divider>

        <div class="pa-5">
          <v-textarea
            class="rounded-0"
            v-model="commentContent"
            outlined
            no-resize
            hide-details
          ></v-textarea>
        </div>

        <v-card-actions class="justify-end">
          <v-btn text @click.stop="modifyDialog = false">취소</v-btn>
          <v-btn text @click.stop="submitModifiedContent" color="success"
            >수정</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import ModifyRemoveButton from "./ModifyRemoveButton.vue";

const { mapState, mapActions, mapMutations, mapGetters } =
  createNamespacedHelpers("community/post/comment");

export default {
  name: "Comment",

  components: {
    ModifyRemoveButton,
  },

  data: () => ({
    modifyDialog: false,
    modifyCommmentId: 0,
    commentContent: "",
  }),

  computed: {
    ...mapState([
      "commentList",
      "isMoreFetchLoading",
      "isMore",
      "page",
      "totalElements",
      "parentCommentContent",
    ]),
    ...mapGetters(["currentUserId"]),
  },

  methods: {
    ...mapActions([
      "writeComment",
      "removeComment",
      "modifyComment",
      "fetchCommentList",
      "toggleIsReplyBoxOpen",
    ]),
    ...mapMutations([
      "setPage",
      "setIsMoreFetchLoading",
      "setParentCommentContent",
      "setChildCommentContent",
    ]),

    async clickFetchMoreButton() {
      this.setIsMoreFetchLoading(true);
      this.setPage(this.page + 1);
      await this.fetchCommentList();
      this.setIsMoreFetchLoading(false);
    },

    // 최상위 댓글 submit
    async submitParentComment() {
      const parentCommentId = null;
      const groupId = null;

      await this.writeComment({
        parentCommentId,
        groupId,
      });
    },

    // 댓글 or 대댓글 submit
    async submitChildComment(parentCommentId, groupId) {
      await this.writeComment({
        parentCommentId,
        groupId,
      });
    },

    // 댓글 수정
    async submitModifiedContent() {
      const content = this.commentContent;
      const commentId = this.modifyCommmentId;

      if (!content) {
        alert("댓글을 입력해 주세요.");
        return;
      }

      if (!confirm("수정 하시겠습니까?")) {
        return;
      }

      this.modifyDialog = false;
      await this.modifyComment({
        commentId,
        content,
      });
    },

    // 댓글 or 대댓글 작성 버튼 (답글 쓰기) 토글
    async toggleReplyBox(commentId) {
      await this.toggleIsReplyBoxOpen(commentId);
    },

    clickModifyBtn(commentId) {
      this.modifyCommmentId = commentId;
      this.modifyDialog = true;
      this.commentContent = this.commentList
        .find((comment) => comment.commentId === commentId)
        .content.replace(/<br>/g, "\n");
    },

    async clickRemoveBtn(commentId) {
      if (!window.confirm("정말 삭제하시겠습니까?")) {
        return;
      }

      await this.removeComment(commentId);
    },
  },
};
</script>

<style></style>
