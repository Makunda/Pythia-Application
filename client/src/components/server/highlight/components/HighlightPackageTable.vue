<template>
  <v-container fluid class="mx-0 my-2 pa-0">
    <p>instance: {{instance}}</p>
    <p>technologySelection: {{technologySelection}}</p>
    <p>repositorySelection: {{repositorySelection}}</p>
    <p>packages: {{packages}}</p>
    <p>loadingPackages: {{loadingPackages}}</p>

    <v-data-table
        style="width: 100%"
        :headers="headers"
        :items="packages"
        :loading="loadingPackages"
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
          <v-btn color="blue" class="white--text ma-2 pt-0" v-on:click="search" :loading="loadingPackages === true">Search</v-btn>
          <v-btn color="green" class="white--text ma-2 pt-0" v-on:click="loadPackages" :loading="loadingPackages === true">Refresh</v-btn>

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
import {Package} from "@/interface/package/Package";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import Logger from "@/utils/Logger";
import PackageController from "@/controllers/packages/PackageController";

export default Vue.extend({
  name: "HighlightPackageTable",

  props: ["instance"],

  components: {
    // Components to include
  },

  mounted() {
    // On mounted
    this.packages = [];
    this.initialize()
    this.highlightInstance = this.instance as HighlightCredentials
  },

  computed: {
    // Pass
  },

  methods: {
    initialize () {
      this.refreshSelectData();
      this.loadPackages();
    },

    refresh() {
      this.packages = [] as Package[];
      this.selectedRepository = "";
      this.selectedTechnology = "";
      this.searchByName = "";

      this.loadPackages();
    },

    /**
     * Search using the filter
     */
    async search() {
      if(this.loadingPackages) return;
      this.loadingPackages = true;

      this.packages = [] as Package[];

      try {
        const response = await PackageController.getAllPackages({
          name: this.searchByName,
          repository: this.selectedRepository,
          technology: this.selectedTechnology
        });

        if(response.isError()) {
          this.errors = response.getErrorsAsString()
        } else {
          this.packages = response.getData() as Package[];
          this.errors = "";
        }
      } catch (e) {
        Logger.error("Failed to get Highlight packages of this instance",
            "Failed to get the list of Highlight packages with filters due to a client error.",
            e,
            "Highlight packages table");
        this.errors = "Failed to get the list of Package for this instance due to a client error.";
        this.packages = [];
      } finally {
        this.loadingPackages = false;
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
    async loadPackages() {
      if(this.loadingPackages) return;

      try {
        this.loadingPackages = true;
        this.packages = [] as Package[];

        const response = await PackageController.getAllPackages({});
        console.log("response", response)
        if(response.isError()) {
          this.errors = response.getErrorsAsString()
          this.packages = [];
        } else {
          this.errors = "";
          this.packages = response.getData() as Package[];
        }
      } catch (e) {
        Logger.error("Failed to get Highlight packages of this instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight portfolio table");
        this.errors = "Failed to get the list of Package for this instance due to a client error.";
        this.packages = [];
      } finally {
        this.loadingPackages = false;
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
      {text: 'Repository', value: 'repository'},
      {text: 'Technology', value: 'technology'},
      {text: 'Assessment', value: 'compatibility'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],

    searchByName: "" as String,

    selectedTechnology: "" as String,
    selectedRepository: "" as String,
    repositorySelection: [] as String[],
    technologySelection: [] as String[],

    packages: [] as Package[],
    editedItem: {} as Package,
    highlightInstance: {} as HighlightCredentials,

    loadingDelete: false,
    loadingPackages: false,
    loadingOptions: false,

    errors: "" as string,
  }),
})
</script>

<style scoped>

</style>