<template>
  <div>
    <v-btn
      v-if="!onlyRemove"
      text
      color="success"
      class="rounded-0"
      elevation="0"
      @click.stop="modifyFunction"
    >
      수정
    </v-btn>
    <v-btn
      v-if="!onlyModify"
      text
      color="error"
      class="rounded-0"
      elevation="0"
      @click.stop="removeFunction"
    >
      삭제
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ModifyRemoveButton",

  props: {
    modifyFunction: {
      type: Function,
      default: () => {},
    },

    removeFunction: {
      type: Function,
      default: () => {},
    },

    onlyModify: {
      type: Boolean,
      default: false,
    },

    onlyRemove: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
