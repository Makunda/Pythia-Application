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

    <!-- Treeview -->
    <v-row>
      <v-treeview
        class="mt-4"
        style="width: 100%"
        :active.sync="active"
        :items="categories"
        :load-children="fetchCategory"
        :open.sync="open"
        item-text="title"
        open-all
        open-on-click
        transition
      >
        <template v-slot:label="{ item }">
          <v-card
            width="100%"
            height="52px"
            dark
            :color="item.isRoot ? 'lessDeepBlue' : 'lightDeepBlue'"
            style="padding-top: 12px"
          >
            <v-card-title class="py-0">
              <p class="text-subtitle-1">{{ item.title }}</p>
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

    <v-row> </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FrameworkMetadataController from "@/controllers/framework/FrameworkMetadataController";
import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import AddCategoryModal from "./AddCategoryModal.vue";
import FrameworkCategoryController from "@/controllers/framework/FrameworkCategoryController";
import flash, { FlashType } from "@/modules/flash/Flash";
export default Vue.extend({
  name: "ClassificationTable",

  components: {
    AddCategoryModal,
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
     * Get the categories attached to one item and store them in .children
     */
    async fetchCategory(item: FrameworkCategory) {
      try {
        if (!item._id) return;

        const response = await FrameworkCategoryController.getChildrenById(
          item._id,
        );
        if (response.isSuccess()) {
          item.children = response.getData();
        } else {
          flash.commit("add", {
            type: FlashType.ERROR,
            title: "Failed to update the profile",
            body: response.getErrorsAsString(),
          });
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to update the profile",
          body: String(err),
        });
      }
    },

    /**
     * Get roots items
     */
    async getRoots() {
      try {
        const response = await FrameworkCategoryController.getRoots();
        if (response.isSuccess()) {
          this.categories = response.getData();
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
      }
    },
  },

  data: () => ({
    technologiesList: [] as string[],
    active: [],
    open: [],
    categories: [] as FrameworkCategory[],

    // Modals
    categoryCreationModal: false,
  }),
});
</script>
