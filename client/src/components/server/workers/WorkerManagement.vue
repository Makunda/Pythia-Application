<template>
  <v-container class="pa-0" fluid style="overflow-x: hidden">
    <v-row class="pa-0 ma-0">
      <v-parallax
          style="width: 100%"
          height="100"
          src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      ></v-parallax>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-container style="min-width: 90%" class="mx-10 mb-12" fluid>
        <v-row><h2>Worker management</h2></v-row>
        <v-row><WorkerInstanceTable /></v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import WorkerInstanceTable from "@/components/server/workers/components/WorkerInstanceTable.vue";

export default Vue.extend({
  name: "WorkerManagement",

  components: {
    // Components to include
    WorkerInstanceTable
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
