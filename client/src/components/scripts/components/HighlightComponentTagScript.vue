<template>
  <v-container class="pa-0" fluid style="overflow-x: hidden">
    <v-row class="pa-0 ma-0">
      <v-parallax
          height="250"
          src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
          style="width: 100%"
      ></v-parallax>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-container class="mb-12">
        <!-- Component tag generation -->
        <v-row class="mt-2">
          <h1>Component Tag generation</h1>
        </v-row>
      </v-container>

      <v-container style="border-left: solid 4px #c40000; padding-left: 30px;
      padding-top: 0;
      padding-bottom: 0;">

        <v-row class="mt-2">
          <h1>Script Parameters</h1>
        </v-row>

        <v-row class="mt-2">
          <h3>Select an existing application</h3>
        </v-row>

        <v-row>
          <v-col class="pr-1" cols="6">
            <v-autocomplete
                v-model="selectedPortfolio"
                :items="portfolioList"
                :loading="loadingPortfolios"
                clearable
                item-text="officialName"
                label="Portfolio"
                return-object
                solo
            ></v-autocomplete>
          </v-col>
          <v-col class="pl-1" cols="6">
            <v-autocomplete
                v-model="applicationName"
                :disabled="applicationList.length === 0"
                :items="applicationList"
                :loading="loadingApplication"
                clearable
                item-text="name"
                label="Application"
                solo
            ></v-autocomplete>
          </v-col>
        </v-row>

        <!--   Enter the name of the application manually     -->
        <v-row class="mt-2">
          <h3>Or enter the name of the application</h3>
        </v-row>

        <v-row>
          <v-col class="pr-1" cols="12">
            <v-text-field
                v-model="applicationName"
                label="Application Name"
                solo
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <v-container style="border-left: solid 4px #c40000; ;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 30px;
      margin-top: 10px">
        <v-row class="mt-2">
          <h3>Enter the tag to apply:</h3>
        </v-row>
        <v-row>
          <v-col class="pr-1" cols="12">
            <v-text-field
                v-model="tag"
                class="my-auto"
                label="Tag to apply"
                solo
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <!--  Components parameters    -->
      <v-container>
        <v-row class="mt-2 d-flex flex-column">
          <h1>Component selection</h1>
          <h3>Define the criteria of the component selection</h3>
        </v-row>

        <v-row>
          <v-col class="d-flex flex-column" cols="6">
            <p class="red--text">{{ loadingTechnologiesError }}</p>
            <v-autocomplete
                v-model="technologyFilter"
                :items="technologyFilterChoice"
                :loading="loadingTechnologies"
                chips
                dense
                label="Filter by technology"
                multiple
                outlined
                small-chips
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <p class="red--text">{{ loadingCveRiskError }}</p>
            <v-autocomplete
                v-model="cveFilter"
                :items="cveFilterChoice"
                chips
                dense
                label="Filter by CVE criticality"
                multiple
                outlined
                small-chips
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <p class="red--text">{{ loadingTechnologiesError }}</p>
            <v-autocomplete
                v-model="licenseFilter"
                :items="licenseFilterChoice"
                :loading="loadingLicensesError"
                chips
                dense
                label="Filter by license"
                multiple
                outlined
                small-chips
            ></v-autocomplete>
          </v-col>

          <v-col cols="6">
            <p></p>
            <v-text-field
                v-model="nameFilter"
                dense
                label="Filter by name"
                outlined
                placeholder="Search for name"
            ></v-text-field>
          </v-col>

        </v-row>

        <!--   Forecast     -->
        <v-row>
          <v-col class="d-flex flex-row" cols="12">
            <v-btn
                :disabled="componentForecastLoading"
                :loading="componentForecastLoading"
                class="mr-2"
                color="secondary"
                @click="this.forecastNumberComponent"
            >
              Forecast number of component
            </v-btn>
            <p class="mt-2"><strong>Components affected: </strong> {{ componentForecastNumber }}</p>

          </v-col>
          <v-col class="d-flex flex-row red--text" cols="12">
            <p>{{ componentForecastError }}</p>
          </v-col>

        </v-row>
      </v-container>

      <!--   Generation   -->
      <v-container>
        <v-row class="mt-2 d-flex flex-column">
          <h1>Generate the script</h1>
          <h3>Script generation for application: {{ applicationName }}</h3>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
                :disabled="loadingScript"
                :loading="loadingScript"
                class="ma-2"
                color="secondary"
                large
                @click="this.generateScript"
            >
              Generate Tagging Script
            </v-btn>
            <v-btn
                :disabled="!scriptContent"
                :loading="loadingScript"
                class="ma-2"
                color="green"
                large
                style="color: white"
                @click="this.copyScript"
            >
              Copy Script
            </v-btn>
          </v-col>

        </v-row>

        <!--   Error     -->
        <v-row v-if="errors">
          <v-col cols="12">
            <v-alert type="error">
              {{ errors }}
            </v-alert>
          </v-col>
        </v-row>

        <!-- Code Highlight for the cypher-->
        <v-row>
          <v-col cols="12">
            <highlight-code class="w-100" language="cypher">{{ scriptContent }}</highlight-code>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import Logger from "@/utils/Logger";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import HighlightApplicationController from "@/controllers/highlight/HighlightApplicationController";
