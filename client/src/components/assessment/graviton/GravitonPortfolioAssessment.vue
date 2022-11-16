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
      <v-container >
        <!-- Selection of the portfolio to assess  -->
        <v-row>
          <v-card width="100%" class="my-4">
            <v-card-title>
              <v-container fluid>
                <v-row><v-col cols="4"><h3><strong>Select a portfolio to assess:</strong></h3></v-col>
                  <v-col cols="8"><v-autocomplete
                      v-model="selectedItem"
                      :items="portfolioList"
                      :loading="loadingPortfolios"
                      item-text="officialName"
                      dense
                      label="Portfolio name"
                  ></v-autocomplete></v-col>
                </v-row>
              </v-container>
            </v-card-title>
          </v-card>
        </v-row>

        <!-- Portfolio details  -->
        <v-row>
          <HighlightPortfolioCard v-bind:instance="selectedItem"></HighlightPortfolioCard>
        </v-row>
        <!-- Loading bar with number of packages  -->

        <!-- List packet and save status-->
        <v-row>
          <HighlightPackageTable class="my-4"></HighlightPackageTable>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import HighlightPortfolioCard from "@/components/server/highlight/components/HighlightPortfolioCard.vue";
// Basics
import flash, { FlashType } from "@/modules/flash/Flash";
import HighlightPackageTable from "@/components/server/highlight/components/HighlightPackageTable.vue";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import Logger from "@/utils/Logger";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";

export default Vue.extend({
  name: "GravitonPortfolioAssessment",

  components: {
    // Components to include
    HighlightPortfolioCard,
    HighlightPackageTable
  },

  mounted() {
    // On mounted
    this.portfolioList = [];
    this.loadPortfolios();
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
    async loadPortfolios() {
      if(this.loadingPortfolios) return this.loadingPortfolios;
      this.loadingPortfolios = false;
      this.errors = "";

      try {
        const response = await HighlightInstanceController.getAllInstance();
        console.log("Response", response);

        if(response.isError()) {
          this.errors = response.getErrorsAsString()
        } else {
          this.portfolioList = response.getData();
          this.errors = "";
        }
      } catch (e) {
        Logger.error("Failed to get Highlight instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight Portoflio Table");
        this.errors = "Failed to get the list of Highlight instance due to a client error.";
        this.portfolioList = [];
      } finally {
        this.loadingPortfolios = false;
      }
    }
  },

  data: () => ({
    errors: "" as string,
    loadingPortfolios: false,

    selectedItem: {} as HighlightCredentials,
    // Populate with Data
    portfolioList: [] as HighlightCredentials[],
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
