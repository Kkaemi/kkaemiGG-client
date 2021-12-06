<template>
  <keep-alive>
    <component v-bind:is="component"></component>
  </keep-alive>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import NotExists from "./NotExists.vue";
import Summoner from "./Summoner.vue";

const { mapState, mapMutations, mapActions } =
  createNamespacedHelpers("summoner");

export default {
  async created() {
    this.setUserName(this.$route.params.userName);
    await this.checkUserName();

    this.component = this.isExists ? Summoner : NotExists;
  },

  computed: {
    ...mapState(["isExists"]),
  },

  data: () => ({
    component: null,
  }),

  methods: {
    ...mapMutations(["setUserName"]),
    ...mapActions(["checkUserName"]),
  },
};
</script>

<style></style>
