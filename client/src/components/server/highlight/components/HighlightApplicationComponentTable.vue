<template>
  <v-container fluid class="mx-0 my-2 pa-0">
    <v-data-table
        class="elevation-2"
        :headers="headers"
        :items="displayedComponents"
        :loading="loadingComponents"
        sort-by="url"
        style="width: 100%;"
    >
      <template v-slot:top>
        <v-toolbar
            flat
            class="pa-2 py-5 mb-10"
        >
          <v-container class="mt-10 pt-5">
            <v-row>
              <v-toolbar-title class="pl-4"><h3><strong>Components discovered</strong></h3></v-toolbar-title>

            </v-row>
            <v-row class="px-1">
              <v-col cols="3">
                <v-text-field
                    v-model="searchByName"
                    class="mr-2"
                    dense
                    label="Search by name"
                    outlined
                ></v-text-field>
              </v-col>

              <v-col cols="3">
                <v-combobox
                    v-model="selectedTechnology"
                    :items="technologySelection"
                    class="mr-2"
                    dense
                    label="Technologies"
                    multiple
                    outlined
                ></v-combobox>
              </v-col>
              <v-col cols="3">
                <v-combobox
                    v-model="selectedRepository"
                    :items="repositorySelection"
                    class=" mr-2"
                    dense
                    label="Repositories"
                    multiple
                    outlined
                ></v-combobox>
              </v-col>
              <v-col class="d-flex flex-row" cols="3">
                <v-btn :loading="loadingComponents" class="white--text pt-0" color="blue" v-on:click="search">
                  Search
                </v-btn>
                <v-btn :loading="loadingComponents" class="white--text pt-0" color="green"
                       v-on:click="loadComponents">Refresh
                </v-btn>
              </v-col>


            </v-row>
          </v-container>

        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
        >
          mdi-pencil
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
            color="primary"
            @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";

import Logger from "@/utils/Logger";
import PackageController from "@/controllers/packages/PackageController";
import HighlightComponent from "@/interface/highlight/HighlightComponent";
import HighlightApplication from "@/interface/highlight/HighlightApplication";
import HighlightInstanceComponentController from "@/controllers/highlight/HighlightInstanceComponentController";
import HighlightComponentController from "@/controllers/highlight/HighlightComponentController";
import PackageCharacteristicsController from "@/controllers/option/PackageCharacteristicsController";

export default Vue.extend({
  name: "HighlightApplicationComponentTable",

  props: ["portfolio", "application"],

  components: {
    // Components to include
  },

  mounted() {
    // On mounted
    this.hlComponents = [] as HighlightComponent[];
    this.highlightInstance = this.portfolio as HighlightCredentials
    this.highlightApplication = this.application as HighlightApplication
    this.initialize()
  },

  watch: {
    portfolio: function() {
      this.highlightInstance = this.portfolio as HighlightCredentials
    },

    application: function() {
      this.initialize();
    },

    hlComponents: function() {
      this.displayedComponents = this.hlComponents;
      this.selectedRepository = "";
      this.selectedTechnology = [];
      this.searchByName = "";
    }
  },

  computed: {
    // Pass
  },

  methods: {
    initialize () {
      this.highlightInstance = this.portfolio as HighlightCredentials
      this.highlightApplication = this.application as HighlightApplication

      this.refresh();
      this.refreshSelectData();
      this.loadComponents();
    },

    async refresh() {
      this.hlComponents = [] as HighlightComponent[];
      this.selectedRepository = "";
      this.selectedTechnology = [];
      this.searchByName = "";

      await this.loadComponents();
      await this.search();
    },

    /**
     * Search using the filter
     */
    async search() {
      this.loadingComponents = true;
      this.displayedComponents = [] as HighlightComponent[];

      try {
        this.displayedComponents = this.hlComponents.filter(x => {
          return x.name.toLowerCase().includes(this.searchByName)
        })
      } catch (e) {
        Logger.error("Failed to get Highlight components of this instance",
            "Failed to get the list of Highlight components with filters due to a client error.",
            e,
            "Highlight instance hlComponents table");
        this.errors = "Failed to get the list of hlComponents for this instance due to a client error.";
        this.hlComponents = [];
      } finally {
        this.loadingComponents = false;
      }
    },

    /**
     * Refresh the data of the combo box
     */
    async refreshSelectData() {
      try {
        this.loadingOptions = true;

        const responseRepo = await PackageController.getRepositories();
        if(responseRepo.isError()) throw new Error(responseRepo.getErrorsAsString());
        this.repositorySelection = responseRepo.getData();

        this.technologySelection = await PackageCharacteristicsController.getTechnologiesList();

      } catch (e) {
        Logger.error("Failed to get list of options of this instance",
            "Failed to get the list of options instance due to a client error.",
            e,
            "Highlight hlComponents table");
        this.errors = "Failed to get the list of hlComponents due to a client error.";
      } finally {
        this.loadingOptions = false;
      }
    },

    // Populate with methods
    async loadComponents() {
      if(this.loadingComponents) return;

      try {
        this.loadingComponents = true;
        this.hlComponents = [] as HighlightComponent[];

        const response = await HighlightComponentController.getComponentsByApplication (this.highlightInstance, this.highlightApplication);
        if(response.isError()) {
          this.errors = response.getErrorsAsString()
          this.hlComponents = [];
        } else {
          this.errors = "";
          this.hlComponents = response.getData();
        }
      } catch (e) {
        Logger.error("Failed to get Highlight component of this application",
            "Failed to get the list of Highlight application due to a client error.",
            e,
            "Highlight application table");
        this.errors = "Failed to get the list of hlComponents for this instance due to a client error.";
        this.hlComponents = [];
      } finally {
        this.loadingComponents = false;
      }
    }
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      {text: 'Version', value: 'version'},
      {text: 'Technology', value: 'technology'},
      {text: 'Description', value: 'description'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],

    searchByName: "" as string,

    selectedTechnology: [] as string[],
    selectedRepository: "" as string,
    repositorySelection: [] as string[],
    technologySelection: [] as string[],

    hlComponents: [] as HighlightComponent[],
    displayedComponents: [] as HighlightComponent[],
    editedItem: {} as HighlightComponent,

    highlightInstance: {} as HighlightCredentials,
    highlightApplication: {} as HighlightApplication,

    loadingDelete: false,
    loadingComponents: false,
    loadingOptions: false,

    errors: "" as string,
  }),
})
</script>

<style scoped>

</style>