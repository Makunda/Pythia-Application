<template>
  <v-container fluid class="mx-0 my-2 pa-0">
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
          <v-toolbar-title><h3 class="mx-7"><strong>Highlight Instances</strong></h3></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
              v-model="filters.name"
              label="Search by name"
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-btn color="green" class="white--text ma-2 pt-0" v-on:click="loadPackages" :loading="loadingPackages == true">Refresh</v-btn>
          <HighlightInstanceAddModal v-on:close="this.loadPackages"/>

        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <HighlightDeleteModal :highlightCredentials="item" />
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
    this.initialize()
    this.highlightInstance = this.instance as HighlightCredentials
  },

  computed: {
    // Pass
  },

  methods: {
    initialize () {
      this.packages = [];
      this.loadPackages();
    },

    // Populate with methods
    async loadPackages() {
      if(this.loadingPackages) return;

      this.loadingPackages = true;
      try {
        const response = await PackageController.getAllPackages(this.filters);
        console.log("Response", response)

        if(response.isError()) {
          this.errors = response.getErrorsAsString()
        } else {
          this.packages = response.getData();
          this.errors = "";
        }
      } catch (e) {
        Logger.error("Failed to get Highlight packages of this instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight Portoflio Table");
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
    packages: [] as Package[],
    editedItem: {} as Package,
    highlightInstance: {} as HighlightCredentials,

    loadingDelete: false,
    loadingPackages: false,

    filters: {
      name: ""
    } as any,

    errors: "" as string,
  }),
})
</script>

<style scoped>

</style>