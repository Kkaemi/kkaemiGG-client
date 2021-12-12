<template>
  <v-container>
    <v-row>
      <v-col cols="12"> </v-col>
      <v-col cols="12">
        <v-text-field
          :value="title"
          @input="setTitle"
          class="rounded-0"
          outlined
          hide-details
          placeholder="제목을 입력해 주세요."
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <Editor
          ref="toastuiEditor"
          height="800px"
          :options="editorOptions"
          initialEditType="wysiwyg"
          previewStyle="vertical"
        />
      </v-col>
    </v-row>

    <v-row style="height: 300px" class="text-right" justify="center">
      <v-col cols="12">
        <v-dialog v-model="cancelDialog" max-width="290">
          <template v-slot:activator="{ attr, on }">
            <v-btn
              class="mr-3 rounded-0"
              v-bind="attr"
              v-on="on"
              elevation="0"
              outlined
              >취소</v-btn
            >
          </template>

          <v-card>
            <v-card-title class="text-h6"> 글쓰기 </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="text-center mt-10 font-weight-bold">
              글 작성을 취소하시겠습니까?
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn
                class="rounded-0"
                elevation="0"
                outlined
                @click.stop="cancelDialog = false"
                >취소</v-btn
              >
              <v-btn
                class="rounded-0"
                color="primary"
                elevation="0"
                @click.stop="$router.go(-1)"
                >확인</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          color="primary"
          class="rounded-0"
          elevation="0"
          @click.stop="submit"
          >등록</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@toast-ui/editor/dist/i18n/ko-kr";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapMutations, mapState } =
  createNamespacedHelpers("community/post");

export default {
  name: "PostWrite",

  components: {
    Editor,
  },

  computed: {
    ...mapState(["title"]),
  },

  data() {
    return {
      cancelDialog: false,
      editorOptions: {
        minHeight: "200px",
        language: "ko-KR",
        useCommandShortcut: true,
        useDefaultHTMLSanitizer: true,
        usageStatistics: true,
        hideModeSwitch: false,
        hooks: {
          addImageBlobHook: async (fileOrBlob, callback) => {
            const imageUrl = await this.uploadImage(fileOrBlob);
            if (!imageUrl) {
              return;
            }

            callback(imageUrl);
          },
        },
      },
    };
  },

  methods: {
    ...mapActions(["uploadImage", "writePost"]),
    ...mapMutations(["setTitle", "setContent"]),

    async submit() {
      const content = this.$refs.toastuiEditor.invoke("getHtml");

      if (!this.title) {
        alert("제목을 입력해 주세요.");
        return;
      }

      if (!content) {
        alert("내용을 입력해 주세요.");
        return;
      }

      this.setContent(content);
      await this.writePost();
    },
  },
};
</script>

<style scoped></style>
