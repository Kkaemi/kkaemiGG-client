<template>
  <v-overlay z-index="0" :value="isLoading">
    <PacmanLoader color="#64b5f6" />
  </v-overlay>
</template>

<script>
import PacmanLoader from "vue-spinner/src/PacmanLoader.vue";
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("loading");

export default {
  components: {
    PacmanLoader,
  },

  computed: {
    ...mapState(["isLoading"]),
  },
};
</script>

<style></style>
