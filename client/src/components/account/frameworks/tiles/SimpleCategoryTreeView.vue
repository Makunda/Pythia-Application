<template>
  <v-container class="px-10">
    <v-row v-if="(!items || items.length) && !loadingCategories == 0"
      >No Category has been fetched.</v-row
    >
    <v-row v-if="loadingCategories">
      <v-progress-linear
        width="100%"
        indeterminate
        color="warning"
      ></v-progress-linear>
    </v-row>
    <v-row>
      <v-treeview
        style="width: 100%"
        :items="items"
        item-key="_id"
        :load-children="fetchCategory"
        activatable
        dense
        color="warning"
        transition
      >
        <template
          v-slot:label="{ item }"
          style="
            justify-content: space-between;
            display: flex;
            flex-direction: row;
          "
        >
          <span
            >{{ typeof item == "undefined" ? "Error" : item.title }}
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  x-small
                  text
                  v-bind="attrs"
                  v-on="on"
                  @click="selectCategory(item)"
                  :color="selectedItemId == item._id ? 'green' : 'lightgray'"
                >
                  <v-icon>
                    {{
                      selectedItemId == item._id
                        ? "mdi-check-circle"
                        : "mdi-checkbox-blank-circle-outline"
                    }}
                  </v-icon>
                </v-btn>
              </template>
              <span>Select the category</span>
            </v-tooltip>
          </span>

          <!-- Spacer and actions -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                icon
                class="marged-button mr-1 ml-7"
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
        </template>
      </v-treeview>
    </v-row>

    <!-- Create under -->
    <AddCategoryUnderModal
      v-bind:show="categoryAddUnderModal"
      v-bind:parent="addUnderParent"
      v-on:close="closeAddUnderModal()"
    >
    </AddCategoryUnderModal>
  </v-container>
</template>

<script lang="ts">
import AddCategoryUnderModal from "./AddCategoryUnderModal.vue";
import FrameworkCategoryController from "@/controllers/framework/FrameworkCategoryController";
import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import flash, { FlashType } from "@/modules/flash/Flash";
import Vue from "vue";
export default Vue.extend({
  name: "SimpleCategoryTreeView",

  components: {
    AddCategoryUnderModal,
  },

  props: {
    actualCategoryId: String,
  },

  data: () => ({
    active: {} as FrameworkCategory,
    items: [] as FrameworkCategory[],

    selectedItemId: "",
    loadingCategories: false,

    // Quick Modal add under
    addUnderParent: {} as FrameworkCategory,
    categoryAddUnderModal: false,
  }),

  mounted() {
    this.getRoots();
  },

  methods: {
    reset() {
      this.selectedItemId = "";
    },

    openAddUnderModal(item: FrameworkCategory) {
      this.addUnderParent = item;
      this.categoryAddUnderModal = true;
    },

    closeAddUnderModal() {
      this.categoryAddUnderModal = false;
      this.addUnderParent = {} as FrameworkCategory;
      this.getRoots();
    },

    /**
     * Get roots items
     */
    async getRoots() {
      this.loadingCategories = true;
      try {
        const response = await FrameworkCategoryController.getRoots();
        if (response.isSuccess()) {
          this.items = [];
          const roots = response.getData();

          // Get children
          for (const i of roots) {
            const y = await this.fetchCategory(i);
            this.items.push(await this.recursiveLoad(y));
          }
        } else {
          throw response.getErrorsAsString();
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get root of the Category tree",
          body: String(err),
        });
      } finally {
        this.loadingCategories = false;
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

    selectCategory(item: FrameworkCategory) {
      if (!item || !item._id) return;
      this.selectedItemId = item._id;
      this.$emit("selected", item);
    },
  },

  watch: {
    actualCategoryId: {
      handler() {
        this.selectedItemId = this.actualCategoryId;
      },
    },
  },
});
</script>

<style scoped></style>
