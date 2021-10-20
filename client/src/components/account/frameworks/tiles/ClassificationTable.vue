<template>
  <v-container>
    <!-- No row created -->
    <v-row>
      <p v-if="!categories || categories.length <= 0">
        No category has been created. Start by adding new ones.
      </p>
      <v-spacer></v-spacer>
      <v-btn
        color="green"
        small
        dark
        text
        @click="categoryCreationModal = true"
      >
        Create new root category
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>

    <!-- Loading -->
    <v-row class="px-5 py-2" v-if="loadingCategories">
      <v-progress-linear
        width="100%"
        indeterminate
        color="warning"
      ></v-progress-linear>
    </v-row>

    <!-- Treeview -->
    <v-row>
      <v-treeview
        class="mt-4"
        style="width: 100%"
        :active.sync="active"
        :items="categories"
        :load-children="fetchCategory"
        :open.sync="open"
        expand-icon="mdi-chevron-down"
        item-text="title"
        open-all
        transition
      >
        <template v-slot:label="{ item }">
          <v-card
            width="100%"
            :height="item.isRoot ? '52px' : '50px'"
            class="mb-1"
            dark
            :color="item.isRoot ? 'lessDeepBlue' : 'lightDeepBlue'"
            style="padding-top: 12px"
          >
            <v-card-title class="py-0 d-flex flex-row">
              <p class="text-subtitle-1">
                {{ item.title }} -
                <i
                  >( Children:
                  {{ item.children ? item.children.length : 0 }})</i
                >
              </p>
              <v-spacer></v-spacer>

              <!-- Edit layer -->

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    icon
                    class="marged-button mr-1"
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click="openEditModal(item)"
                  >
                    <v-icon> mdi-lead-pencil </v-icon>
                  </v-btn>
                </template>
                <span>Edit the category</span>
              </v-tooltip>

              <!-- Add layer under -->

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    icon
                    class="marged-button mr-1"
                    color="green"
                    v-bind="attrs"
                    v-on="on"
                    @click="openAddUnderModal(item)"
                  >
                    <v-icon> mdi-layers-plus </v-icon>
                  </v-btn>
                </template>
                <span>Add a category under</span>
              </v-tooltip>

              <!-- Remove layer -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    icon
                    class="marged-button mr-1"
                    color="warning"
                    v-bind="attrs"
                    v-on="on"
                    @click="openDeleteModal(item)"
                  >
                    <v-icon> mdi-layers-remove </v-icon>
                  </v-btn>
                </template>
                <span>Remove the category</span>
              </v-tooltip>

              <!-- Expand the row -->
              <v-btn
                text
                icon
                class="marged-button ml-10 mr-1"
                color="background"
              >
                <v-icon> mdi-arrow-right-bold-circle </v-icon>
              </v-btn>
            </v-card-title>
          </v-card>
        </template>
      </v-treeview>
    </v-row>

    <!-- Modals -->
    <AddCategoryModal
      v-bind:show="categoryCreationModal"
      v-on:close="closeAddModal()"
    >
    </AddCategoryModal>

    <!-- Edit Modal -->
    <EditCategoryModal
      v-bind:show="categoryEditModal"
      v-bind:category="editedItem"
      v-on:close="closeEditModal()"
    >
    </EditCategoryModal>

    <!-- Delete Modal  -->
    <DeleteCategoryModal
      v-bind:show="categoryDeleteModal"
      v-bind:category="toDeleteItem"
      v-on:close="closeDeleteModal()"
    >
    </DeleteCategoryModal>

    <!-- Create under -->
    <AddCategoryUnderModal
      v-bind:show="categoryAddUnderModal"
      v-bind:parent="addUnderParent"
      v-on:close="closeAddUnderModal()"
    >
    </AddCategoryUnderModal>

    <v-row> </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FrameworkMetadataController from "@/controllers/framework/FrameworkMetadataController";
