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
          <p class="text-h5">Create a Framework</p>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="close()"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <!-- Form -->
            <!-- Name -->
            <v-row>
              <p class="text-h5 ml-2 mt-4">Framework Information</p>
            </v-row>
            <v-row class="py-0 pt-4">
              <strong class="text-subtitle-1 framework-title"
                >Framework's name</strong
              >
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Name of the Framework as it will be displayed</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="framework.name"
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Name of the Framework as it will be displayed in CAST
                  Imaging</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="framework.imagingName"
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Location  -->
            <v-row class="py-0">
              <strong class="text-subtitle-1 framework-title"
                >Framework's location</strong
              >
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Provide the repository or the website of the Framework where
                  it can be found.</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="framework.location"
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Description  -->
            <v-row class="py-0">
              <strong class="text-subtitle-1 framework-title"
                >Framework's description</strong
              >
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Provide a description of what the framework is doing, how it
                  should be handled etc..</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-textarea
                  v-model="framework.description"
                  outlined
                  counter
                  full-width
                  single-line
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Tags -->
            <v-row class="py-0">
              <strong class="text-subtitle-1 framework-title"
                >Framework's category</strong
              >
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-subheader
                  >Enrich your entry with tags, to facilitate the classification
                  of the framework</v-subheader
                >
              </v-col>
              <v-col cols="12" md="8">
                <v-combobox
                  v-model="framework.tags"
                  :items="tagList"
                  :loading="isLoadingTags"
                  :search-input.sync="searchTags"
                  multiple
                  chips
                  dense
                  outlined
                  clearable
                  return-object
                  label="Add tags on the framework"
                  hint="Example: Java, Decomission, UI Modernization, etc..."
                >
                </v-combobox>
              </v-col>
            </v-row>

            <v-row class="py-0">
              <strong class="text-subtitle-1 framework-title"
                >Additional information</strong
              >
            </v-row>
            <v-row>
              <v-col cols="12" md="8">
                <v-subheader
                  ><p>
                    Set the framework as a Root. If a framework is a root, all
                    its children will be considered as frameworks. Example:
                    <em>org.spring.</em> is a root then
                    <em>org.spring.batch</em> will be automatically flagged as a
                    framework (extracted as Spring Batch).
                  </p></v-subheader
                >
              </v-col>
              <v-col cols="12" md="4">
                <v-checkbox
                  class="pt"
                  :label="`Consider as root: ${framework.isRoot}`"
                  v-model="framework.isRoot"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="8">
                <v-subheader
                  >Set the framework as validated. A framework validated will be
                  automatically extracted in imaging.</v-subheader
                >
              </v-col>
              <v-col cols="12" md="4">
                <v-checkbox
                  v-model="framework.validated"
                  :label="`Is Validated : ${framework.validated}`"
                ></v-checkbox>
              </v-col>
            </v-row>

            <!-- Patterns -->
            <v-row>
              <p class="text-h5 pl-2">
                Provide a pattern to match it in the code
              </p>
            </v-row>

            <!--Pattern creation -->
            <v-row class="mr-3">
              <v-col cols="1"><strong>ID</strong></v-col>
              <v-col cols="3"><strong>Language</strong></v-col>
              <v-col cols="6"><strong>Pattern</strong></v-col>
              <v-col cols="1"><strong>Is Regex</strong></v-col>
              <v-col cols="1"><strong>Action</strong></v-col>
            </v-row>

            <v-row class="mr-3" v-if="!framework.patterns">
              <p class="text-h5">No pattern defined.</p>
              <v-btn text color="green" small>Add pattern</v-btn>
            </v-row>

            <v-row
              class="mr-3"
              v-show="framework.patterns"
              v-for="(pattern, i) in framework.patterns"
              :key="i"
            >
              <v-col cols="1"
                ><strong style="padding-top: 20px">#{{ i }}</strong></v-col
              >
              <v-col cols="3">
                <v-autocomplete
                  v-model="framework.patterns[i].language"
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
                  v-model="framework.patterns[i].pattern"
                  required
                  dense
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="1" class="pt-0">
                <v-checkbox
                  v-model="framework.patterns[i].isRegex"
                ></v-checkbox>
              </v-col>
              <v-col cols="1">
                <v-btn color="red" text @click="removePattern(i)"
                  ><v-icon>mdi-trash-can</v-icon></v-btn
                >
              </v-col>
            </v-row>

            <v-row v-if="framework.patterns">
              <v-btn text color="green" @click="addPattern()"
                >Add a pattern</v-btn
              >
            </v-row>

            <v-row class="pa-2">
              <v-spacer></v-spacer>
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
import FrameworkController from "@/controllers/framework/FrameworkController";
import LanguageController from "@/controllers/language/LanguageController";
import { FrameworkCreation } from "@/interface/framework/Framework";
import { Pattern } from "@/interface/framework/Pattern";
import Language from "@/interface/language/Language";
import flash, { FlashType } from "@/modules/flash/Flash";
import Logger from "@/utils/Logger";
import Vue from "vue";

export default Vue.extend({
  name: "AddFrameworkModal",

  props: {
    show: Boolean, // Should not be modified by child
  },

  mounted() {
    this.loadLanguages();
  },

  methods: {
    // Remove a pattern from the framework detection
    removePattern(position: number) {
      if (!this.framework.patterns) this.framework.patterns = [];
      if (position > this.framework.patterns.length) return;

      this.framework.patterns.splice(position, 1);
    },

    // Add a pattern to the list
    addPattern() {
      // Emtpy list
      if (!this.framework.patterns) this.framework.patterns = [];

      // Push patterns
      this.framework.patterns.push({
        language: "",
        pattern: "",
        isRegex: true,
      });
    },

    async save() {
      try {
        await FrameworkController.createFramework(this.framework);

        flash.commit("add", {
          type: FlashType.INFO,
          title: "Framework created successfully.",
          body: "",
        });

        this.$emit("close");
      } catch (err) {
        Logger.error("Failed to create the framework.", err);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to create the framework.",
          body: err,
        });
      }
    },

    close() {
      this.$emit("close");
    },

    // Request Language
    async loadLanguages() {
      this.loadingLanguage = true;

      try {
        const resp = await LanguageController.getLanguages();

        if (resp.isSuccess()) {
          this.languageItems = resp.getData();
        } else {
          Logger.error(
            "Failed to retrieve the languages.",
            resp.getErrors()[0],
          );
          flash.commit("add", {
            type: FlashType.ERROR,
            title: "Failed to retrieve the language.",
            body: resp.getErrors(),
          });
        }
      } catch (err) {
        Logger.error("Failed to retrieve the languages.", err);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to retrieve the languages.",
          body: err,
        });
      } finally {
        this.loadingLanguage = false;
      }
    },
  },

  data: () => ({
    framework: {
      name: "",
      description: "",
      location: "",

      patterns: [
        {
          language: "",
          pattern: "",
          isRegex: true,
        },
      ] as Pattern[],
      tags: [],
    } as FrameworkCreation,

    // Tags selection
    tagList: [] as string[],
    searchTags: [],
    isLoadingTags: false,

    // Language Selection
    loadingLanguage: false,
    languageItems: [] as Language[],
    searchLanguage: "",
  }),
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
