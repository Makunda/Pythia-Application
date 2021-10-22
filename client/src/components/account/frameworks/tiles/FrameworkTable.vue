<template>
  <v-container>
    <v-row>
      <!-- Framework list -->
      <v-col
        class="padding-border transition-width"
        cols="12"
        :md="!showOverview ? 12 : 6"
      >
        <v-container>
          <v-row class="padding-border">
            <p class="text-h6">{{ totalFrameworks }} Frameworks</p>
            <v-spacer></v-spacer>
            <v-btn color="green" small dark text @click="frameworkModal = true">
              Create new framework
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-row>

          <v-row class="px-6">
            <v-text-field
              v-model="search"
              clearable
              flat
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search framework"
              class="rounded-xl pb-3"
            ></v-text-field>
            <v-btn
              color="warning"
              :loading="loadingDelete"
              :disabled="!selectedFrameworks || selectedFrameworks.length == 0"
              @click="deleteAll()"
            >
              Delete selected
            </v-btn>
          </v-row>

          <v-row>
            <v-data-table
              style="width: 100%"
              v-model="selectedFrameworks"
              item-key="_id"
              :items="frameworkList"
              :items-per-page.sync="itemsPerPage"
              :page.sync="page"
              :headers="headers"
              :search="search"
              :loading="loadingFrameworks"
              :server-items-length="totalFrameworks"
              :options.sync="options"
              show-select
              hide-default-footer
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                  color="green"
                  small
                  class="mr-2"
                  @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon color="warning" small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>

              <template v-slot:footer>
                <v-row class="mt-2" align="center" justify="center">
                  <span class="grey--text">Items per page</span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        text
                        color="primary"
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ itemsPerPage }}
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(number, index) in itemsPerPageArray"
                        :key="index"
                        @click="updateItemsPerPage(number)"
                      >
                        <v-list-item-title>{{ number }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-spacer></v-spacer>

                  <span class="mr-4 grey--text">
                    Page {{ page }} of {{ numberOfPages }}
                  </span>
                  <v-btn
                    fab
                    dark
                    color="#122C44"
                    class="mr-1"
                    @click="formerPage"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    dark
                    color="#253D53"
                    class="ml-1"
                    @click="nextPage"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-data-table>
          </v-row>
        </v-container>
      </v-col>

      <v-spacer vertical></v-spacer>

      <!-- Overview -->
      <v-col
        class="padding-border transition-width"
        v-show="showOverview"
        cols="12"
        md="6"
      >
        <v-container>
          <v-row class="padding-border">
            <p class="text-h6">Overview</p>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <!-- Modal Framework creation -->
    <AddFrameworkModal
      v-bind:show="frameworkModal"
      v-on:close="frameworkModal = false"
    ></AddFrameworkModal>

    <FrameworkDeleteModal
      v-bind:show="frameworkDeleteModal"
      v-bind:framework="editedItem"
      v-on:close="closeDeleteModal()"
    >
    </FrameworkDeleteModal>

    <ModifyFrameworkModal
      v-bind:show="frameworkUpdateModal"
      v-bind:framework="editedItem"
      v-on:close="closeUpdateModal()"
    >
    </ModifyFrameworkModal>
  </v-container>
</template>

<script lang="ts">
import { Framework } from "@/interface/framework/Framework";
import AddFrameworkModal from "@/components/account/frameworks/tiles/AddFrameworkModal.vue";
import ModifyFrameworkModal from "@/components/account/frameworks/tiles/ModifyFrameworkModal.vue";
import FrameworkDeleteModal from "@/components/account/frameworks/tiles/FrameworkDeleteModal.vue";

import Vue from "vue";
import FrameworkController from "@/controllers/framework/FrameworkController";
import flash, { FlashType } from "@/modules/flash/Flash";
import Logger from "@/utils/Logger";

export default Vue.extend({
  name: "FrameworkTable",

  components: {
    AddFrameworkModal,
    FrameworkDeleteModal,
    ModifyFrameworkModal,
  },

  data: () => ({
    showOverview: false,
    itemsPerPageArray: [20, 50, 200],

    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 20,
    sortBy: "name",
    loadingFrameworks: false,
    frameworkList: [] as Framework[],
    totalFrameworks: 0,
    numberOfPages: 0,

    loadingDelete: false,

    selectedFrameworks: [] as Framework[],

    headers: [
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
      },
      { text: "Location", value: "location" },
      { text: "Created by user", value: "createdByUser" },
      { text: "Validated", value: "validated" },
      { text: "Views", value: "views" },
      { text: "Actions", value: "actions" },
    ],

    options: {} as any,

    // Framework Modal
    frameworkModal: false,
    frameworkDeleteModal: false,
    frameworkUpdateModal: false,
    editedIndex: -1,
    editedItem: {} as Framework,
    defaultItem: {} as Framework,

    dialog: false,
    dialogDelete: false,
  }),

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getDataFromApi();
      this.getTotal();
    },

    closeDeleteModal() {
      this.frameworkDeleteModal = false;
      this.editedItem = {} as Framework;
      this.getDataFromApi();
    },

    closeUpdateModal() {
      this.frameworkUpdateModal = false;
      this.editedItem = {} as Framework;
      this.getDataFromApi();
    },

    /**
     * Get the total number of Frameworks in the database
     */
    async getTotal() {
      try {
        const response = await FrameworkController.getTotal();
        if (response.isSuccess()) {
          this.totalFrameworks = response.getData();
          this.numberOfPages =
            Math.round(this.totalFrameworks / this.itemsPerPage) + 1;
        } else {
          console.error(
            `Failed to the number of frameworks. Error: ${response.getErrorsAsString()}`,
          );
        }
      } catch (err) {
        console.error("Failed to get the number of frameworks.", err);
      }
    },

    /**
     * Get Frameworks from the API
     */
    async getDataFromApi() {
      if (!this.search) await this.getTableFromApi();
        else {
          try {
            const response = await FrameworkController.searchByName(
              this.search,
            );
            if (!response.isSuccess())
              throw new Error(response.getErrorsAsString());
            this.frameworkList = response.getData();
          } catch (err) {
            flash.commit("add", {
              type: FlashType.ERROR,
              title: "Failed to search frameworks",
              body: err,
            });
          }
        }
    },

    async getTableFromApi() {
      this.loadingFrameworks = true;
      try {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const response = await FrameworkController.getFrameworkList(
          start,
          end,
          sortBy,
          sortDesc == "true" ? "desc" : "",
        );

        if (response.isSuccess()) {
          this.frameworkList = response.getData();
        } else {
          flash.commit("add", {
            type: FlashType.ERROR,
            title: "Failed to get Framework list",
            body: response.getErrorsAsString(),
          });
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get Framework list",
          body: err,
        });
      } finally {
        this.loadingFrameworks = false;
      }
    },

    formerPage() {
      this.page = this.page > 1 ? this.page - 1 : this.page;
      this.getDataFromApi();
    },

    nextPage() {
      this.page = this.page < this.numberOfPages ? this.page + 1 : this.page;
      this.getDataFromApi();
    },

    editItem(item: Framework) {
      console.log("Editing ", item);
      this.editedItem = item;
      this.frameworkUpdateModal = true;
    },

    deleteItem(item: Framework) {
      this.editedItem = item;
      this.frameworkDeleteModal = true;
    },

    deleteItemConfirm() {
      this.frameworkList.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.frameworkList[this.editedIndex], this.editedItem);
      } else {
        this.frameworkList.push(this.editedItem);
      }
      this.close();
    },

    /**
     * Delete all the selected frameworks
     */
    async deleteAll() {
      this.loadingDelete = true;
      if (!this.selectedFrameworks) return;

      // Iterate and remove from table
      for (var i = this.selectedFrameworks.length - 1; i >= 0; i--) {
        try {
          await FrameworkController.deleteFramework(
            this.selectedFrameworks[i]._id,
          );
          this.selectedFrameworks.splice(i, 1);
        } catch (err) {
          console.error(
            `Failed to delete framework with id: ${this.selectedFrameworks[i]._id}.`,
            err,
          );
        }
      }
      this.getDataFromApi();
      this.loadingDelete = false;
    },
  },

  watch: {
    options: {
      handler() {
        const { itemsPerPage } = this.options;
        this.numberOfPages =
          Math.round(this.totalFrameworks / itemsPerPage) + 1;
        this.getDataFromApi();
      },
      deep: true,
    },

    search: {
      async handler() {
        this.getDataFromApi();
      },
    },
  },
});
</script>

<style scoped>
.transition-width {
  -webkit-transition: width 0.5s ease-in-out;
  -moz-transition: width 0.5s ease-in-out;
  -o-transition: width 0.5s ease-in-out;
  transition: width 0.5s ease-in-out;
}
</style>
