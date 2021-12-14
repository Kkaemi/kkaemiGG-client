<template>
  <div>
    <v-btn
      v-if="!onlyRemove"
      text
      color="success"
      class="rounded-0"
      elevation="0"
      @click.stop="$emit('click-modify')"
    >
      수정
    </v-btn>
    <v-btn
      v-if="!onlyModify"
      text
      color="error"
      class="rounded-0"
      elevation="0"
      @click.stop="$emit('click-remove')"
    >
      삭제
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ModifyRemoveButton",

  props: {
    clickModify: {
      type: Function,
      default: () => {},
    },

    clickRemove: {
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
