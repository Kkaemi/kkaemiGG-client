<template>
  <v-app-bar app color="primary" dark>
    <router-link to="/" style="text-decoration: none; color: inherit">
      <v-toolbar-title class="d-flex align-center">
        <div>
          <v-icon size="30"> mdi-trophy-variant </v-icon>
        </div>
        <div>
          <span class="ml-4 text-h4 font-weight-medium"> KKAEMI.GG </span>
        </div>
      </v-toolbar-title>
    </router-link>

    <v-btn elevation="0" class="ml-5" plain :to="{ name: 'postSearch' }">
      커뮤니티
    </v-btn>

    <v-spacer></v-spacer>

    <v-dialog v-if="!isAuthenticated" v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on"> 로그인 </v-btn>
      </template>

      <v-card class="pt-5">
        <v-card-text
          class="d-flex align-center"
          v-for="(social, index) in socials"
          :key="index"
        >
          <v-btn
            :color="social.buttonColor"
            block
            :href="getSocialLoginUrl(social.type)"
          >
            <v-icon>{{ social.icon }}</v-icon>
            <span class="ml-3">{{ social.comment }}</span>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn v-else text @click="logout"> 로그아웃 </v-btn>
  </v-app-bar>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { API_BASE_URL, REDIRECT_URI } from "@/constant";

const { mapActions, mapGetters } = createNamespacedHelpers("auth");

export default {
  name: "Header",

  data: () => ({
    dialog: false,
    drawer: false,
    socials: [
      {
        type: "google",
        buttonColor: "primary",
        icon: "mdi-google",
        comment: "구글로 로그인",
      },
      {
        type: "naver",
        buttonColor: "success",
        icon: "mdi-alpha-n-box",
        comment: "네이버로 로그인",
      },
    ],
  }),

  computed: {
    ...mapGetters(["token"]),
    isAuthenticated() {
      return this.token !== null;
    },
  },

  methods: {
    ...mapActions(["logout"]),
    getSocialLoginUrl(socialType) {
      return `${API_BASE_URL}/oauth2/authorize/${socialType}?redirect_uri=${REDIRECT_URI}`;
    },
  },
};
</script>

<style></style>
