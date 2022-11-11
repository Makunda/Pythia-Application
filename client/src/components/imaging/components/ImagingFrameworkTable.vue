<template>
  <!-- Main container -->
  <v-container style="width: 100%">
    <!-- Search & CRUD  -->

    <!--  Filtering options  -->
    <v-row class="px-10 pb-" align="center" justify="end">
      <v-text-field
        v-model="search"
        clearable
        flat
        hide-details
        prepend-inner-icon="mdi-magnify"
        :label="`Search ${totalFrameworks} in framework`"
        class="rounded-xl pb-3"
      ></v-text-field>
      <v-btn
        class="ml-4"
        color="warning"
        :loading="loadingDelete"
        :disabled="!selectedFrameworks || selectedFrameworks.length == 0"
        @click="deleteAllSelected()"
      >
        Delete {{ selectedFrameworks.length }} frameworks
      </v-btn>
      <v-btn class="ml-4" color="green" dark> Insert new framework </v-btn>
      <v-btn
        class="ml-4"
        color="primary"
        dark
        @click="downloadExcel"
        :loading="loadingExport"
      >
        Export all
      </v-btn>
      <span class="mr-4 ml-10 grey--text">
        Page {{ page }} of {{ numberOfPages }}
      </span>
      <v-btn fab dark color="#122C44" class="mr-1" @click="formerPage">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn fab dark color="#253D53" class="ml-1" @click="nextPage">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-row>
    <v-row class="px-10">
      <v-col md="2">
        <v-select
          dense
          v-model="selectedLanguage"
          :loading="loadingLanguage"
          :items="languageFilterList"
          item-text="language"
          item-value="language"
          label="Filter by language"
          multiple
          outlined
        ></v-select>
      </v-col>
      <v-col md="2">
        <v-select
          dense
          v-model="selectedDateFilter"
          :items="dateFilterItems"
          label="Filter by date"
          item-text="text"
          item-value="value"
          outlined
        ></v-select>
      </v-col>
      <v-col md="2">
        <v-select dense :items="[]" label="Filter by views" outlined></v-select>
      </v-col>
    </v-row>

    <!-- Data Table  -->
    <v-row class="px-5">
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
        :item-class="itemRowBackground"
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

          <v-icon color="warning" small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>

        <!-- Pattern -->
        <template v-slot:[`item.pattern`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.pattern
          }}</span>
          <v-text-field
            dense
            v-else
            v-model="item.pattern"
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Name -->
        <template v-slot:[`item.name`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.name
          }}</span>
          <v-text-field
            v-else
            v-model="item.name"
            dense
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Language -->
        <template v-slot:[`item.language`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.language
          }}</span>
          <v-text-field
            v-else
            v-model="item.language"
            dense
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Level 1 -->
        <template v-slot:[`item.level1`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.level1
          }}</span>
          <v-text-field
            v-else
            v-model="item.level1"
            dense
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Level 2 -->
        <template v-slot:[`item.level2`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.level2
          }}</span>
          <v-text-field
            v-else
            v-model="item.level2"
            dense
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Level 3 -->
        <template v-slot:[`item.level3`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.level3
          }}</span>
          <v-text-field
            v-else
            v-model="item.level3"
            dense
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Level 4 -->
        <template v-slot:[`item.level4`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.level4
          }}</span>
          <v-text-field
            v-else
            v-model="item.level4"
            dense
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Level 5 -->
        <template v-slot:[`item.level5`]="{ item }">
          <span v-if="!isEditing(item)" @click="oneClick($event, item)">{{
            item.level5
          }}</span>
          <v-text-field
            v-else
            v-model="item.level5"
            dense
            v-on:keyup.enter="quickSave(item)"
          ></v-text-field>
        </template>

        <!-- Views -->
        <template v-slot:[`item.views`]="{ item }">
          <span>{{ item.views }}</span>
        </template>

        <!-- createdAt -->
        <template v-slot:[`item.createdAt`]="{ item }">
          <span>{{ item.createdAt }}</span>
        </template>

        <!-- Id -->
        <template v-slot:[`item._id`]="{ item }">
          <span>{{ item._id }}</span>
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
            <v-btn fab dark color="#122C44" class="mr-1" @click="formerPage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab dark color="#253D53" class="ml-1" @click="nextPage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </v-row>

    <!-- Option bar -->
    <v-expand-transition>
      <v-toolbar
        v-if="bulkEditIndex.length > 0"
        color="lightDeepBlue"
        class="bottom-toolbar"
        elevation="8"
        flat
        dense
        ><v-spacer></v-spacer>
        <v-btn dark class="mr-4" color="warning" @click="cancelAllModifications"
          >Cancel</v-btn
        >
        <v-btn dark class="mr-4" color="green" @click="saveAllModifications"
          >Save {{ bulkEditIndex.length }} modifications</v-btn
        >
      </v-toolbar>
    </v-expand-transition>

    <!-- Modals -->
    <ImagingFrameworkDeleteModal
      :show="showDeleteModal"
      :framework="toDeleteItem"
      v-on:close="closeDeleteModal()"
      v-on:remove="closeAndRemove()"
    ></ImagingFrameworkDeleteModal>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import flash, { FlashType } from "@/modules/flash/Flash";
