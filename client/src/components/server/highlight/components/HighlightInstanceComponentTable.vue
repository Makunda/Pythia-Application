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
          <v-toolbar-title><h3 class="mx-7"><strong>Components discovered</strong></h3></v-toolbar-title>
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
          <v-btn color="green" class="white--text ma-2 pt-0" v-on:click="loadComponents" :loading="loadingComponents === true">Refresh</v-btn>

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
import HighlightComponentController from "@/controllers/highlight/HighlightComponentController";

export default Vue.extend({
  name: "HighlightInstanceComponentTable",

  props: ["instance"],

  components: {
    // Components to include
  },

  mounted() {
    // On mounted
    this.hlComponents = [] as HighlightComponent[];
    this.highlightInstance = this.instance as HighlightCredentials
    this.initialize()
  },

  computed: {
    // Pass
  },

  methods: {
    initialize () {
      this.refresh();
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
      this.loadingComponents = true;
      this.hlComponents = [] as HighlightComponent[];

      try {
        const response = await HighlightComponentController.getComponentsByInstance(this.instance);

        if(response.isError()) {
          this.errors = response.getErrorsAsString()
        } else {
          this.hlComponents = response.getData() as HighlightComponent[];
          this.errors = "";
        }
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

        const responseTech = await PackageController.getTechnologies();
        if(responseTech.isError()) throw new Error(responseTech.getErrorsAsString());
        this.technologySelection = responseTech.getData();

      } catch (e) {
        Logger.error("Failed to get list of options of this instance",
            "Failed to get the list of options instance due to a client error.",
            e,
            "Highlight hlComponentss table");
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

        const response = await HighlightComponentController.getComponentsByInstance(this.instance);
        console.log("Response", response);
        if(response.isError()) {
          this.errors = response.getErrorsAsString()
          this.hlComponents = [];
        } else {
          this.errors = "";
          this.hlComponents = response.getData();
        }
      } catch (e) {
        Logger.error("Failed to get Highlight hlComponents of this instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight componentss table");
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
      {text: 'Repository', value: 'repository'},
      {text: 'Technology', value: 'technologies'},
      {text: 'Assessment', value: 'compatibility'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],

    searchByName: "" as string,

    selectedTechnology: "" as string,
    selectedRepository: "" as string,
    repositorySelection: [] as string[],
    technologySelection: [] as string[],

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