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
        <v-simple-table class="hover-table">
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
                :class="i == editIndex ? 'highlighted-cell' : 'standard-cell'"
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

            <!-- Location -->
            <v-row class="pt-5">
              <v-col cols="12" md="4" class="d-flex flex-column">
                <v-subheader
                  ><p class="pb-0 mb-0">
                    <strong>Location</strong> of the framework (Website,
                    repository, etc..)
                  </p>
                </v-subheader>
                <span>
                  <v-btn
                    class="ml-2"
                    x-small
                    text
                    color="primary"
                    @click="openTab()"
                  >
                    Open google
                  </v-btn>
                </span>
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  class="pb-0"
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
              <v-col cols="1"><v-subheader>Actions</v-subheader></v-col>
            </v-row>

            <v-row class="mr-3 pl-3" v-if="!editedFrameworkPatterns">
              <v-subheader>No pattern defined.</v-subheader>
              <v-btn text color="green" small>Add pattern</v-btn>
            </v-row>

            <v-row
              class="mr-3 pl-3"
              v-show="editedFrameworkPatterns"
              v-for="(pattern, i) in editedFrameworkPatterns"
              :key="i"
            >
              <v-col cols="1"
                ><v-subheader class="pt-0" style="padding: 5px"
                  >#{{ i }}</v-subheader
                ></v-col
              >
              <v-col cols="3">
                <v-autocomplete
                  v-model="editedFrameworkPatterns[i].language"
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
                  v-model="editedFrameworkPatterns[i].pattern"
                  required
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="pt-0">
                <v-checkbox
                  v-model="editedFrameworkPatterns[i].isRegex"
                ></v-checkbox>
              </v-col>
              <v-col cols="1" class="d-flex flex-row">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red"
                      icon
                      @click="removePattern(i)"
                      v-bind="attrs"
                      v-on="on"
                      ><v-icon>mdi-trash-can</v-icon></v-btn
                    >
                  </template>
                  <span>Delete this pattern</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ml-2"
                      color="red"
                      icon
                      @click="
                        deletePatternDuplicates(
                          editedFrameworkPatterns[i].pattern,
                          editedFrameworkPatterns[i].language.name ||
                            editedFrameworkPatterns[i].language,
                        )
                      "
                      v-bind="attrs"
                      v-on="on"
                      :loading="loadingDeletePattern"
                      ><v-icon>mdi-content-duplicate</v-icon></v-btn
                    >
                  </template>
                  <span
                    >Delete all the patterns with the same name.<br />
                    Be careful this framework may have been declared under
                    another name. Pattern: [{{
                      editedFrameworkPatterns[i].pattern
                    }}] - Language: [{{
                      editedFrameworkPatterns[i].language.name ||
                      editedFrameworkPatterns[i].language
                    }}]
                  </span>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row class="pt-0 pl-3" v-if="editedFrameworkPatterns">
              <v-btn text color="green" @click="addPattern()"
                >Add a pattern</v-btn
              >
            </v-row>

            <!--  Add another validation button  -->
            <v-row>
              <v-col offset-md="9" md="3">
                <v-btn
                  large
                  dark
                  block
                  color="green"
                  @click="saveAndValidate"
                  :disabled="loadingDelete"
                  :loading="loadingsave"
                >
                  SAVE & VALIDATE
                </v-btn>
              </v-col>
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
import FrameworkController from "@/controllers/framework/FrameworkController";
import FrameworkReviewController from "@/controllers/framework/FrameworkReviewController";
import flash, { FlashType } from "@/modules/flash/Flash";
import Logger from "@/utils/Logger";
import LanguageController from "@/controllers/language/LanguageController";
import PatternController from "@/controllers/framework/PatternController";
import Language from "@/interface/language/Language";
import { Pattern } from "@/interface/framework/Pattern";

export default Vue.extend({
  name: "ReviewTable",

  data: () => ({
    editedFramework: {} as Framework,
    editedFrameworkPatterns: [] as Pattern[],

    numberToReview: 0,
    toReviewFrameworks: [] as Framework[],
    editIndex: 0,

    loadingsave: false,
    loadingDelete: false,

    // Languages
    loadingLanguage: false,
    languageItems: [] as Language[],

    // Deleting patterns
    loadingDeletePattern: false,
  }),

  mounted() {
    this.getnumberToReview();
    this.getFrameworkList();
    this.loadLanguages();
  },

  methods: {
    // Open new tab
    openTab() {
      const search =
        this.editedFramework.imagingName || this.editedFramework.name;
      const url =
        "https://www.google.com/search?q=" + search.replaceAll(" ", "+");
      const w = window.open(url, "_blank");
      if (w) w.focus();
    },

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
      if (!this.editedFrameworkPatterns) this.editedFrameworkPatterns = [];
      if (position > this.editedFrameworkPatterns.length) return;

      this.editedFrameworkPatterns.splice(position, 1);
    },

    // Add a pattern to the list
    addPattern() {
      // Emtpy list
      if (!this.editedFrameworkPatterns) this.editedFrameworkPatterns = [];

      // Push patterns
      this.editedFrameworkPatterns.push({
        language: {} as Language,
        pattern: "",
        isRegex: true,
      });
    },

    // Get the list of pattern if the framework has been initialized
    async getPatterns() {
      if (!this.editedFramework || !this.editedFramework._id) return; // to edited item loaded

      // Else load patterns
      try {
        const response = await PatternController.getPatternByFrameworkId(
          this.editedFramework._id,
        );
        if (!response.isSuccess())
          throw new Error(response.getErrorsAsString());

        this.editedFrameworkPatterns = response.getData();
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the framework's pattern.",
          body: err,
        });
      }
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

    editItem(i: number) {
      // Ignore if loading an action
      if (this.loadingDelete || this.loadingsave) return;

      this.editedFramework = this.toReviewFrameworks[i];
      this.editIndex = i;
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

    // Validate and save
    async saveAndValidate() {
      if (!this.editedFramework) return;
      this.editedFramework.validated = true;

      this.loadingsave = true;
      try {
        const response = await FrameworkController.updateFramework(
          this.editedFramework,
          this.editedFrameworkPatterns,
        );
        if (!response.isSuccess()) throw response.getErrorsAsString();

        // Slice the table
        this.toReviewFrameworks.splice(this.editIndex, 1);
        this.refreshIndex();
        window.scrollTo(0, 0);
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
     * Delete all patterns with this name ( to avoid duplicates )
     */
    async deletePatternDuplicates(pattern: string, language: string) {
      if (!pattern || !language) return; // Ignore if fields are missing

      this.loadingDeletePattern = true;
      try {
        await PatternController.deletePattern(pattern, language);
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to delete the duplicate patterns.",
          body: err,
        });
      } finally {
        this.loadingDeletePattern = false;
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

  watch: {
    editedFramework: {
      handler() {
        this.getPatterns();
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

.highlighted-cell {
  background-color: lightgray;
}

.standard-cell:hover {
  background-color: rgb(187, 185, 185);
}

.hover-table {
  cursor: pointer;
}
</style>
