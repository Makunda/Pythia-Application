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

          <v-btn :loading="loadingWorker" class="white--text ma-2 pt-0" color="green" v-on:click="refreshData">Refresh
          </v-btn>
          <WorkerInstanceAddModal v-on:close="refreshData"/>

        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <WorkerInstanceUpdateModal :workerEdit="item"/>
        <WorkerDeleteModal :worker="item" v-on:close="refreshData"/>
        <v-icon
            :disabled="item._id in pingedWorker"
            color="green"
            small
            class="mr-2"
            @click="ping(item)"
        >
          mdi-bullseye-arrow
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
import Logger from "@/utils/Logger";
import WorkerInstanceAddModal from "@/components/server/workers/components/WorkerInstanceAddModal.vue";
import WorkerDeleteModal from "@/components/server/workers/components/WorkerDeleteModal.vue";
import Worker from "@/interface/worker/Worker";
import WorkerController from "@/controllers/worker/WorkerController";
import ArrayUtils from "@/utils/ArrayUtils";
import WorkerInstanceUpdateModal from "@/components/server/workers/components/WorkerInstanceUpdateModal.vue";

export default Vue.extend ({
  name: "WorkerInstanceTable",

  components: {
    WorkerInstanceUpdateModal,
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
      {text: 'Last Online', value: 'lastOnline'},
      {text: 'Actions', value: "actions"},
    ],
    workers: [] as Worker[],
    editedIndex: -1,
    editedItem: {} as Worker,
    defaultItem: {} as Worker,


    pingedWorker: [] as string[],

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
      this.editedItem = Object.assign ({}, item)
      this.dialog = true
    },

    deleteItem(item: Worker) {
      this.editedIndex = this.workers.indexOf (item)
      this.editedItem = Object.assign ({}, item)
      this.dialogDelete = true
    },

    /**
     * Ping the worker
     * @param item Item to ping
     */
    async ping(item: Worker) {
      if (!item._id) return;
      this.pingedWorker = ArrayUtils.addUnique (this.pingedWorker, item._id);

      try {
        await WorkerController.ping (item);
      } catch (e) {
        Logger.error (`Failed to ping the worker [id=${item.name}, url=${item.url}]`, e, "Worker Instance Table");
      } finally {
        this.pingedWorker = ArrayUtils.removeItemAll (this.pingedWorker, item._id);
      }
    }
  },
});
</script>

<style scoped>

</style>