import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import AddCategoryModal from "./AddCategoryModal.vue";
import EditCategoryModal from "./EditCategoryModal.vue";
import DeleteCategoryModal from "./DeleteCategoryModal.vue";
import AddCategoryUnderModal from "./AddCategoryUnderModal.vue";
import FrameworkCategoryController from "@/controllers/framework/FrameworkCategoryController";
import flash, { FlashType } from "@/modules/flash/Flash";
export default Vue.extend({
  name: "ClassificationTable",

  components: {
    AddCategoryModal,
    EditCategoryModal,
    DeleteCategoryModal,
    AddCategoryUnderModal,
  },

  mounted() {
    this.getTechnologiesList();
    this.getRoots();
  },

  methods: {
    closeAddModal() {
      this.categoryCreationModal = false;
      this.getRoots();
    },

    closeEditModal() {
      this.editedItem = {} as FrameworkCategory;
      this.categoryEditModal = false;
      this.getRoots();
    },

    closeDeleteModal() {
      this.categoryDeleteModal = false;
      this.toDeleteItem = {} as FrameworkCategory;
      this.getRoots();
    },

    closeAddUnderModal() {
      this.categoryAddUnderModal = false;
      this.addUnderParent = {} as FrameworkCategory;
      this.getRoots();
    },

    openAddUnderModal(item: FrameworkCategory) {
      this.addUnderParent = item;
      this.categoryAddUnderModal = true;
    },

    openDeleteModal(item: FrameworkCategory) {
      this.toDeleteItem = item;
      this.categoryDeleteModal = true;
    },

    /**
     * Open the edit modal
     */
    openEditModal(item: FrameworkCategory) {
      this.editedItem = item;
      this.categoryEditModal = true;
    },

    /**
     * Get the list of the technologies
     */
    async getTechnologiesList() {
      try {
        const response = await FrameworkMetadataController.getTechnologyList();
        if (response.isSuccess()) {
          this.technologiesList = response.getData();
        } else {
          console.error("Failed to get the list of technologies.");
        }
      } catch (err) {
        console.error("Failed to get the list of technologies.");
      }
    },

    /**
     * Recursively load the children of an item
     */
    async recursiveLoad(item: FrameworkCategory): Promise<FrameworkCategory> {
      item = await this.fetchCategory(item);

      // No children return
      if (!item.children) return item;
      const children = [];

      for (const c of item.children) {
        children.push(await this.recursiveLoad(c));
      }

      // reassign item children
      item.children = children;

      return item;
    },

    /**
     * Get the categories attached to one item and store them in .children
     */
    async fetchCategory(item: FrameworkCategory): Promise<FrameworkCategory> {
      try {
        if (!item._id) return item;

        const response = await FrameworkCategoryController.getChildrenById(
          item._id,
        );

        if (response.isSuccess()) {
          item.children = response.getData();
        }
      } catch (err) {
        // Ignored
      } finally {
        return item;
      }
    },

    /**
     * Get roots items
     */
    async getRoots() {
      this.loadingCategories = true;
      try {
        const response = await FrameworkCategoryController.getRoots();
        if (response.isSuccess()) {
          this.categories = [];
          const roots = response.getData();

          // Get children
          for (const i of roots) {
            const y = await this.fetchCategory(i);
            this.categories.push(await this.recursiveLoad(y));
          }
        } else {
          flash.commit("add", {
            type: FlashType.ERROR,
            title: "Failed to get roots of the tree",
            body: response.getErrorsAsString(),
          });
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get root of the tree",
          body: String(err),
        });
      } finally {
        this.loadingCategories = false;
      }
    },
  },

  data: () => ({
    // Misc
    loadingCategories: false,

    // Tree view
    technologiesList: [] as string[],
    active: [],
    open: [],
    categories: [] as FrameworkCategory[],

    // ADD Modals
    categoryCreationModal: false,

    // Edit modal
    categoryEditModal: false,
    editedItem: {} as FrameworkCategory,

    // Delete modal
    categoryDeleteModal: false,
    toDeleteItem: {} as FrameworkCategory,

    // Add under
    categoryAddUnderModal: false,
    addUnderParent: {} as FrameworkCategory,
  }),
});
</script>

<style scoped>
.marged-button {
  margin-top: -18px;
}
</style>
