<template>
  <keep-alive>
    <component v-bind:is="component"></component>
  </keep-alive>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import NotExists from "./NotExists.vue";
import Summoner from "./Summoner.vue";

const loadingMappers = createNamespacedHelpers("loading");
const summonerMappers = createNamespacedHelpers("summoner");
const profileMappers = createNamespacedHelpers("summoner/profile");
const matchListMappers = createNamespacedHelpers("summoner/matchList");
const leaguePostionsMappers = createNamespacedHelpers(
  "summoner/leaguePositions"
);

export default {
  async created() {
    this.setUserName(this.$route.params.userName);
    await this.checkUserName();

    if (!this.isExists) {
      this.component = NotExists;
      return;
    }

    this.setIsLoading(true);

    await this.fetchProfile();
    await this.fetchLeaguePositions();
    await this.fetchMatchList();

    this.setIsLoading(false);

    this.component = Summoner;
  },

  computed: {
    ...summonerMappers.mapState(["isExists"]),
  },

  data: () => ({
    component: null,
  }),

  methods: {
    ...loadingMappers.mapMutations(["setIsLoading"]),

    ...summonerMappers.mapMutations(["setUserName"]),
    ...matchListMappers.mapMutations(["setBeginIndex"]),
    ...profileMappers.mapMutations(["initProfileModuleState"]),
    ...leaguePostionsMappers.mapMutations(["initLeaguePositionsModuleState"]),
    ...matchListMappers.mapMutations(["initMatchListModuleState"]),

    ...summonerMappers.mapActions(["checkUserName"]),
    ...profileMappers.mapActions(["fetchProfile"]),
    ...leaguePostionsMappers.mapActions(["fetchLeaguePositions"]),
    ...matchListMappers.mapActions(["fetchMatchList"]),
  },

  async beforeRouteUpdate(to, from, next) {
    this.setUserName(to.params.userName);
    await this.checkUserName();

    if (!this.isExists) {
      this.component = NotExists;
      next();
      return;
    }

    this.setIsLoading(true);

    this.initProfileModuleState();
    await this.fetchProfile();

    this.initLeaguePositionsModuleState();
    await this.fetchLeaguePositions();

    this.initMatchListModuleState();
    await this.fetchMatchList();

    this.setIsLoading(false);

    this.component = Summoner;
    next();
  },
};
</script>

<style></style>
