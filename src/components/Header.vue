<template>
  <v-app-bar app color="primary" dark>
    <router-link to="/" style="text-decoration: none; color: inherit">
      <div class="d-flex align-center">
        <div>
          <v-icon size="50"> mdi-trophy-variant </v-icon>
        </div>
        <div>
          <span class="ml-4 text-h3 font-weight-medium"> KKAEMI.GG </span>
        </div>
      </div>
    </router-link>

    <v-spacer></v-spacer>

    <v-dialog v-if="!authenticated" v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on"> 로그인 </v-btn>
      </template>

      <v-card class="pt-5">
        <v-card-text class="d-flex align-center">
          <v-btn
            color="primary"
            block
            href="http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect"
          >
            <v-icon>mdi-google</v-icon>
            <span class="ml-3">구글로 로그인</span>
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
import axios from "axios";

export default {
  name: "Header",

  data: () => ({
    dialog: false,
  }),

  computed: {
    authenticated() {
      return localStorage.getItem("kkaemigg_access_token") !== null;
    },
  },

  methods: {
    logout: async () => {
      try {
        await axios.delete("http://localhost:8080/api/v1/token", {
          withCredentials: true,
        });
        localStorage.removeItem("kkaemigg_access_token");
      } catch (error) {
        alert("로그아웃 실패");
      }
    },
  },
};
</script>

<style></style>
