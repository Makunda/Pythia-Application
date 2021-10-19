<template>
  <v-container class="pa-0" fluid style="overflow-x: hidden">
    <v-container class="text-center">
      <v-row class="d-flex flex-column justify-center mt-12">
        <p class="text-h2">
          <v-img
            :src="require('@/assets/logo.svg')"
            class="my-1"
            contain
            height="70px"
          />
          NASD Pythia
        </p>
        <p class="text-h3">Intelligence repository</p>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import flash, { FlashType } from "@/modules/flash/Flash";
import ApiResponseImpl from "@/utils/ApiResponseImpl";

export default Vue.extend({
  name: "HomePage",

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
