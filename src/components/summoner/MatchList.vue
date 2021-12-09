<template>
  <v-col cols="9">
    <v-sheet
      outlined
      v-for="(match, index) in matchList"
      :key="index"
      class="d-flex mb-3 pa-5 flex-wrap justify-space-between"
      :color="match.win ? 'blue lighten-3' : 'red lighten-3'"
    >
      <v-tooltip top color="black">
        <template v-slot:activator="{ on, attrs }">
          <div
            class="d-flex flex-column justify-center text-center"
            v-bind="attrs"
            v-on="on"
          >
            <div
              :class="`font-weight-bold ${
                match.win ? 'blue' : 'red'
              }--text text--darken-1`"
            >
              {{ match.win ? "승리" : "패배" }}
            </div>
            <div class="text-caption">
              {{ match.queue }}
            </div>
            <div class="text-caption">
              {{ getTimeDiff(match.gameEnd) }}
            </div>
            <div class="text-caption">
              {{ match.gameDuration }}
            </div>
          </div>
        </template>
        <span>
          {{ toLocaleString(match.gameEnd) }}
        </span>
      </v-tooltip>

      <div class="d-flex align-center justify-center">
        <div class="d-flex align-center justify-center">
          <v-tooltip top color="black">
            <template v-slot:activator="{ on, attrs }">
              <v-img
                :src="match.championInfo.championImageUrl"
                width="55"
                v-bind="attrs"
                v-on="on"
              />
            </template>

            <span class="font-weight-bold">
              {{ match.championInfo.championName }}
            </span>
          </v-tooltip>

          <div class="mx-2">
            <v-tooltip
              top
              color="black"
              v-for="(spellInfo, index) in match.spellInfoList"
              max-width="200"
              :key="index"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-img
                  :src="spellInfo.spellImageUrl"
                  width="25"
                  class="my-1"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>

              <span>
                <span class="amber--text font-weight-bold text-caption">
                  {{ spellInfo.spellName }}
                </span>
                <br />
                <span class="text-caption font-weight-bold">
                  {{ spellInfo.spellDescription || "" }}
                </span>
              </span>
            </v-tooltip>
          </div>

          <div>
            <v-tooltip
              color="black"
              top
              v-for="runeInfo in match.runeInfoList"
              max-width="300"
              :key="runeInfo.runeName"
            >
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="my-1 black rounded-xl d-flex justify-center"
                  style="width: 25px; height: 25px"
                >
                  <v-img
                    :src="runeInfo.runeImageUrl"
                    contain
                    max-width="20"
                    v-bind="attrs"
                    v-on="on"
                  />
                </div>
              </template>

              <span>
                <span class="amber--text font-weight-bold text-caption">
                  {{ runeInfo.runeName }}
                </span>
                <br />
                <span
                  v-html="runeInfo.runeDescription"
                  class="font-weight-bold text-caption"
                >
                </span>
              </span>
            </v-tooltip>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column align-center justify-center">
        <div class="font-weight-bold text-subtitle-1">
          {{ match.kills }}
          /
          <span class="red--text text--darken-2">
            {{ match.deaths }}
          </span>
          /
          {{ match.assists }}
        </div>

        <div class="font-weight-bold text-body-2 grey--text text--darken-2">
          {{ getKDARate(match.kills, match.deaths, match.assists) }} 평점
        </div>
      </div>

      <div
        class="
          d-flex
          flex-column
          align-center
          justify-center
          text-body-2
          grey--text
          text--darken-2
        "
      >
        <div>레벨{{ match.championInfo.championLevel }}</div>
        <div>
          CS
          <span class="font-weight-bold">
            {{ match.totalMinionsKilled }}
          </span>

          ({{ match.csPerMinute }}/m)
        </div>
        <div class="red--text text--darken-1">
          킬관여 {{ match.participantKillRate }}
        </div>
      </div>

      <div
        class="d-flex flex-wrap align-center align-self-center"
        style="width: 140px"
      >
        <v-tooltip
          top
          color="black"
          max-width="300"
          v-for="(itemInfo, index) in match.itemInfoList"
          :key="index"
        >
          <template v-slot:activator="{ attr, on }">
            <div
              v-if="!itemInfo.itemImageUrl"
              v-bind="attr"
              v-on="on"
              class="grey lighten-1 rounded mr-1 mt-1"
              style="width: 30px; height: 30px"
            ></div>
            <v-img
              v-else
              v-bind="attr"
              v-on="on"
              :src="itemInfo.itemImageUrl"
              max-width="30"
              contain
              class="rounded mr-1 mt-1"
            />
          </template>

          <span>
            <span class="cyan--text font-weight-bold">
              {{ itemInfo.itemName }}
            </span>
            <br />

            <span
              class="font-weight-bold"
              v-html="itemInfo.itemDescription || ''"
            >
            </span>
          </span>
        </v-tooltip>
      </div>

      <div class="d-flex justify-center">
        <!-- blue team -->
        <div class="d-flex flex-column mr-2 justify-space-between">
          <v-tooltip
            left
            color="black"
            v-for="(participantInfo, index) in getBlueTeam(
              match.participantInfoList
            )"
            :key="index"
          >
            <template v-slot:activator="{ attr, on }">
              <div class="d-flex mb-1 align-center">
                <v-img
                  v-bind="attr"
                  v-on.stop="on"
                  :src="participantInfo.championImageUrl"
                  :class="`mr-1 ${
                    getUserName.toLowerCase() ===
                    participantInfo.userName.toLowerCase()
                      ? 'rounded-xl'
                      : ''
                  }`"
                  contain
                  max-width="20"
                />
                <div class="text-caption font-weight-medium">
                  <router-link
                    class="text-decoration-none black--text"
                    :to="{
                      name: 'summoner',
                      params: { userName: participantInfo.userName },
                    }"
                  >
                    {{ participantInfo.userName }}
                  </router-link>
                </div>
              </div>
            </template>

            <span class="font-weight-bold">
              {{ participantInfo.championName }}
            </span>
          </v-tooltip>
        </div>

        <!-- red team -->
        <div class="d-flex flex-column justify-space-between">
          <v-tooltip
            left
            color="black"
            v-for="(participantInfo, index) in getRedTeam(
              match.participantInfoList
            )"
            :key="index"
          >
            <template v-slot:activator="{ attr, on }">
              <div class="d-flex mb-1 align-center">
                <v-img
                  v-bind="attr"
                  v-on.stop="on"
                  :src="participantInfo.championImageUrl"
                  :class="`mr-1 ${
                    getUserName.toLowerCase() ===
                    participantInfo.userName.toLowerCase()
                      ? 'rounded-xl'
                      : ''
                  }`"
                  contain
                  max-width="20"
                />
                <div class="text-caption font-weight-medium">
                  <router-link
                    class="text-decoration-none black--text"
                    :to="{
                      name: 'summoner',
                      params: { userName: participantInfo.userName },
                    }"
                  >
                    {{ participantInfo.userName }}
                  </router-link>
                </div>
              </div>
            </template>

            <span class="font-weight-bold">
              {{ participantInfo.championName }}
            </span>
          </v-tooltip>
        </div>
      </div>
    </v-sheet>
  </v-col>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { DateTime } from "luxon";

const { mapState, mapActions, mapMutations, mapGetters } =
  createNamespacedHelpers("summoner/matchList");

export default {
  name: "MatchList",

  async mounted() {
    this.setMatchList([]);
    await this.fetchMatchList();
  },

  computed: {
    ...mapState(["matchList"]),
    ...mapGetters(["getUserName"]),
  },

  methods: {
    ...mapActions(["fetchMatchList"]),
    ...mapMutations(["setMatchList"]),

    toLocaleString(UTCDateTime) {
      return DateTime.fromISO(UTCDateTime).toLocaleString(
        DateTime.DATETIME_SHORT
      );
    },

    getTimeDiff(UTCDateTime) {
      const mapObj = {
        years: "년 전",
        months: "개월 전",
        weeks: "주 전",
        days: "일 전",
        hours: "시간 전",
        minutes: "분 전",
        seconds: "초 전",
      };

      const start = DateTime.fromISO(UTCDateTime);
      const end = DateTime.now();
      const diffObj = end
        .diff(start, [
          "years",
          "months",
          "weeks",
          "days",
          "hours",
          "minutes",
          "seconds",
        ])
        .toObject();

      const keys = Object.keys(diffObj);

      for (const key of keys) {
        if (diffObj[key] !== 0) {
          return `${diffObj[key]}${mapObj[key]}`;
        }
      }

      return "1초 전";
    },

    getKDARate(kills, deaths, assists) {
      if (!deaths) {
        return "Perfect";
      }

      return (
        Math.round(((kills + assists) / deaths + Number.EPSILON) * 100) / 100
      ).toFixed(2);
    },

    getBlueTeam(participantInfoList) {
      const copy = [...participantInfoList];
      copy.splice(5);
      return copy;
    },

    getRedTeam(participantInfoList) {
      const copy = [...participantInfoList];
      return copy.splice(5);
    },
  },
};
</script>

<style></style>
