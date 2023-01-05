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
      <v-container>
        <v-row>
          <v-card class="my-4" width="100%">
            <v-card-title>
              <v-container fluid>
                <v-row>
                  <v-col cols="4"><h3><strong>Select a portfolio to assess:</strong></h3></v-col>
                  <v-col cols="8">
                    <v-autocomplete
                        v-model="selectedPortfolio"
                        :items="portfolioList"
                        :loading="loadingPortfolios"
                        dense
                        item-text="officialName"
                        label="Portfolio name"
                        return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-title>
          </v-card>
        </v-row>

        <!--    Select application    -->
        <v-row v-if="selectedPortfolio.officialName">
          <v-card class="my-4" width="100%">
            <v-card-title>
              <v-container fluid>
                <v-row>
                  <v-col cols="4"><h3><strong>Select an application to assess:</strong></h3></v-col>
                  <v-col cols="8">
                    <v-autocomplete
                        v-model="selectedApplication"
                        :items="applicationList"
                        :loading="loadingApplications"
                        dense
                        item-text="name"
                        label="Application name"
                        return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-title>
          </v-card>
        </v-row>

        <!--   Visualize the list of components     -->
        <v-row v-if="selectedApplication._id">
          <HighlightApplicationComponentTable :portfolio="selectedPortfolio" :application="selectedApplication"></HighlightApplicationComponentTable>
        </v-row>

        <!--   Application assessment     -->
        <v-row v-if="selectedApplication._id">
          <ApplicationAssessmentStatistics :portfolio="selectedPortfolio" :application="selectedApplication"></ApplicationAssessmentStatistics>
        </v-row>

        <v-row v-if="selectedApplication._id">
          <ApplicationScriptAssessment :portfolio="selectedPortfolio" :application="selectedApplication"></ApplicationScriptAssessment>
        </v-row>

      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import Logger from "@/utils/Logger";
import HighlightApplication from "@/interface/highlight/HighlightApplication";
import HighlightApplicationController from "@/controllers/highlight/HighlightApplicationController";
import HighlightApplicationComponentTable
  from "@/components/server/highlight/components/HighlightApplicationComponentTable.vue";
import ApplicationAssessmentStatistics from "@/components/assessment/statistics/ApplicationAssessmentStatistics.vue";
import ApplicationScriptAssessment from "@/components/assessment/script/ApplicationScriptAssessment.vue";

export default Vue.extend ({
  name: "GravitonApplicationAssessment",

  components: {
    // Components to include
    HighlightApplicationComponentTable,
    ApplicationAssessmentStatistics,
    ApplicationScriptAssessment
  },

  mounted() {
    // On mounted
    this.selectedPortfolio = {} as HighlightCredentials;
    this.selectedApplication = {} as HighlightApplication;
    this.portfolioList = [];
    this.loadPortfolios ();
  },

  computed: {
    // Implement
  },

  watch: {
    selectedPortfolio: async function() {
      if(!this.selectedPortfolio || !this.selectedPortfolio._id) return;
      await this.loadApplications();
    }
  },

  methods: {
    // Populate with methods
    // Populate with methods
    async loadPortfolios() {
      if (this.loadingPortfolios) return;
      this.loadingPortfolios = true;
      this.portfolioErrors = "";

      try {
        const response = await HighlightInstanceController.getAllInstance ();

        if (response.isError ()) {
          this.portfolioErrors = response.getErrorsAsString ()
        } else {
          this.portfolioList = response.getData ();
          this.portfolioErrors = "";
        }
      } catch (e) {
        Logger.error ("Failed to get Highlight instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight Portoflio Table");
        this.portfolioErrors = "Failed to get the list of Highlight instance due to a client error.";
        this.portfolioList = [];
      } finally {
        this.loadingPortfolios = false;
      }
    },

    async loadApplications() {
      if(!this.selectedPortfolio._id) return;
      this.loadingApplications = true;
      this.applicationErrors = "";

      try {
        const response = await HighlightApplicationController.getApplicationByInstance (this.selectedPortfolio);

        if (response.isError ()) {
          this.applicationErrors = response.getErrorsAsString ()
        } else {
          this.applicationList = response.getData ();
          this.applicationErrors = "";
        }
      } catch (e) {
        Logger.error ("Failed to get Highlight applications",
            "Failed to get the list of Highlight application due to a client error.",
            e,
            "Graviton Application Assessment");
        this.applicationErrors = "Failed to get the list of Highlight instance due to a client error.";
        this.applicationList = [];
      } finally {
        this.loadingApplications = false;
      }
    }
  },

  data: () => ({
    // Portfolio
    loadingPortfolios: false,
    selectedPortfolio: {} as HighlightCredentials,
    portfolioList: [] as HighlightCredentials[],
    portfolioErrors: "" as string,

    // Applications
    loadingApplications: false,
    selectedApplication: {} as HighlightApplication,
    applicationList: [] as HighlightApplication[],
    applicationErrors: "" as string,



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
