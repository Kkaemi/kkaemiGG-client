<template>
  <v-sheet v-if="!rankInfo" outlined class="d-flex pa-5 align-center">
    <v-img
      src="@/assets/ranked-emblems/Emblem_Unranked.png"
      max-width="70"
      contain
    ></v-img>
    <div class="ml-6">
      <div class="text--secondary text-body-2">{{ rankType }}</div>
      <div class="text--secondary font-weight-bold">Unranked</div>
    </div>
  </v-sheet>
  <v-sheet v-else outlined class="d-flex pa-5 align-center">
    <v-img
      :src="require(`@/assets/ranked-emblems/Emblem_${rankInfo.tier}.png`)"
      contain
      max-width="70"
    ></v-img>

    <div class="ml-6">
      <div class="text--secondary text-body-2">
        {{ rankType }}
      </div>

      <div class="font-weight-bold blue--text text--darken-2">
        {{ rankInfo.tier }} {{ rankInfo.division }}
      </div>
      <div class="text--secondary text-body-2">
        <span class="font-weight-bold">{{ rankInfo.leaguePoint }}LP</span>
        / {{ rankInfo.wins }}승 {{ rankInfo.losses }}패
      </div>
      <div class="text--secondary text-body-2">
        승률
        {{ calculateWinRate(rankInfo.wins, rankInfo.losses) }}%
      </div>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: "LeaguePositionsTemplate",

  props: ["rankInfo", "rankType"],

  methods: {
    calculateWinRate: (wins, losses) => {
      return (
        Math.round(((wins / (wins + losses)) * 100 + Number.EPSILON) * 10) / 10
      );
    },
  },
};
</script>

<style></style>
