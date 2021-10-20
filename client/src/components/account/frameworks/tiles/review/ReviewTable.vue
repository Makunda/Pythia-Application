<template>
  <v-container>
    <v-row>
      <p class="text-h6 mt-4">
        {{ numberToReview }} frameworks need to be reviewed.
      </p>
    </v-row>
    <v-row class="pa-0">
      <!-- Left column listing the frameworks -->
      <v-col class="pa-0" cols="12" md="3">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">To be review</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in toReviewFrameworks"
                :key="i"
                :class="i == editIndex ? 'highlighted-cell' : ''"
                @click="editItem(i)"
              >
                <td>{{ item.name }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <!-- Review panel -->
      <v-col class="pa-0" cols="12" md="9">
        <v-expand-transition>
          <v-container v-show="editIndex >= 0">
            <!-- Power Actions -->
            <v-row class="pl-3 pb-0">
              <p class="text-h6">Quick Actions</p>
            </v-row>
            <v-row class="pl-3 mb-4">
              <v-col
                ><v-btn
                  large
                  dark
                  block
                  color="warning"
                  :disabled="loadingsave"
                  :loading="loadingDelete"
                  @click="deleteCurrentFramework"
                >
                  DELETE
                </v-btn></v-col
              >
              <v-col
                ><v-btn
                  large
                  dark
                  block
                  @click="ignoreElement"
                  :disabled="loadingsave || loadingDelete"
                  color="lessDeepBlue"
                >
                  IGNORE
                </v-btn></v-col
              >
              <v-col
                ><v-btn
                  large
                  dark
                  block
                  color="green"
                  @click="saveAndValidate"
                  :disabled="loadingDelete"
                  :loading="loadingsave"
                >
                  SAVE & VALIDATE
                </v-btn></v-col
              >
            </v-row>

            <!-- Informations  -->
            <v-row class="pl-6">
              <p class="text-h6">Framework Informations</p>
            </v-row>

            <!-- Name -->
            <v-row>
              <v-col class="py-0" cols="12" md="4">
                <v-subheader
                  ><p>
                    <strong>Name of the Framework</strong> as it will be
                    displayed
                  </p></v-subheader
                >
              </v-col>
              <v-col class="py-0" cols="12" md="8">
                <v-text-field
                  v-model="editedFramework.name"
                  required
                  dense
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Imaging Name -->
            <v-row class="py-0">
              <v-col class="py-0" cols="12" md="4">
                <v-subheader
                  ><p>
                    <strong>Name of the group</strong> to create in Imaging
                  </p>
                </v-subheader>
              </v-col>
              <v-col class="py-0" cols="12" md="8">
                <v-text-field
                  v-model="editedFramework.imagingName"
                  required
                  dense
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Is Root -->
            <v-row class="py-6">
              <v-col class="py-0" cols="12" md="8">
                <v-subheader
                  ><p>
                    <strong>Set the framework as a Root.</strong>
                    <br />
                    If a framework is a root, all its children will be
                    considered as frameworks. Example:
                    <em>org.springframework.</em> is a root then
                    <em>org.springframework.batch</em> will be automatically
                    flagged as a framework (extracted as Spring Batch).
                  </p></v-subheader
                >
              </v-col>
              <v-col class="pa-0" cols="12" md="4">
                <v-checkbox
                  class="pt"
                  :label="`Consider as root: ${editedFramework.isRoot}`"
                  v-model="editedFramework.isRoot"
                ></v-checkbox>
              </v-col>
            </v-row>

            <!-- Category -->
            <v-row class="pl-3">
              <v-subheader>
                <p>
                  <strong>Category</strong> of the framework:
                  {{ selectedCategoryTitle }}
                </p>
              </v-subheader>
            </v-row>
            <v-row>
              <SimpleCategoryTreeView
                v-on:selected="selectCategory($event)"
                ref="categoryViewer"
              >
              </SimpleCategoryTreeView>
            </v-row>

            <!-- Location -->
            <v-row class="pt-5">
              <v-col cols="12" md="4">
                <v-subheader
                  ><p>
                    <strong>Location</strong> of the framework (Website,
                    repository, etc..)
                  </p>
                </v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="editedFramework.location"
                  required
                  dense
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Description -->
            <v-row>
              <v-col class="py-0" cols="12" md="4">
                <v-subheader
                  ><p><strong>Description</strong> of the framework:</p>
                </v-subheader>
              </v-col>
              <v-col cols="12" md="8">
                <v-textarea
                  v-model="editedFramework.description"
                  outlined
                  counter
                  full-width
                  single-line
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Patterns -->
            <v-row class="pl-3 py-0">
              <v-subheader>
                <p>
                  <strong>Review detection patterns </strong> of the framework:
                </p>
              </v-subheader>
            </v-row>

            <!--  Patterns informations  -->
            <v-row class="mr-3 py-0">
              <v-col cols="1"><v-subheader>ID</v-subheader></v-col>
              <v-col cols="3"><v-subheader>Language</v-subheader></v-col>
              <v-col cols="6"><v-subheader>Pattern</v-subheader></v-col>
              <v-col cols="1"><v-subheader>Is Regex</v-subheader></v-col>
              <v-col cols="1"><v-subheader>Action</v-subheader></v-col>
            </v-row>

            <v-row class="mr-3 pl-3" v-if="!editedFramework.patterns">
              <v-subheader>No pattern defined.</v-subheader>
              <v-btn text color="green" small>Add pattern</v-btn>
            </v-row>

            <v-row
              class="mr-3 pl-3"
              v-show="editedFramework.patterns"
              v-for="(pattern, i) in editedFramework.patterns"
              :key="i"
            >
              <v-col cols="1"
                ><v-subheader class="pt-0" style="padding: 5px"
                  >#{{ i }}</v-subheader
                ></v-col
              >
              <v-col cols="3">
                <v-autocomplete
                  v-model="editedFramework.patterns[i].language"
                  :items="languageItems"
                  outlined
                  :loading="loadingLanguage"
                  dense
                  item-text="name"
                  item-value="name"
                  label="Pick a language"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editedFramework.patterns[i].pattern"
                  required
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="pt-0">
                <v-checkbox
                  v-model="editedFramework.patterns[i].isRegex"
                ></v-checkbox>
              </v-col>
              <v-col cols="1">
                <v-btn color="red" text @click="removePattern(i)"
                  ><v-icon>mdi-trash-can</v-icon></v-btn
                >
              </v-col>
            </v-row>

            <v-row class="pt-0 pl-3" v-if="editedFramework.patterns">
              <v-btn text color="green" @click="addPattern()"
                >Add a pattern</v-btn
              >
            </v-row>
          </v-container>
        </v-expand-transition>
      </v-col>
    </v-row>
    <!-- Define inputs -->
    <input v-on:keyup.left="goBack" />
    <input v-on:keyup.right="ignoreElement" />
  </v-container>
</template>

<script lang="ts">
import { Framework } from "@/interface/framework/Framework";

import Vue from "vue";
import SimpleCategoryTreeView from "../SimpleCategoryTreeView.vue";
import FrameworkController from "@/controllers/framework/FrameworkController";
import FrameworkReviewController from "@/controllers/framework/FrameworkReviewController";
import flash, { FlashType } from "@/modules/flash/Flash";
import Logger from "@/utils/Logger";
import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import LanguageController from "@/controllers/language/LanguageController";
import Language from "@/interface/language/Language";

export default Vue.extend({
  name: "ReviewTable",

  components: {
    SimpleCategoryTreeView,
  },

  data: () => ({
    editedFramework: {} as Framework,
    numberToReview: 0,
    toReviewFrameworks: [] as Framework[],
    editIndex: 0,

    selectedCategoryTitle: "No Category has been selected",

    loadingsave: false,
    loadingDelete: false,

    // Languages
    loadingLanguage: false,
    languageItems: [] as Language[],
  }),

  mounted() {
    this.getnumberToReview();
    this.getFrameworkList();
    this.loadLanguages();
  },

  methods: {
    // Request Language
    async loadLanguages() {
      this.loadingLanguage = true;

      try {
        const resp = await LanguageController.getLanguages();

        if (resp.isSuccess()) {
          this.languageItems = resp.getData();
        } else {
          throw resp.getErrorsAsString();
        }
      } catch (err) {
        Logger.error("Failed to retrieve the languages.", String(err));
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to retrieve the languages.",
          body: err,
        });
      } finally {
        this.loadingLanguage = false;
      }
    },

    // Remove a pattern from the framework detection
    removePattern(position: number) {
      if (!this.editedFramework.patterns) this.editedFramework.patterns = [];
      if (position > this.editedFramework.patterns.length) return;

      this.editedFramework.patterns.splice(position, 1);
    },

    // Add a pattern to the list
    addPattern() {
      // Emtpy list
      if (!this.editedFramework.patterns) this.editedFramework.patterns = [];

      // Push patterns
      this.editedFramework.patterns.push({
        language: "",
        pattern: "",
        isRegex: true,
      });
    },

    selectCategory(event: any) {
      if (typeof event == "undefined") {
        return;
      }

      this.selectedCategoryTitle = event.title;
      this.editedFramework.category = event;
    },

    editItem(i: number) {
      // Ignore if loading an action
      if (this.loadingDelete || this.loadingsave) return;

      this.editedFramework = this.toReviewFrameworks[i];
      this.editIndex = i;

      const catViewer = this.$refs.categoryViewer;
      if (catViewer) (catViewer as any).reset();

      // refresh variables
      const element = this.toReviewFrameworks[this.editIndex];
      if (typeof element.category !== "undefined") {
        this.selectedCategoryTitle = element.category.title;
      } else {
        this.selectedCategoryTitle = "No Category has been selected";
      }
    },

    ignoreElement() {
      this.editIndex++;
      this.refreshIndex();
    },

    goBack() {
      this.editIndex--;
      this.refreshIndex();
    },

    refreshIndex() {
      if (this.editIndex <= -1) {
        this.editIndex = -1;
        this.editedFramework = {} as Framework;
      }

      if (this.editIndex > this.toReviewFrameworks.length - 1)
        this.editIndex = this.toReviewFrameworks.length - 1;

      if (this.editIndex >= 0)
        this.editedFramework = this.toReviewFrameworks[this.editIndex];
    },

    async saveAndValidate() {
      if (!this.editedFramework) return;
      this.editedFramework.validated = true;

      this.loadingsave = true;
      try {
        // Get the category
        let categoryId = null;
        if (typeof this.editedFramework.category != "undefined") {
          categoryId = this.editedFramework.category._id;
        }

        const response = await FrameworkController.updateFramework(
          this.editedFramework,
          categoryId,
        );
        if (!response.isSuccess()) throw response.getErrorsAsString();

        // Slice the table
        this.toReviewFrameworks.splice(this.editIndex, 1);
        this.refreshIndex();
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to delete the framework.",
          body: err,
        });
      } finally {
        this.loadingsave = false;
        this.getnumberToReview();
      }
    },

    /**
     * Delete framework
     */
    async deleteCurrentFramework() {
      if (!this.editedFramework._id) return;

      this.loadingDelete = true;
      try {
        const response = await FrameworkController.deleteFramework(
          this.editedFramework._id,
        );
        if (!response.isSuccess()) throw response.getErrorsAsString();

        // Slice the table
        this.toReviewFrameworks.splice(this.editIndex, 1);
        this.refreshIndex();
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to delete the framework.",
          body: err,
        });
      } finally {
        this.loadingDelete = false;
        this.getnumberToReview();
      }
    },

    /**
     * Get the number of framework to review
     * @todo Add filter ( see controller's method declaration )
     */
    async getnumberToReview() {
      try {
        const response = await FrameworkReviewController.getNumber();
        if (!response.isSuccess()) throw response.getErrorsAsString();

        this.numberToReview = response.getData();
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get number of framework to review.",
          body: err,
        });
      }
    },

    /**
     * Get the list of frameworks to review
     */
    async getFrameworkList() {
      try {
        const response = await FrameworkReviewController.getFrameworkList(30);
        if (!response.isSuccess()) throw response.getErrorsAsString();

        this.toReviewFrameworks = response.getData();

        if (this.toReviewFrameworks.length > 0) {
          this.editIndex = 0;
          this.editedFramework = this.toReviewFrameworks[0];
        } else {
          this.editIndex = -1;
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the list of framework to review.",
          body: err,
        });
      }
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

.highlighted-cell {
  background-color: lightgray;
}
</style>
