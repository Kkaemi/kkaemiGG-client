<template>
  <v-container>
    <v-row class="mt-16 text-center" justify="center">
      <v-col class="mt-16" cols="12">
        <v-img
          class="my-5"
          :src="require('@/assets/logo.svg')"
          contain
          max-height="75"
        />
      </v-col>
    </v-row>

    <v-row class="text-center" align="baseline" justify="center">
      <v-col cols="8">
        <form @submit.prevent="submit">
          <v-text-field
            v-model="userName"
            outlined
            placeholder="소환사명을 입력해 주세요."
          >
            <template v-slot:append>
              <v-icon style="cursor: pointer" @click.stop="submit"
                >mdi-magnify</v-icon
              >
            </template>
          </v-text-field>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",

  data: () => ({
    userName: "",
  }),

  methods: {
    submit() {
      if (/[`~!@#$%^&*|\\'\\";:\\/?]/gi.test(this.userName)) {
        alert("특수문자는 입력할 수 없습니다.");
        return;
      }

      this.$router.push({
        name: "summoner",
        params: { userName: this.userName },
      });
    },
  },
};
</script>
