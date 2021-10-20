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
          <p class="text-h5">
            Create a new category under > {{ parent.title }}
          </p>
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
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Title of the category as it will be displayed</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="category.title"
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
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Provide a description of what is the purpose of this
                  category.</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-textarea
                  v-model="category.description"
                  outlined
                  counter
                  full-width
                  single-line
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Tags -->
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Enrich your entry with tags, to facilitate the search of the
                  category</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-combobox
                  v-model="category.tags"
                  multiple
                  chips
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
                >Additional information</strong
              >
            </v-row>

            <!-- Parent selection -->
            <v-row>
              <v-col cols="12" md="4">
                <v-expand-transition>
                  <v-subheader v-show="!category.isRoot"
                    >The category will be created under:
                  </v-subheader>
                </v-expand-transition>
              </v-col>
              <v-col cols="12" md="8">
                <v-expand-transition>
                  <v-text-field
                    label="Parent path"
                    :value="parent.title"
                    readonly
                    outlined
                  ></v-text-field>
                </v-expand-transition>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="mr-3" color="red" outlined @click="close()"
            >Close</v-btn
          >
          <v-btn color="green" dark @click="save()">Create</v-btn>
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
  name: "AddCategoryUnderModal",

  props: {
    show: Boolean, // Should not be modified by child
    parent: Object,
  },

  methods: {
    async save() {
      try {
        const parentId = this.parent._id ? this.parent._id : null;
        const response = await FrameworkCategoryController.createCategory(
          this.category,
          parentId,
        );

        if (response.isSuccess()) {
          flash.commit("add", {
            type: FlashType.INFO,
            title: "Category created successfully.",
            body: "",
          });

          this.$emit("close");
        } else {
          throw response.getErrorsAsString();
        }
      } catch (err) {
        console.error("Failed to create the category.", err);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to create the category.",
          body: err,
        });
      }
    },

    close() {
      this.$emit("close");
    },
  },

  data: () => ({
    category: {
      title: "",
      description: "",
      isRoot: false,
      parent: null,
      tags: [],
    } as FrameworkCategory,

    loadingCreation: false,
    creationErrors: "",
  }),

  watch: {
    show: {
      handler() {
        this.category = {
          title: "",
          description: "",
          isRoot: false,
          parent: null,
          tags: [],
        } as FrameworkCategory;
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
