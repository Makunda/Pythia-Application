<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn @click="redirectHome()" target="_blank" text>
        <span class="mr-2 text-h4">Pythia</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <!-- Login -->
      <v-btn @click="redirectLogin()" target="_blank" text>
        <span class="mr-2">Login</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  methods: {
    redirectHome() {
      this.$router.push("Home").catch(() => {
        /* Ignored */
      });
    },
    redirectLogin() {
      this.$router.push("Login").catch(() => {
        /* Ignored */
      });
    },
  },

  data: () => ({
    baseUrl: window.location.origin,
  }),
});
</script>
