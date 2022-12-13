<template>
  <v-card min-width="100%" min-height="200px"
          elevation="2"
  >
    <v-card-text>
      <v-container fluid>
        <v-row>

        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";

export default Vue.extend({
  name: "HighlightPortfolioPackagesCard",
  props: ['instance'],

  components: {
    // Components to include
  },

  mounted() {
    // On mounted
    this.editedItem = this.instance as HighlightCredentials
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
    loadComponents() {

    }
  },

  data: () => ({
    // Populate with Data
    editedItem: {} as HighlightCredentials,
  }),
});
</script>

<style scoped>

</style>