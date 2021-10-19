<template>
  <v-container class="pa-0" fluid fill-height style="overflow-x: hidden">
    <v-row class="pa-0 ma-0">
      <v-parallax
        style="width: 100%"
        height="250"
        src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      ></v-parallax>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-container class="mb-12" style="max-width: 1185px;! important">
        <v-row class="padding-border">
          <p class="text-h4 mt-4 ml-2">Framework classification</p>
        </v-row>
        <v-row>
          <ClassificationTable></ClassificationTable>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import flash, { FlashType } from "@/modules/flash/Flash";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ClassificationTable from "./tiles/ClassificationTable.vue";

export default Vue.extend({
  name: "FrameworkCategorisation",

  components: {
    // Components to include
    ClassificationTable,
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
