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
      <v-container class="mb-12" fluid style="min-width: 100% !important">
        <!-- Stuff goes here -->
        <!-- General & Parameters -->
        <v-row style="min-width: 90%">
          <p class="text-h4 mt-4 ml-10">Explore the frameworks detected</p>
        </v-row>

        <!-- Search  -->
        <v-row class="padding-border">
          <FrameworkTable> </FrameworkTable>
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
import FrameworkTable from "@/components/account/frameworks/tiles/FrameworkTable.vue";

export default Vue.extend({
  name: "FrameworkExploration",

  components: {
    FrameworkTable,
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
.padding-border {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.screen-content {
  padding-left: 42px;
  max-width: 96% !important;
}
</style>
