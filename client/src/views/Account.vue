<template>
  <v-container class="d-flex justify-center">
    <v-card class="mt-10" flat width="80%">
      <v-app-bar
        collapse
        collapse-on-scroll
        absolute
        class="rounded-pill"
        color="blue-grey lighten-1"
        dark
        scroll-target="#scrolling-techniques-6"
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <!-- Account -->
        <v-chip
          @click="tab = 'account'"
          color="blue-grey lighten-2 mr-3"
          text-color="white"
        >
          Account overview
        </v-chip>

        <!-- Framework -->
        <v-chip
          @click="tab = 'framework'"
          color="blue-grey lighten-2 mr-3"
          text-color="white"
        >
          Frameworks
        </v-chip>

        <v-spacer></v-spacer>
      </v-app-bar>

      <!-- Container -->
      <v-container class="mx-auto pt-5 mt-5" width="100%" min-height="500px">
        <AccountWidget v-if="tab == 'account'" />
        <FrameworkWidget v-if="tab == 'framework'" />
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import AccountWidget from "../components/account/AccountWidget.vue";
import FrameworkWidget from "../components/account/FrameworkWidget.vue";

export default Vue.extend({
  name: "Home",

  components: {
    AccountWidget,
    FrameworkWidget,
  },

  data() {
    return {
      tab: "account",
    };
  },
});
</script>
