<template>
  <v-row class="mt-15">
    <v-col cols="2" class="d-flex justify-center">
      <v-img :src="profileIconImageUrl" max-width="100" />
    </v-col>
    <v-col cols="10">
      <div class="font-weight-bold text-h4">
        {{ name }}
      </div>

      <div class="mt-2">레벨 : {{ level }}</div>
    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapState } = createNamespacedHelpers("summoner/profile");

export default {
  name: "Profile",

  async mounted() {
    await this.fetchProfile();
  },

  computed: {
    ...mapState(["level", "name", "profileIconImageUrl"]),
  },

  methods: {
    ...mapActions(["fetchProfile"]),
  },
};
</script>

<style></style>
