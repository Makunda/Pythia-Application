<template>
  <v-container fluid class="mx-0 my-2 pa-0">
    <v-data-table
        style="width: 100%"
        :headers="headers"
        :items="hlComponents"
        :loading="loadingComponents"
        sort-by="url"
        class="elevation-2 "
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-toolbar-title><h3 class="mx-7"><strong>Packages discovered</strong></h3></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
              class="mt-7 mr-2"
              dense
              outlined
              v-model="searchByName"
              label="Search by name"
          ></v-text-field>

          <v-combobox
              v-model="selectedTechnology"
              class="mt-7 mr-2"
              :items="technologySelection"
              label="Technologies"
              multiple
              outlined
              dense
          ></v-combobox>

          <v-combobox
              v-model="selectedRepository"
              class="mt-7 mr-2"
              :items="repositorySelection"
              label="Repositories"
              multiple
              outlined
              dense
          ></v-combobox>
          <v-btn color="blue" class="white--text ma-2 pt-0" v-on:click="search" :loading="loadingComponents === true">Search</v-btn>
          <v-btn color="green" class="white--text ma-2 pt-0" v-on:click="loadPackages" :loading="loadingComponents === true">Refresh</v-btn>

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

export default Vue.extend({
  name: "HighlightPackageTable",

  props: ["instance"],

  components: {
    // Components to include
  },

  mounted() {
    // On mounted
    this.hlComponents = [] as HighlightComponent[];
    this.initialize()
    this.highlightInstance = this.instance as HighlightCredentials
  },

  computed: {
    // Pass
  },

  methods: {
    initialize () {
      this.refreshSelectData();
      this.loadComponents();
    },

    refresh() {
      this.hlComponents = [] as HighlightComponent[];
      this.selectedRepository = "";
      this.selectedTechnology = "";
      this.searchByName = "";

      this.loadComponents();
    },

    /**
     * Search using the filter
     */
    async search() {
      if(this.loadingComponents) return;
      this.loadingComponents = true;

      this.hlComponents = [] as HighlightComponent[];

      try {
        const response = await PackageController.getAllPackages({
          name: this.searchByName,
          repository: this.selectedRepository,
          technology: this.selectedTechnology
        });

        if(response.isError()) {
          this.errors = response.getErrorsAsString()
        } else {
          this.hlComponents = response.getData() as HighlightComponent[];
          this.errors = "";
        }
      } catch (e) {
        Logger.error("Failed to get Highlight packages of this instance",
            "Failed to get the list of Highlight packages with filters due to a client error.",
            e,
            "Highlight packages table");
        this.errors = "Failed to get the list of Package for this instance due to a client error.";
        this.hlComponents = [];
      } finally {
        this.loadingComponents = false;
      }
    },

    /**
     * Refresh the data of the combo box
     */
    async refreshSelectData() {
      this.loadingOptions = true;

      try {
        const responseRepo = await PackageController.getRepositories();
        if(responseRepo.isError()) throw new Error(responseRepo.getErrorsAsString());
        this.repositorySelection = responseRepo.getData();

        const responseTech = await PackageController.getTechnologies();
        if(responseTech.isError()) throw new Error(responseTech.getErrorsAsString());
        this.technologySelection = responseTech.getData();

      } catch (e) {
        Logger.error("Failed to get list of options of this instance",
            "Failed to get the list of options instance due to a client error.",
            e,
            "Highlight package table");
        this.errors = "Failed to get the list of package due to a client error.";
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

        const response = await PackageController.getAllPackages({});
        console.log("response", response)
        if(response.isError()) {
          this.errors = response.getErrorsAsString()
          this.hlComponents = [];
        } else {
          this.errors = "";
          this.hlComponents = response.getData() as HighlightComponent[];
        }
      } catch (e) {
        Logger.error("Failed to get Highlight packages of this instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight portfolio table");
        this.errors = "Failed to get the list of Package for this instance due to a client error.";
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
      {text: 'URL', value: 'url'},
      {text: 'Assessment', value: 'compatibility'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],

    searchByName: "" as String,

    selectedTechnology: "" as String,
    selectedRepository: "" as String,
    repositorySelection: [] as String[],
    technologySelection: [] as String[],

    hlComponents: [] as HighlightComponent[],
    editedItem: {} as HighlightComponent,
    highlightInstance: {} as HighlightCredentials,

    loadingDelete: false,
    loadingComponents: false,
    loadingOptions: false,

    errors: "" as string,
  }),
})
</script>

<style scoped>

</style>