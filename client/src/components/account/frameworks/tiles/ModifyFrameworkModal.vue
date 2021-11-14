<template>
  <v-dialog
    :value="show"
    transition="dialog-top-transition"
    max-width="800"
    scrollable
  >
    <template v-slot:default="">
      <v-card>
        <v-card-title>
          <v-toolbar color="lessDeepBlue" dark>
            <p class="text-h5 ml-2 mt-2">Edit a Framework</p>
            <v-spacer></v-spacer>
            <v-btn color="warning" text @click="close()"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-container>
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

            <!-- Validation -->
            <v-row class="py-6">
              <v-col class="py-0" cols="12" md="8">
                <v-subheader
                  ><p>
                    <strong>Validate the framework</strong>
                    <br />
                    A validated framework will be flagged during discoveries
                  </p></v-subheader
                >
              </v-col>
              <v-col class="pa-0" cols="12" md="4">
                <v-checkbox
                  class="pt"
                  :label="`Consider as valid: ${editedFramework.validated}`"
                  v-model="editedFramework.validated"
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
import SimpleCategoryTreeView from "@/components/account/frameworks/tiles/SimpleCategoryTreeView.vue";
import FrameworkController from "@/controllers/framework/FrameworkController";
import FrameworkReviewController from "@/controllers/framework/FrameworkReviewController";
import PatternController from "@/controllers/framework/PatternController";
import LanguageController from "@/controllers/language/LanguageController";
import User from "@/interface/account/User";
import { Framework, FrameworkCreation } from "@/interface/framework/Framework";
import FrameworkCategory from "@/interface/framework/FrameworkCategory";
import { Pattern } from "@/interface/framework/Pattern";
import Language from "@/interface/language/Language";
import flash, { FlashType } from "@/modules/flash/Flash";
import Logger from "@/utils/Logger";
import Vue from "vue";

export default Vue.extend({
  name: "ModifyFrameworkModal",

  props: {
    show: Boolean, // Should not be modified by child
    framework: Object,
  },

  components: {
    SimpleCategoryTreeView,
  },

  async mounted() {
    await this.loadLanguages();
    this.editedFramework = Object.assign({}, this.framework);
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

    selectCategory(event: any) {
      if (typeof event == "undefined") {
        return;
      }

      this.selectedCategoryTitle = event.title;
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

    // Validate and save
    async saveAndValidate() {
      if (!this.editedFramework) return;
      this.loadingsave = true;
      try {
        const response = await FrameworkController.updateFramework(
          this.editedFramework,
          this.editedFrameworkPatterns,
        );
        if (!response.isSuccess()) throw response.getErrorsAsString();

        // Slice the table
        this.close();
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to delete the framework.",
          body: err,
        });
      } finally {
        this.loadingsave = false;
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
        this.close();
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to delete the framework.",
          body: err,
        });
      } finally {
        this.loadingDelete = false;
      }
    },

    close() {
      this.$emit("close");
    },
  },

  data: () => ({
    editedFramework: {
      _id: "",
      name: "",
      imagingName: "",
      description: "",
      location: "",

      isRoot: false,
      validated: false,
      detectionData: "",
      createdByUser: false,
      tags: [],

      creator: {} as User,
      level5: "",
      level4: "",
      level3: "",
      level2: "",
      level1: "",

      createdOn: 0,
      lastModified: 0,

      timestamp: 0,
      views: 0,
    } as Framework,

    editedFrameworkPatterns: [] as Pattern[],
    selectedCategoryTitle: "No Category has been selected",

    loadingsave: false,
    loadingDelete: false,

    // Languages
    loadingLanguage: false,
    languageItems: [] as Language[],

    // Deleting patterns
    loadingDeletePattern: false,
  }),

  // Watch
  watch: {
    framework: {
      async handler() {
        this.editedFramework = Object.assign({}, this.framework);
        this.getPatterns();
      },
    },
  },
});
</script>

<style scoped>
.framework-title {
  padding-left: 20px;
  margin: 0;
}

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
</style>
