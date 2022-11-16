<template>
  <v-card min-width="100%" min-height="200px"
          elevation="2"
  >
    <v-card-title>
      <h3 class="mx-3"><strong>Portfolio name:</strong></h3>
      <h3 class="font-weight-light">{{ editedItem.officialName || "Unknown" }}</h3>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row >
          <v-col cols="4"><v-card class="d-flex align-center pl-4" height="100px"
                                  elevation="2"
          >
            <h1 class="mr-2"><strong>10</strong></h1><h3></h3>
            <h1 class="mr-2 font-weight-light"><strong>Applications</strong></h1>
          </v-card></v-col>
          <v-col cols="4"><v-card class="d-flex align-center pl-4" height="100px"
                                  elevation="2"
          >
            <h1 class="mr-2"><strong>10,000</strong></h1><h3></h3>
            <h1 class="mr-2 font-weight-light"><strong>Components</strong></h1>
          </v-card></v-col>
          <v-col cols="4"><v-card class="d-flex align-center pl-4" height="100px"
                                  elevation="2"
          >
            <h1 class="mr-2"><strong>3.9m</strong></h1><h3></h3>
            <h1 class="mr-2 font-weight-light"><strong>Line of code</strong></h1>
          </v-card></v-col>
        </v-row>
        <v-row>
          <v-col cols="4"><v-card color="#051e34" dark class="d-flex align-center pl-4" height="50px"
                                  elevation="2"
          >
            <h4 class="mr-2"><strong>Portfolio URL: </strong></h4><h3></h3>
            <h4 class="mr-2 font-weight-light"><strong>{{ editedItem.url || "Unknown"  }}</strong></h4>
          </v-card></v-col>
          <v-col cols="4"><v-card color="#051e34" dark class="d-flex align-center pl-4" height="50px"
                                  elevation="2"
          >
            <h4 class="mr-2"><strong>Official name: </strong></h4><h3></h3>
            <h4 class="mr-2 font-weight-light"><strong> {{ `${editedItem.officialName } - ${editedItem.domainId}` || "Unknown"  }}</strong></h4>
          </v-card></v-col>
          <v-col cols="4"><v-card color="#051e34" dark class="d-flex align-center pl-4" height="50px"
                                  elevation="2"
          >
            <h4 class="mr-2"><strong>Partner: </strong></h4><h3></h3>
            <h4 class="mr-2 font-weight-light"><strong>{{ editedItem.partnerName || "Unknown"  }}</strong></h4>
          </v-card></v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";

export default Vue.extend({
  name: "HighlightPortfolioCard",
  props: ['instance'],

  components: {
    // Components to include
  },

  watch: {
    instance: function (val) {
      this.editedItem = this.instance as HighlightCredentials;
    },
  },

  mounted() {
    // On mounted
    this.editedItem = this.instance as HighlightCredentials;
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
  },

  data: () => ({
    // Populate with Data
    editedItem: {} as HighlightCredentials,
  }),
});
</script>

<style scoped>

</style>