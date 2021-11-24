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

    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on"> 로그인 </v-btn>
      </template>

      <v-card class="pt-5">
        <v-card-text class="d-flex align-center">
          <v-btn color="primary" block @click="loginByGoogle">
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
  </v-app-bar>
</template>

<script>
import client from "@/plugins/client";

export default {
  name: "Header",

  data: () => ({
    dialog: false,
  }),

  methods: {
    loginByGoogle: async () => {
      try {
        const accessToken = await client.get("/oauth2/authorization/google");
        client.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
      } catch (error) {
        alert("로그인 실패");
        console.error(error);
      }
    },
  },
};
</script>

<style></style>
