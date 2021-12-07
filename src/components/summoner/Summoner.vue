<template>
  <v-container>
    <Profile />
    <v-divider class="my-5" />
    <LeaguePositions />
  </v-container>
</template>

<script>
import Profile from "./Profile.vue";
import LeaguePositions from "./LeaguePositions.vue";

export default {
  name: "Summoner",

  components: {
    Profile,
    LeaguePositions,
  },
};
</script>

<style></style>
