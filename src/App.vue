<template>
  <v-app>
    <Header />
    <v-main>
      <router-view></router-view>
      <Spinner />
      <Footer />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "@/components/Footer.vue";
import Spinner from "./components/Spinner.vue";

export default {
  name: "App",

  components: {
    Header,
    Footer,
    Spinner,
  },
};
</script>
