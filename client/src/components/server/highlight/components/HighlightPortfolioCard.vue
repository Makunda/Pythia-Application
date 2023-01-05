<template>
  <v-card min-width="100%" min-height="200px"
          elevation="2"
  >
    <v-card-title>
      <h3 class="mx-3"><strong>Portfolio name:</strong></h3>
      <h3 class="font-weight-light">{{ editedItem.officialName || "Unknown" }}</h3>
      <v-spacer></v-spacer>
      <!--  Status button    -->
      <span class="d-flex flex-column align-center">
        <v-btn
            class="ma-2"
            :loading="loadingPortfolio"
            :color="portfolioAnalyzed ? 'success' : 'warning'"
            @click="refreshStatus"
        >
          Status: {{ portfolioAnalyzed ? 'Analyzed' : 'Not analyzed' }}
          <template v-slot:loader>
            <span>Loading status...</span>
          </template>
        </v-btn>
        <span class="font-weight-light"><v-icon>mdi-cached</v-icon> Status automatically refreshed </span>
      </span>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row >
          <v-col cols="4"><v-card :loading="loadingNumApplications" class="d-flex align-center pl-4" height="100px"
                                  elevation="2"
          >
            <h1 class="mr-2"><strong>{{ numApplications || "N/A" }}</strong></h1><h3></h3>
            <h1 class="mr-2 font-weight-light"><strong>Applications</strong></h1>
          </v-card></v-col>
          <v-col cols="4"><v-card :loading="loadingNumComponents" class="d-flex align-center pl-4" height="100px"
                                  elevation="2"
          >
            <h1 class="mr-2"><strong>{{ numComponents || "N/A" }}</strong></h1><h3></h3>
            <h1 class="mr-2 font-weight-light"><strong>Components</strong></h1>
          </v-card></v-col>
          <v-col cols="4"><v-card :loading="loadingNumLoc" class="d-flex align-center pl-4" height="100px"
                                  elevation="2"
          >
            <h1 class="mr-2"><strong>{{ numLoc || "N/A" }}</strong></h1><h3></h3>
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

        <v-row class="d-flex justify-center">
          <v-alert
              min-width="99%"
              v-if="errorNumApplication || errorNumComponents || errorNumLoc"
              density="compact"
              type="error"
              variant="outlined"
          >
            <strong>Error: </strong>
            {{ errorNumApplication ? `${errorNumApplication}. ` : ''}}
            {{ errorNumComponents ? `${errorNumComponents}. ` : ''}}
            {{ errorNumLoc ? `${errorNumLoc}. ` : ''}}
          </v-alert>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import Logger from "@/utils/Logger";
import HighlightApplicationController from "@/controllers/highlight/HighlightApplicationController";
import HighlightInstanceComponentController from "@/controllers/highlight/HighlightInstanceComponentController";
import HighlightLineOfCodeController from "@/controllers/highlight/HighlightLineOfCodeController";

export default Vue.extend({
  name: "HighlightPortfolioCard",
  props: ['instance'],

  components: {
    // Components to include
  },

  watch: {
    instance: function (val) {
      this.editedItem = this.instance as HighlightCredentials;
      this.refresh ();
    },
  },

  mounted() {
    // On mounted
    this.editedItem = this.instance as HighlightCredentials;
    this.refresh();
  },

  computed: {
    // Implement
  },

  methods: {
    /**
     * Refresh all the promise
     */
    async refresh() {
      await Promise.all([this.getNumberApplication(), this.getNumberComponents(), this.getLineOfCode()])
    },

    // Populate with methods
    async refreshStatus() {
      if(this.loadingPortfolio || !this.editedItem || !this.editedItem._id ) return;
      this.loadingPortfolio = true;

      try {
        const response = await HighlightInstanceController.getInstanceById(this.editedItem._id)
      } catch (e) {

      }
    },

    async getNumberApplication() {
      if(this.loadingNumApplications) return;
      this.loadingNumApplications = true;
      this.errorNumApplication = "";

      try {
        const response = await HighlightApplicationController.getApplicationCountByInstance(this.editedItem);

        if(response.isError()) {
          this.errorNumApplication = response.getErrorsAsString()
        } else {
          this.numApplications = response.getData();
          this.errorNumApplication = "";
        }
      } catch (e) {
        Logger.error("Failed to number of application  count.",
            "Failed to get the count of the application due to a client error.",
            e,
            "Highlight Portfolio Card");
        this.errorNumApplication = "Failed to get the count of the application due to a client error.";
      } finally {
        this.loadingNumApplications = false;
      }
    },

    /**
     * Get the line of code number
     */
    async getLineOfCode() {
      if(this.loadingNumLoc) return;
      this.loadingNumLoc = true;
      this.errorNumLoc = "";

      try {
        const response = await HighlightLineOfCodeController.getLineOfCodeByInstance(this.editedItem);

        if(response.isError()) {
          this.errorNumLoc = response.getErrorsAsString()
        } else {
          this.numLoc = response.getData() || 0;
          this.errorNumLoc = "";
        }
      } catch (e) {
        Logger.error("Failed to get line of code count.",
            "Failed to get line of code due to a client error.",
            e,
            "Highlight Portfolio Card");
        this.errorNumLoc = "Failed to get the line of code number due to a client error.";
      } finally {
        this.loadingNumLoc = false;
      }
    },

    async getNumberComponents() {
      if(this.loadingNumComponents) return;
      this.loadingNumComponents = true;
      this.errorNumComponents = "";

      try {
        const response = await HighlightInstanceComponentController.getComponentCountByInstance (this.editedItem);

        if(response.isError()) {
          this.errorNumComponents = response.getErrorsAsString()
        } else {
          this.numComponents = response.getData();
          this.errorNumComponents = "";
        }
      } catch (e) {
        Logger.error("Failed to get component count.",
            "Failed to get the count of the component due to a client error.",
            e,
            "Highlight Portfolio Card");
        this.errorNumComponents = "Failed to get the count of component due to a client error.";
      } finally {
        this.loadingNumComponents = false;
      }
    }
  },

  data: () => ({
    // Populate with Data
    editedItem: {} as HighlightCredentials,

    loadingPortfolio: false,
    portfolioAnalyzed: false,

    numApplications: "N/A" as any,
    numComponents: "N/A" as any,
    numLoc: 0 as number,

    loadingNumApplications: false,
    loadingNumComponents: false,
    loadingNumLoc: false,

    errorNumApplication: "",
    errorNumComponents: "",
    errorNumLoc: ""
  }),
});
</script>

<style scoped>

</style>