<template>
  <v-dialog
    :value="show"
    transition="dialog-top-transition"
    max-width="1200"
    scrollable
  >
    <template v-slot:default="">
      <v-card>
        <v-toolbar color="lessDeepBlue" dark>
          <p class="text-h5">Edit a category</p>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="close()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <!-- Form -->
            <!-- Title -->
            <v-row>
              <p class="text-h5 ml-2 mt-4">Category Information</p>
            </v-row>
            <v-row class="py-0">
              <v-col class="py-0" cols="12" md="4">
                <v-subheader
                  ><p>
                    Title of the category as it will be displayed.
                  </p></v-subheader
                >
              </v-col>
              <v-col class="py-0" cols="12" md="8">
                <v-text-field
                  v-model="editedCategory.title"
                  dense
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Description  -->
            <v-row class="py-0">
              <strong class="text-subtitle-1 custom-title"
                >Category's description</strong
              >
            </v-row>

            <!-- Des -->
            <v-row class="py-0">
              <v-col class="py-0" cols="12" md="4">
                <v-subheader
                  ><p>
                    Provide a description of what is the purpose of this
                    category.
                  </p></v-subheader
                >
              </v-col>
              <v-col class="py-0" cols="12" md="8">
                <v-textarea
                  v-model="editedCategory.description"
                  outlined
                  dense
                  counter
                  full-width
                  single-line
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Tags -->
            <v-row class="py-0">
              <v-col class="py-0" cols="12" md="4">
                <v-subheader
                  ><p>
                    Enrich your entry with tags, to facilitate the search of the
                    category
                  </p></v-subheader
                >
              </v-col>
              <v-col class="py-0" cols="12" md="8">
                <v-combobox
                  v-model="editedCategory.tags"
                  multiple
                  chips
                  dense
                  outlined
                  clearable
                  return-object
                  label="Add tags on the category"
                  hint="Example: Java, Decomission, UI Modernization, etc..."
                >
                </v-combobox>
              </v-col>
            </v-row>

            <!--  Root and parent -->
            <v-row class="py-0">
              <strong class="text-subtitle-1 custom-title"
                ><p>Additional information</p></strong
              >
            </v-row>
            <v-row class="py-0">
              <v-col class="py-0" cols="12" md="8">
                <v-subheader
                  ><p>
                    Set the category as a Root. If the category is a root, it
                    cannot be linked to a parent. Also a root cannot be deleted
                    is it still has categories attahced to it.
                  </p></v-subheader
                >
              </v-col>
              <v-col class="py-0" cols="12" md="4">
                <v-checkbox
                  dense
                  class="pt"
                  :label="`Consider as root: ${category.isRoot}`"
                  v-model="editedCategory.isRoot"
                ></v-checkbox>
              </v-col>
            </v-row>

            <!-- Parent selection -->
            <v-row class="py-0">
              <v-col class="py-0" cols="12" md="4">
                <v-expand-transition>
                  <v-subheader v-show="!editedCategory.isRoot"
                    >Select the parent category:
                  </v-subheader>
                </v-expand-transition>
              </v-col>
              <v-col class="py-0" cols="12" md="8">
                <v-expand-transition>
                  <v-autocomplete
                    v-show="!editedCategory.isRoot"
                    :value="editedCategory.parent"
                    v-model="parentId"
                    :items="parentChoice"
                    :loading="isLoading"
                    :search-input.sync="searchText"
                    dense
                    hide-details
                    hide-selected
                    cache-items
                    item-text="title"
                    item-value="_id"
                    label="Select a parent"
                    placeholder="Start typing to Search"
                    outlined
                    return-object
                  ></v-autocomplete>
                </v-expand-transition>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="mr-3" color="red" outlined @click="close()"
            >Close</v-btn
          >
          <v-btn color="green" dark @click="save()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import FrameworkCategoryController from "@/controllers/framework/FrameworkCategoryController";
import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import flash, { FlashType } from "@/modules/flash/Flash";
import Vue from "vue";

export default Vue.extend({
  name: "EditCategoryModal",

  props: {
    show: Boolean, // Should not be modified by child
    category: Object,
  },

  mounted() {
    this.editedCategory = this.category;
  },

  methods: {
    // Add a pattern to the list
    async searchParent() {
      // Emtpy list
      this.isLoading = true;
      try {
        const resp = await FrameworkCategoryController.searchCategories(
          this.searchText,
          30,
        );
        if (resp.isSuccess()) this.parentChoice = resp.getData();
      } catch (ignored) {
      } finally {
        this.isLoading = false;
      }
    },

    async save() {
      try {
        const response = await FrameworkCategoryController.updateCategory(
          this.editedCategory,
          this.parentId,
        );

        if (response.isSuccess()) {
          flash.commit("add", {
            type: FlashType.INFO,
            title: "Category edited successfully.",
            body: "",
          });

          this.$emit("close");
        } else {
          throw response.getErrorsAsString();
        }
      } catch (err) {
        console.error("Failed to edit the category.", err);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to edit the category.",
          body: err,
        });
      }
    },

    close() {
      this.$emit("close");
    },
  },

  data: () => ({
    editedCategory: {
      title: "",
      description: "",
      isRoot: false,
      parent: null,
      tags: [],
    } as FrameworkCategory,

    parentId: "",
    searchText: "",
    parentChoice: [] as FrameworkCategory[],
    isLoading: false,

    loadingCreation: false,
    creationErrors: "",
  }),

  watch: {
    searchText: {
      handler() {
        this.searchParent();
      },
    },

    category: {
      handler() {
        this.editedCategory = this.category;
        this.parentId = this.category.parent;
      },
    },
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.custom-modal {
  position: absolute;
  background-color: white;
  border: #78909c 1px solid;
  width: 80%;
  border-radius: 20px;
  top: 10px;
  right: -8px;
  margin-top: 20px;

  transition: opacity 0.5s;
}

.header-row {
  background-color: #f4f4f4;
  border-radius: 20px;
}

.custom-title {
  padding-left: 20px;
  margin: 0;
}
</style>
