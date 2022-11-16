<template>
  <v-container>
    <v-data-table
        style="width: 100%"
        :headers="headers"
        :items="instances"
        :loading="loadingInstances"
        sort-by="url"
        class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-toolbar-title><h3 class="mx-2">Highlight Instances</h3></v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn color="green" class="white--text ma-2 pt-0" v-on:click="refreshData" :loading="loadingInstances == true">Refresh</v-btn>
          <HighlightInstanceAddModal v-on:close="this.refreshData()"/>

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
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import Vue from "vue";
import HighlightInstanceAddModal from "@/components/server/highlight/components/HighlightInstanceAddModal.vue";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import Logger from "@/utils/Logger";
import HighlightDeleteModal from "@/components/server/highlight/components/HighlightDeleteModal.vue";

export default Vue.extend({
  name: "HighlightInstanceTable",

  components: {
    HighlightInstanceAddModal,
    HighlightDeleteModal
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'URL',
        align: 'start',
        sortable: false,
        value: 'url',
      },
      {text: 'Domain ID', value: 'domainId'},
      {text: 'User', value: 'username'},
      {text: 'Company Name', value: 'companyName'},
      {text: 'Official Name', value: 'officialName'},
      {text: 'Partner', value: 'partnerName'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    instances: [] as HighlightCredentials[],
    editedIndex: -1,
    editedItem: {} as HighlightCredentials,
    defaultItem: {} as HighlightCredentials,

    loadingDelete: false,
    loadingInstances: false,

    errors: "" as string,
  }),

  computed: {
    formTitle () :any {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  mounted () : void {
    this.initialize()
  },

  methods: {
    initialize () {
      this.instances = [];
      this.refreshData();
    },

    /**
     * Refresh instance data
     */
    async refreshData() {
      if(this.loadingInstances) return;

      this.errors = "";
      this.instances = [];
      this.loadingInstances = true;
      try {
        const response = await HighlightInstanceController.getAllInstance();

        if(response.isError()) {
          this.errors = response.getErrorsAsString()
        } else {
          this.instances = response.getData();
          this.errors = "";
        }
      } catch (e) {
        Logger.error("Failed to get Highlight instance",
            "Failed to get the list of Highlight instance due to a client error.",
            e,
            "Highlight Portoflio Table");
        this.errors = "Failed to get the list of Highlight instance due to a client error.";
        this.instances = [];
      } finally {
          this.loadingInstances = false;
      }
    },


  },
});
</script>

<style scoped>

</style>