import HighlightApplication from "@/interface/highlight/HighlightApplication";

import Vue from "vue";
import HighlightComponentScriptController from "@/controllers/scripts/HighlightComponentScriptController";
import HighlightComponentController from "@/controllers/highlight/HighlightComponentController";

const hljs = require ('highlightjs');
const hljsCypher = require ('highlightjs-cypher');

export default Vue.extend ({
  name: "HighlightComponentTagScript",

  mounted() {
    this.loadPortfolios ();

    // Get list of filter options
    this.getTechnologies ();
    this.getCVEsRisk ();
    this.getLicenses ();
  },


  watch: {
    selectedPortfolio: function () {
      if (this.selectedPortfolio && this.selectedPortfolio.officialName) {
        Logger.success ("Loading application",
            `Loading application for portfolio with name=${this.selectedApplication.officialName}`,
            "Highlight Component")
        this.loadApplications ().catch (e => {
          Logger.error (`Failed to load the application for portfolio with name=${this.selectedApplication.officialName}.`,
              e,
              "Highlight Component Tag");
        });
      }
    }
  },

  methods: {
    // Populate with methods
    async loadPortfolios() {
      this.loadingPortfolios = true;
      this.errors = "";

      try {
        const response = await HighlightInstanceController.getAllInstance ();
        if (response.isError ()) {
          this.errors = response.getErrorsAsString ()
        } else {
          this.portfolioList = response.getData ();
          this.errors = "";
        }
      } catch (e) {
        Logger.error ("Failed to get Highlight instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight portfolio Table");
        this.errors = "Failed to get the list of Highlight instance due to a client error.";
        this.portfolioList = [];
      } finally {
        this.loadingPortfolios = false;
      }
    },

    async forecastNumberComponent() {
      this.componentForecastLoading = true;
      this.componentForecastError = "";

      try {
        const response = await HighlightComponentController.countComponents ({
          name: this.nameFilter,
          technologies: this.technologyFilter,
          licenses: this.licenseFilter,
          cveRisk: this.cveFilter
        });

        if (response.isError ()) {
          this.componentForecastError = response.getErrorsAsString ()
        } else {
          console.log ("Forecast", response.getData ())
          this.componentForecastNumber = `${response.getData ()}`;
          this.componentForecastError = "";
        }
      } catch (e) {
        Logger.error ("Failed to get Highlight instance",
            "Failed to get the forecast due to a client error.",
            e,
            "Highlight portfolio Table");
        this.componentForecastError = "Failed to get the forecast due to a client error.";
      } finally {
        this.componentForecastLoading = false;
      }
    },

    /**
     * Copy the script content
     */
    async copyScript() {
      try {
        await navigator.clipboard.writeText (this.scriptContent);
        alert ('Script copied');
      } catch (e) {
        Logger.error ("Failed to copy the script", e, "Highlight Component Tag Script");
      }
    },

    /**
     * Get the list of the technologies for  the components
     */
    async getTechnologies() {
      this.loadingTechnologies = true;
      this.loadingTechnologiesError = "";

      try {
        const responseTech = await HighlightComponentController.getComponentTechnologyNames ();
        if (responseTech.isError ()) throw new Error (responseTech.getErrorsAsString ());
        this.technologyFilterChoice = responseTech.getData ();
      } catch (e) {
        Logger.error ("Failed to get the list of the technologies", e, "Highlight Component Tag Script");
        this.loadingTechnologiesError = "Failed to get the list of technologies";
      } finally {
        this.loadingTechnologies = false;
      }
    },

    /**
     * Get the list of the licenses for the components
     */
    async getLicenses() {
      this.loadingLicenses = true;
      this.loadingLicensesError = "";

      try {
        const responseTech = await HighlightComponentController.getComponentLicenseNames ();
        if (responseTech.isError ()) throw new Error (responseTech.getErrorsAsString ());
        this.licenseFilterChoice = responseTech.getData ();
      } catch (e) {
        Logger.error ("Failed to get the list of the licenses", e, "Highlight Component Tag Script");
        this.loadingLicensesError = "Failed to get the list of licenses";
      } finally {
        this.loadingLicenses = false;
      }
    },


    /**
     * Get the list of the licenses for the components
     */
    async getCVEsRisk() {
      this.loadingCveRisk = true;
      this.loadingCveRiskError = "";

      try {
        const responseTech = await HighlightComponentController.getComponentCVEsCriticalityNames ();
        if (responseTech.isError ()) throw new Error (responseTech.getErrorsAsString ());
        this.cveFilterChoice = responseTech.getData ();
      } catch (e) {
        Logger.error ("Failed to get the list of the licenses", e, "Highlight Component Tag Script");
        this.loadingCveRiskError = "Failed to get the list of CVEs";
      } finally {
        this.loadingCveRisk = false;
      }
    },


    /**
     * Load the applications
     */
    async loadApplications() {
      this.loadingApplication = true;
      this.errors = "";

      try {
        const response = await HighlightApplicationController.getApplicationByInstance (this.selectedPortfolio);

        if (response.isError ()) {
          this.errors = response.getErrorsAsString ()
        } else {
          this.applicationList = response.getData ();
          this.errors = "";
        }
      } catch (e) {
        Logger.error ("Failed to get the list of application per instance",
            "Failed to get the list of application per instance due to a client error.",
            e,
            "Highlight Component Tag Script");
        this.errors = "Failed to get the list of Highlight application per instance due to a client error.";
        this.portfolioList = [];
      } finally {
        this.loadingApplication = false;
      }
    },

    /**
     * Generate the script
     */
    async generateScript() {
      if (this.loadingScript) return;

      if (!this.applicationName) {
        this.errors = "You must specify an application.";
        this.loadingScript = false;
        return;
      }

      if (!this.tag) {
        this.errors = "You must specify a tag.";
        this.loadingScript = false;
        return;
      }

      try {
        this.loadingScript = true;
        this.scriptContent = await HighlightComponentScriptController.createScriptTag (this.applicationName, this.tag, {
          name: this.nameFilter,
          technologies: this.technologyFilter,
          licenses: this.licenseFilter,
          cveRisk: this.cveFilter
        });
        this.errors = "";
      } catch (e) {
        Logger.error (`Failed to generate the component tagging script`, e, `Highlight Component Tag Service`);
        this.errors = "Failed to generate the script due to a server error.";
        this.scriptContent = "Generation failed";
      } finally {
        this.loadingScript = false;
      }
    }
  },

  data: () => ({
    errors: "" as string,

    // Portfolios
    loadingPortfolios: false,
    selectedPortfolio: {} as HighlightCredentials,
    portfolioList: [] as HighlightCredentials[],

    // Applications
    loadingApplication: false,
    selectedApplication: {} as HighlightCredentials,
    applicationList: [] as HighlightApplication[],

    // Script
    loadingScript: false,

    // Information
    information: "" as string,

    // Filtering
    technologyFilter: [] as string[],
    technologyFilterChoice: [] as string[],
    loadingTechnologies: false,
    loadingTechnologiesError: "" as string,

    // Licenses
    licenseFilter: [] as string[],
    licenseFilterChoice: [] as string[],
    loadingLicenses: false,
    loadingLicensesError: "" as string,


    nameFilter: "" as string,
    dateFilter: "" as string,
    outdatedFilter: false,
    cveFilter: [] as string[],
    cveFilterChoice: [] as string[],
    loadingCveRisk: false,
    loadingCveRiskError: "" as string,

    // Forecast
    componentForecastNumber: "Not computed" as string,
    componentForecastLoading: false,
    componentForecastError: "" as string,

    // Param
    applicationName: "" as string,
    tag: "" as string,

    scriptContent: "Select the criteria, and press the button to generate the script"
  }),

})
</script>

<style scoped>
div.code {
  white-space: pre;
}
</style>