<template>
  <v-container>
    <Profile />
    <v-divider class="my-5" />

    <v-row class="mb-16">
      <LeaguePositions />
      <MatchList />
    </v-row>

    <v-row class="mb-16">
      <div class="my-16"></div>
    </v-row>
  </v-container>
</template>

<script>
import Profile from "./Profile.vue";
import LeaguePositions from "./LeaguePositions.vue";
import MatchList from "./MatchList.vue";

export default {
  name: "Summoner",

  components: {
    Profile,
    LeaguePositions,
    MatchList,
  },
};
</script>

<style></style>
