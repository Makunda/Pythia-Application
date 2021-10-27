<template>
  <v-container fluid>
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
              dense
              hide-default-footer
            >
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                  v-if="!isEditing(item)"
                  color="green"
                  small
                  class="mr-2"
                  @click="inlineEdit(item)"
                >
                  mdi-pencil
                </v-icon>

                <v-icon
                  v-else
                  color="warning"
                  small
                  class="mr-2"
                  @click="removeInlineEdit(item)"
                >
                  mdi-pencil
                </v-icon>

                <v-icon
                  v-if="!isEditing(item)"
                  color="green"
                  small
                  class="mr-2"
                  @click="editItem(item)"
                >
                  mdi-clipboard-edit
                </v-icon>

                <v-icon color="warning" small @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>

              <!-- Name -->
              <template v-slot:[`item.name`]="{ item }">
                <span v-if="!isEditing(item)">{{ item.name }}</span>
                <v-text-field v-else v-model="item.name" dense></v-text-field>
              </template>

              <!-- ImaginName -->
              <template v-slot:[`item.imagingName`]="{ item }">
                <span v-if="!isEditing(item)">{{ item.imagingName }}</span>
                <v-text-field
                  v-else
                  v-model="item.imagingName"
                  dense
                ></v-text-field>
              </template>

              <!-- Location -->
              <template v-slot:[`item.location`]="{ item }">
                <span v-if="!isEditing(item)">{{ item.location }}</span>
                <v-text-field
                  v-else
                  v-model="item.location"
                  dense
                ></v-text-field>
              </template>

              <!-- Validated -->
              <template v-slot:[`item.validated`]="{ item }">
                <v-simple-checkbox
                  v-model="item.validated"
                  @click="toggleValidationById(item)"
                ></v-simple-checkbox>
              </template>

              <!-- Patterns -->
              <template v-slot:[`item.patterns`]="{ item }">
                <span v-if="!item.patterns || item.patterns.length == 0">
                  No pattern
                </span>
                <span v-else>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="item.patterns && item.patterns.length == 1"
                        rounded
                        x-small
                        hover
                        :color="isEditing(item) ? 'blue' : 'green'"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.patterns[0].pattern }}
                        <span></span>
                      </v-btn>
                      <v-btn
                        v-else
                        rounded
                        x-small
                        hover
                        :color="isEditing(item) ? 'blue' : 'green'"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.patterns.length }} Pattern(s)
                      </v-btn>
                    </template>
                    <v-list class="pa-A ma-0">
                      <!-- List of patterns -->
                      <v-list-item
                        v-for="(item, index) in item.patterns"
                        :key="index"
                      >
                        <v-list-item-title>
                          {{ item.language.name }} - {{ item.pattern }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>
              </template>

              <!-- categories -->
              <template v-slot:[`item.category`]="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      rounded
                      x-small
                      :color="isEditing(item) ? 'blue' : 'green'"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ getItemCategory(item) }}
                    </v-btn>
                  </template>
                  <v-list v-if="isEditing(item)">
                    <SimpleCategoryTreeView
                      v-on:selected="selectCategory(item._id, $event)"
                      ref="categoryViewer"
                    >
                    </SimpleCategoryTreeView>
                  </v-list>
                </v-menu>
              </template>

              <!-- Validated -->

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
                        @click="updateItemPerPage(number)"
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

    <v-expand-transition>
      <v-toolbar
        v-if="inlineEditIdList.length > 0"
        color="lightDeepBlue"
        class="bottom-toolbar"
        elevation="8"
        flat
        dense
        ><v-spacer></v-spacer>
        <v-btn dark class="mr-4" color="warning" @click="cancelAllModifications"
          >Cancel</v-btn
        >
        <v-btn dark class="mr-4" color="green" @click="saveAllModification"
          >Save {{ inlineEditIdList.length }} modifications</v-btn
        >
      </v-toolbar>
    </v-expand-transition>

    <!-- Modal Framework creation -->
    <AddFrameworkModal
      v-bind:show="frameworkModal"
      v-on:close="frameworkModal = false"
    ></AddFrameworkModal>

    <FrameworkDeleteModal
      v-bind:show="frameworkDeleteModal"
      v-bind:framework="editedItem"
      v-on:close="deleteItemConfirm()"
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
import SimpleCategoryTreeView from "@/components/account/frameworks/tiles/SimpleCategoryTreeView.vue";

