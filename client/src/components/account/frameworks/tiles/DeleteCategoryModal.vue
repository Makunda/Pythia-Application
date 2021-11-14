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
          <p class="text-h5">Delete a category</p>
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
              <p class="text-h5 ml-2 mt-4">
                You're about the delete the category {{ toDelete.title }}
              </p>
            </v-row>
            <v-row>
              <p class="text-subtitle-1 ml-2 mt-4">
                This action cannot be undone, be careful.
              </p>
              <p class="text-subtitle-1 ml-2 mt-4">
                All the frameworks attached to this category will be flagged as
                unknown.
              </p>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="mr-3" color="deepBlue" outlined @click="close()"
            >Close</v-btn
          >
          <v-btn color="warning" dark @click="save()"
            >Delete the category</v-btn
          >
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
  name: "DeleteCategoryModal",

  props: {
    show: Boolean, // Should not be modified by child
    category: Object,
  },

  mounted() {
    this.toDelete = this.category;
  },

  methods: {
    async save() {
      try {
        if (!this.toDelete._id) {
          return;
        }

        const response = await FrameworkCategoryController.deleteCategory(
          this.toDelete._id,
        );

        if (response.isSuccess()) {
          flash.commit("add", {
            type: FlashType.INFO,
            title: "Category deleted successfully.",
            body: "",
          });

          this.$emit("close");
        } else {
          throw response.getErrorsAsString();
        }
      } catch (err) {
        console.error("Failed to delete the category.", err);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to delete the category.",
          body: err,
        });
      }
    },

    close() {
      this.$emit("close");
    },
  },

  data: () => ({
    toDelete: {
      title: "",
      level: 0,
      description: "",
      isRoot: false,
      parent: null,
      tags: [],
    } as FrameworkCategory,

    loadingCreation: false,
    creationErrors: "",
  }),

  watch: {
    category: {
      handler() {
        this.toDelete = this.category;
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
