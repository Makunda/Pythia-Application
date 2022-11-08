<template>
  <v-container class="pa-0" fluid style="overflow-x: hidden">
    <v-row class="pa-0 ma-0">
      <v-parallax
          style="width: 100%"
          height="250"
          src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      ></v-parallax>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-container style="min-width: 90%" class="mx-0 mb-12" fluid>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import flash, { FlashType } from "@/modules/flash/Flash";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ImagingFrameworkTable from "./components/ImagingFrameworkTable.vue";

export default Vue.extend({
  name: "WorkerManagement",

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
    // Populate with Data
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
