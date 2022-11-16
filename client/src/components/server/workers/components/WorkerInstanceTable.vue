<template>
  <v-container>
    <v-data-table
        style="width: 100%"
        :headers="headers"
        :items="workers"
        :loading="loadingWorker"
        sort-by="url"
        class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-toolbar-title><h3 class="mx-2">Worker Instances</h3></v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn color="green" class="white--text ma-2 pt-0" v-on:click="refreshData" :loading="loadingInstances == true">Refresh</v-btn>
          <WorkerInstanceAddModal v-on:close="refreshData"/>

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
        <WorkerDeleteModal :worker="item" v-on:close="refreshData"/>
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
import Logger from "@/utils/Logger";
import WorkerInstanceAddModal from "@/components/server/workers/components/WorkerInstanceAddModal.vue";
import WorkerDeleteModal from "@/components/server/workers/components/WorkerDeleteModal.vue";
import Worker from "@/interface/worker/Worker";
import WorkerController from "@/controllers/worker/WorkerController";

export default Vue.extend({
  name: "WorkerInstanceTable",

  components: {
    WorkerInstanceAddModal,
    WorkerDeleteModal
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
      {text: 'Architecture', value: 'architecture'},
      {text: 'Platform', value: 'platform'},
      {text: 'Language', value: 'language'},
      {text: 'URL', value: 'url'},
      { text: 'Actions', value: "actions" },
    ],
    workers: [] as Worker[],
    editedIndex: -1,
    editedItem: {} as Worker,
    defaultItem: {} as Worker,

    loadingDelete: false,
    loadingWorker: false,

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
      this.workers = [];
      this.refreshData();
    },

    /**
     * Refresh instance data
     */
    async refreshData() {
      this.workers = [];
      this.loadingWorker = true;
      try {
        const response = await WorkerController.getAllInstance();
        console.log("Response", response)

        if(response.isError()) {
          this.errors = response.getErrorsAsString()
        } else {
          this.workers = response.getData();
          this.errors = "";
        }
      } catch (e) {
        Logger.error("Failed to get worker list",
            "Failed to get the list of worker instance due to a client error.",
            e,
            "Worker portfolio Table");
        this.errors = "Failed to get the list of Worker instance due to a client error.";
        this.workers = [];
      } finally {
          this.loadingWorker = false;
      }
    },

    editItem (item: Worker) {
      this.editedIndex = this.workers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item: Worker) {
      this.editedIndex = this.workers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },


  },
});
</script>

<style scoped>

</style>