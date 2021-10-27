<template>
  <v-container class="pa-0" style="overflow-x: hidden">
    <v-row class="pa-0 mt-12 ma-0" justify="center">
      <!-- Number of frameworks -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto"
          color="lessDeepBlue"
          dark
          height="200px"
          max-width="100%"
        >
          <v-card-title> Number of framework </v-card-title>
        </v-card>
      </v-col>

      <!-- Number of frameworks by language -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto"
          color="lessDeepBlue"
          dark
          height="200px"
          max-width="100%"
        >
          <v-card-title> Number of framework by language </v-card-title>
        </v-card>
      </v-col>

      <!-- Number views -->
      <v-col cols="12" md="3">
        <v-card
          class="mx-auto"
          color="lessDeepBlue"
          dark
          height="200px"
          max-width="100%"
        >
          <v-card-title> Number of views </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import flash, { FlashType } from "@/modules/flash/Flash";

export default Vue.extend({
  name: "StatisticBanner",

  components: {
    // Components to include
  },

  mounted() {
    // On mounted
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
  },

  data: () => ({
    // Frameworks number
  }),
});
</script>

<style scoped>
.card-account {
}

.padding-border {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