import Vue from "vue";
import FrameworkController from "@/controllers/framework/FrameworkController";
import flash, { FlashType } from "@/modules/flash/Flash";
import Copy from "@/utils/Copy";
import PatternController from "@/controllers/framework/PatternController";
import { Pattern } from "@/interface/framework/Pattern";
import FrameworkReviewController from "@/controllers/framework/FrameworkReviewController";

export default Vue.extend({
  name: "FrameworkTable",

  components: {
    AddFrameworkModal,
    FrameworkDeleteModal,
    ModifyFrameworkModal,
    SimpleCategoryTreeView,
  },

  data: () => ({
    showOverview: false,
    itemsPerPageArray: [100, 200, 500],

    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 100,
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
      {
        text: "Imaging Name",
        value: "imagingName",
      },
      { text: "Location", value: "location" },
      { text: "Category", value: "category" },
      { text: "Patterns", value: "patterns" },
      { text: "Created by user", value: "createdByUser" },
      { text: "Validated", value: "validated" },
      { text: "Views", value: "views" },
      { text: "Created", value: "createdAt" },
      { text: "Id", value: "_id" },

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

    inlineEditIdList: [] as Framework[],

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
          const response = await FrameworkController.searchByName(this.search);
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

    // Update the number of item per page
    updateItemPerPage(num: number) {
      this.itemsPerPage = num;
      this.getTableFromApi();
    },

    // Apply a new category
    selectCategory(id: string, category: any) {
      if (!category) return; // No category

      const index = this.inlineEditIdList
        .map(function (e) {
          return e._id;
        })
        .indexOf(id);
      if (index < 0) return;

      this.inlineEditIdList[index].category = category;
    },

    // Get framework's pattern
    async getPatterns(id: string): Promise<Pattern[]> {
      try {
        const response = await PatternController.getPatternByFrameworkId(id);

        // If success
        if (response.isSuccess()) {
          return response.getData();
        } else {
          return [];
        }
      } catch (err) {
        // Ignore
        return [];
      }
    },

    // Get Table from API
    async getTableFromApi() {
      this.loadingFrameworks = true;
      try {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;

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

    // Inline edit
    inlineEdit(item: Framework) {
      // Set property
      this.inlineEditIdList.push(item);
    },

    // Inline edit
    removeInlineEdit(item: Framework) {
      // Get index in first
      const index = this.inlineEditIdList
        .map(function (e) {
          return e._id;
        })
        .indexOf(item._id);
      // Remove by index
      this.inlineEditIdList.splice(index, 1);
    },

    // Save all the modifications
    async saveAllModification() {
      let success = 0;

      for (let i = 0; this.inlineEditIdList.length > i; i++) {
        try {
          const item = this.inlineEditIdList[i];
          await FrameworkController.updateFramework(
            item,
            item.patterns || [],
            item.category._id,
          );
          success++;
        } catch (err) {}
      }

      // Saved
      const errors = this.inlineEditIdList.length - success;
      this.inlineEditIdList = [];

      flash.commit("add", {
        type: FlashType.SUCCESS,
        title: `Updated ${success} frameworks`,
        body: `${success} frameworks have been updated. ${errors} were thrown.`,
      });
    },

    // Cancel everything
    cancelAllModifications() {
      this.inlineEditIdList = [];
      this.getDataFromApi();
    },

    // is editing
    isEditing(item: Framework): boolean {
      return this.inlineEditIdList.includes(item);
    },

    getItemCategory(item: Framework) {
      return item.category ? item.category.title : "No category";
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
      const index = this.frameworkList.indexOf(this.editedItem);
      if (index > -1) {
        this.frameworkList.splice(index, 1);
      }

      this.frameworkDeleteModal = false;
      this.editedItem = {} as Framework;
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
     * Toggle validations
     */
    async toggleValidationById(item: Framework) {
      try {
        const response = await FrameworkReviewController.toggleValidationById(
          item._id,
        );
        item.validated = response.getData() || item.validated;
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to toggle framework",
          body: err,
        });
      }
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

.v-text-field.v-input--dense {
  height: 38px !important;
}

.v-text-field--outlined fieldset {
  height: 38px !important;
}

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 30px;
}

.v-list-item {
  min-height: 26px !important;
}
</style>
