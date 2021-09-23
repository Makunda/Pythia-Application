<template>
  <v-container class="custom-modal pa-z ma-2">
    <v-row class="mp-3 header-row">
      <v-col cols="12" class="d-flex flex-row justify-space-between mt-3">
        <p class="text-h5">View a Framework</p>
          
      </v-col>
      <v-divider></v-divider>
    </v-row>

    <!-- Form -->
    <!-- Name -->
    <v-row>
      <v-col cols="12" md="4">
        <v-subheader>Name of the Framework as it will be displayed</v-subheader>
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field v-model="framework.name" required outlined></v-text-field>
      </v-col>
    </v-row>

    <!-- Location  -->
    <v-row>
      <v-col cols="12" md="4">
        <v-subheader
          >Provide the repository or the website of the Framework where it can
          be found.</v-subheader
        >
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="framework.location"
          required
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Description  -->
    <v-row>
      <v-col cols="12" md="4">
        <v-subheader
          >Provide a description of what the framework is doing, how it should
          be handled etc..</v-subheader
        >
      </v-col>
      <v-col cols="12" md="8">
        <v-textarea
          v-model="framework.description"
          outlined
          counter
          readonly
          full-width
          single-line
        ></v-textarea>
      </v-col>
    </v-row>

    <!-- Tags -->
    <v-row>
      <v-col cols="12" md="4">
        <v-subheader
          >Enrich your entry with tags, to facilitate the classification of the
          framework</v-subheader
        >
      </v-col>
      <v-col cols="12" md="8">
        <v-combobox
          v-model="framework.tags"
          multiple
          chips
          readonly
          dense
          outlined
          clearable
          return-object
          label="Add tags on the framework"
          persistent-hint="Example: Java, Decomission, UI Modernization, etc..."
        >
        </v-combobox>
      </v-col>
    </v-row>

    <!-- Patterns -->
    <v-row>
      <v-col cols="12" md="4">
        <v-subheader>Provide a pattern to match it in the code </v-subheader>
      </v-col>
    </v-row>

    <!--Pattern creation -->
    <v-row class="mr-3">
      <v-col cols="1"><strong>ID</strong></v-col>
      <v-col cols="3"><strong>Language</strong></v-col>
      <v-col cols="6"><strong>Pattern</strong></v-col>
      <v-col cols="é"><strong>Is Regex</strong></v-col>
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
        ><strong style="margin-top: -1px">#{{ i }}</strong></v-col
      >
      <v-col cols="3">
        <v-autocomplete
          v-model="framework.patterns[i].language"
          :items="languageItems"
          outlined
          readonly
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
          readonly
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-checkbox
          readonly
          v-model="framework.patterns[i].isRegex"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-container>
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
  name: "ViewSingleFramework",

  props: {
    id: String, // Should not be modified by child
  },

  mounted() {
    this.getFramework();
  },

  methods: {
    async getFramework() {
      try {
        // Implement with this.id
      } catch (err) {
        Logger.error("Failed to get the framework.", err);
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the framework.",
          body: err,
        });
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
  }),
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



.header-row {
  background-color: #f4f4f4;
}
</style>