import ImagingFramework from "@/interface/imaging/ImagingFramework";
import ImagingFrameworkController from "@/controllers/imaging/ImagingFrameworkController";
import ImagingFrameworkDeleteModal from "./modals/ImagingFrameworkDeleteModal.vue";
import FrameworkExportController from "@/controllers/framework/FrameworkExportController";
import LanguageController from "@/controllers/language/LanguageController";

export default Vue.extend({
  name: "ImagingFrameworkTable",

  components: {
    ImagingFrameworkDeleteModal,
  },

  data: () => ({
    frameworkList: [] as ImagingFramework[],

    // Search
    search: "",
    filter: {},
    sortDesc: false,
    sortBy: "name",

    // Selection
    selectedFrameworks: [] as ImagingFramework[],

    // Loaders
    loadingDelete: false,
    loadingFrameworks: false,

    // Edition
    editedIndex: -1,
    editedItem: {} as ImagingFramework,
    defaultItem: {} as ImagingFramework,
    bulkEditIndex: [] as string[],

    // Table options
    headers: [
      {
        text: "Pattern",
        align: "start",
        sortable: true,
        value: "pattern",
      },
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Language",
        value: "language",
      },
      { text: "Level 1", value: "level1" },
      { text: "Level 2", value: "level2" },
      { text: "Level 3", value: "level3" },
      { text: "Level 4", value: "level4" },
      { text: "Level 5", value: "level5" },
      { text: "Views", value: "views" },
      { text: "Created", value: "createdAt" },
      { text: "Id", value: "_id" },
      { text: "Actions", value: "actions" },
    ],

    options: {} as any,
    totalFrameworks: 0,
    itemsPerPageArray: [100, 200, 500],
    page: 1,
    numberOfPages: 0,
    itemsPerPage: 100,

    // Modals
    showDeleteModal: false,
    toDeleteItem: {} as ImagingFramework,

    // Double click option
    clicks: 0,
    timer: 0,
    delay: 700,

    // Export
    loadingExport: false,

    // Language list
    selectedLanguage: [] as string[],
    loadingLanguage: false,
    languageFilterList: [] as { language: string; count: string }[],

    // Date filter
    dateFilterItems: [
      { text: "Last hour", value: 60 * 60 * 1000 },
      { text: "Last day", value: 24 * 60 * 60 * 1000 },
      { text: "Last week", value: 6 * 24 * 60 * 60 * 1000 },
      { text: "Last month", value: 30 * 24 * 60 * 60 * 1000 },
      { text: "Last 3 months", value: 3 * 30 * 24 * 60 * 60 * 1000 },
    ],
    selectedDateFilter: -1,
  }),

  async mounted() {
    await this.initialize();
  },

  methods: {
    /**
     * Save all modifications
     */
    async saveAllModifications() {
      let success = 0,
        errors = 0;
      // Save framework by framework
      for (let index = 0; index <= this.bulkEditIndex.length - 1; index++) {
        const id = this.bulkEditIndex[index];
        const item = this.frameworkList.find((x) => x._id == id);
        if (!item || !item._id) {
          continue;
        }
        try {
          const response = await ImagingFrameworkController.updateFramework(
            item,
          );
          if (response.isError()) throw new Error(response.getErrorsAsString());
          this.bulkEditIndex.splice(index, 1);
          index--; // Shift of 1 the index since we deleted the previous item
          success++;
        } catch (error) {
          console.log(`Failed to delete item with ID  ${item._id}`, error);
          errors++;
        }
      }

      if (success > 1) {
        flash.commit("add", {
          type: FlashType.SUCCESS,
          title: "Fameworks modified",
          body: `Succesfully updated ${success} frameworks.`,
        });
      }
      if (errors > 1) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Fameworks produced an error",
          body: `Failed to updated ${errors} frameworks.`,
        });
      }
    },

    /**
     * Save inline modifications
     */
    async quickSave(item: ImagingFramework) {
      try {
        if (!item || !item._id) throw new Error("Item doesn't contain an ID");

        // Find index in the list
        const indexBulkEditList = this.bulkEditIndex.findIndex(
          (x) => x == item._id,
        );

        const response = await ImagingFrameworkController.updateFramework(item);
        if (response.isError()) throw new Error(response.getErrorsAsString());

        // Item list
        if (indexBulkEditList > -1)
          this.bulkEditIndex.splice(indexBulkEditList, 1);
      } catch (error) {
        console.error("Failed to quick save a framework", error);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to save the framework",
          body: error,
        });
      }
    },

    /**
     * Remove inline edit
     */
    removeInlineEdit(item: ImagingFramework) {
      if (!item._id) return;

      let i = this.bulkEditIndex.indexOf(item._id);
      if (i > -1) this.bulkEditIndex.splice(i, 1);
    },

    /**
     * Cancel all inline editing and refresh
     */
    cancelAllModifications() {
      this.bulkEditIndex = [];
      this.getDataFromApi();
    },

    /**
     * Check if the item is being edited
     */
    isEditing(item: ImagingFramework) {
      if (!item._id) return false;

      return this.bulkEditIndex.includes(item._id);
    },

    // Initialize table
    async initialize() {
      await this.getTotal();
      await this.getDataFromApi();
      await this.getListLanguage();
    },

    formerPage() {
      this.page = this.page > 1 ? this.page - 1 : this.page;
      this.getDataFromApi();
    },

    // Go to next page
    nextPage() {
      this.page = this.page < this.numberOfPages ? this.page + 1 : this.page;
      this.getDataFromApi();
    },

    /**
     * Close the modal and reassign default value
     */
    closeDeleteModal() {
      this.toDeleteItem = {} as ImagingFramework;
      this.showDeleteModal = false;
    },

    /**
     * Close the modal and remove the framework from the list
     */
    closeAndRemove() {
      if (!this.toDeleteItem._id) return;

      let i = this.frameworkList.findIndex(
        (x) => x._id == this.toDeleteItem._id,
      );
      if (i > -1) this.bulkEditIndex.splice(i, 1);
      this.closeDeleteModal();
    },

    /**
     * Open the delete modal
     */
    openDeleteModal(item: ImagingFramework) {
      this.toDeleteItem = item;
      this.showDeleteModal = true;
    },

    oneClick(event: any, item: ImagingFramework) {
      this.clicks++;
      if (this.clicks === 1) {
        var self = this;
        this.timer = setTimeout(function () {
          self.clicks = 0;
        }, this.delay);
      } else {
        clearTimeout(this.timer);
        this.inlineEdit(item);
        this.clicks = 0;
      }
    },

    /**
     * Download the excel file
     */
    async downloadExcel() {
      this.loadingExport = true;
      try {
        await FrameworkExportController.downloadImagingExport();
        flash.commit("add", {
          type: FlashType.INFO,
          title: "Export succesful",
          body: "Please allow the popups on this website to download the CSV export",
        });
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to download the framework list.",
          body: err,
        });
      } finally {
        this.loadingExport = false;
      }
    },

    /**
     * Delete a framework
     */
    async deleteItem(item: ImagingFramework) {
      try {
        if (!item._id) return;
        const response = await ImagingFrameworkController.deleteFramework(
          item._id,
        );
        if (response.isError()) throw new Error(response.getErrorsAsString());
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get Framework list",
          body: err,
        });
      }
    },

    /**
     * Get Data from AOI
     */
    async getDataFromApi() {
      this.loadingFrameworks = true;
      try {
        this.getTotal().catch((ignored) => {});
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;

        const response = await ImagingFrameworkController.getBatch(
          start,
          end,
          sortBy || "",
          sortDesc == "true" ? "desc" : "",
          this.search,
          this.selectedLanguage,
          this.selectedDateFilter,
        );

        // Check errors
        if (response.isError()) throw new Error(response.getErrorsAsString());

        // Process
        this.frameworkList = response.getData();
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

    async inlineEdit(item: ImagingFramework) {
      if (!item._id) return;
      if (this.bulkEditIndex.includes(item._id)) return;

      this.bulkEditIndex.push(item._id);
    },

    /**
     * Get the list of languages
     */
    async getListLanguage() {
      try {
        this.loadingLanguage = true;
        const response =
          await LanguageController.getLanguagesInUseImagingFramework();
        if (response.isError()) throw new Error(response.getErrorsAsString());
        this.languageFilterList = response.getData();
      } catch (err) {
        console.error(
          "Failed to get the list of languages in the Framework.",
          err,
        );
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the list of languages in the framework.",
          body: err,
        });
      } finally {
        this.loadingLanguage = false;
      }
    },

    /**
     * Get the number of framework
     */
    async getTotal() {
      try {
        const response = await ImagingFrameworkController.getFrameworkCount(
          this.search,
          this.selectedLanguage,
          this.selectedDateFilter,
        );
        if (response.isError()) throw new Error(response.getErrorsAsString());
        this.totalFrameworks = response.getData();
        this.numberOfPages =
          Math.round(this.totalFrameworks / this.itemsPerPage) + 1;
      } catch (err) {
        console.error("Failed to get the number of Framework.", err);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the number of framework.",
          body: err,
        });
      }
    },

    itemRowBackground(item: ImagingFramework) {
      return this.isEditing(item) ? "editingCell" : "";
    },

    /**
     * Get the list of the frameworks
     */
    async getFrameworkList() {
      try {
        this.loadingFrameworks = true;
        const response = await ImagingFrameworkController.getAllFramework();
        if (response.isError()) throw new Error(response.getErrorsAsString());

        // Successful response
        this.frameworkList = response.getData();
      } catch (err) {
        // Failed to get the framework list
        console.error("Failed to get the framework list", err);
        // Flash message to notify the user
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the framework list",
          body: err,
        });
      } finally {
        this.loadingFrameworks = false;
      }
    },

    /**
     * Delete all the selected frameworks
     */
    deleteAllSelected() {
      // Ignore
    },
  },

  watch: {
    options: {
      handler() {
        this.numberOfPages =
          Math.round(this.totalFrameworks / this.itemsPerPage) + 1;
        this.getDataFromApi();
      },
      deep: true,
    },

    selectedLanguage: {
      async handler() {
        this.getDataFromApi();
      },
    },

    selectedDateFilter: {
      async handler() {
        this.getDataFromApi();
      },
    },

    search: {
      async handler() {
        this.getDataFromApi();
      },
    },
  },
});
</script>

<style>
.editingCell {
  background-color: #d4e8a4;
}

.bottom-toolbar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 30px;
}
</style>
