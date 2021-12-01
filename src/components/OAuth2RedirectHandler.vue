<template>
  <div></div>
</template>

<script>
export default {
  name: "OAuth2RedirectHandler",

  created() {
    const accessToken = this.$route.query.token;
    const error = this.$route.query.error;

    if (accessToken) {
      localStorage.setItem("kkaemigg_access_token", accessToken);
    }

    if (error) {
      alert("로그인 실패");
      console.error(error);
    }

    this.$router.replace("/");
  },
};
</script>

<style></style>
