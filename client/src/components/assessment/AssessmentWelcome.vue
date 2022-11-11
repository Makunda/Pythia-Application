<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import flash, { FlashType } from "@/modules/flash/Flash";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ImagingFrameworkTable from "./components/ImagingFrameworkTable.vue";

export default Vue.extend({
  name: "AssessmentWelcome",

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
