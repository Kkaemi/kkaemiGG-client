<template>
  <v-col class="d-flex">
    <div>
      <league-positions-template :rankInfo="soloRankInfo" rankType="솔로랭크" />

      <div class="my-3"></div>

      <league-positions-template
        :rankInfo="freeRankInfo"
        rankType="자유 5:5 랭크"
      />
    </div>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import LeaguePositionsTemplate from "./LeaguePositionsTemplate.vue";

const { mapState, mapGetters, mapActions } = createNamespacedHelpers(
  "summoner/leaguePositions"
);

export default {
  components: { LeaguePositionsTemplate },

  name: "LeaguePositions",

  computed: {
    ...mapState(["soloRankInfo", "freeRankInfo"]),
    ...mapGetters(["getSoloRankTierImage", "getFreeRankTierImage"]),
  },

  methods: {
    ...mapActions(["fetchLeaguePositions"]),
  },
};
</script>

<style></style>
