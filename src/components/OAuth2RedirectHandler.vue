<template>
  <div></div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapMutations } = createNamespacedHelpers("auth");

export default {
  name: "OAuth2RedirectHandler",

  created() {
    const accessToken = this.$route.query.token;
    const error = this.$route.query.error;

    if (accessToken) {
      this.setToken(accessToken);
    }

    if (error) {
      alert("로그인 실패");
      console.error(error);
    }

    this.$router.replace("/");
  },

  methods: {
    ...mapMutations(["setToken"]),
  },
};
</script>

<style></style>
