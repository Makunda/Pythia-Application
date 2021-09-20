<template>
  <v-container class="pt-12" style="max-width: 60vw">
    <!-- Display if no framework was found -->
    <v-row v-if="loadingFrameworks" class="d-flex justify-space-between ">
      <v-progress-circular
        size="50"
        color="primary"
        indeterminate
    ></v-progress-circular>
    </v-row>
    <v-row v-if="!loadingFrameworks && frameworkList.length == 0">
      <p><i>No framework to show...</i></p>
    </v-row>
    <v-row v-for="(framework, i) in frameworkList" :key="i" class="text-center">
      <v-sheet color="white" elevation="1" height="100" rounded width="100">
        {{ framework.name }}
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Framework } from "@/interface/Framework/Framework";
import Logger from "@/utils/Logger";
import Vue from "vue";
import FrameworkController from "../../controllers/framework/FrameworkController";
import flash, { FlashType } from "../../modules/flash/Flash";

export default Vue.extend({
  name: "FrameworkList",

  mounted() {
    this.getPoularFrameworks(); // retrieve list
  },

  methods: {
    /**
     * Get popular frameworks list
     */
    async getPoularFrameworks() {
      this.loadingFrameworks = true;

    try {
        const response = await FrameworkController.getPopularFrameworkList(20);

        if (response.isSuccess()) {
          this.frameworkList = response.getData();
        } else {
          // Display an error
          const errors = response.getErrors();
          for (const err of errors) {
            Logger.error("Failed to get the framework list.", err);
            flash.commit("add", {
              type: FlashType.ERROR,
              title: "Failed to get the framework list.",
              body: err,
            });
          }
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the framework list.",
          body: err,
        });
      } finally {
        this.loadingFrameworks = false;
      }
    },
  },

  data: () => ({
    loadingFrameworks: false,
    frameworkList: [] as Framework[],
  }),
});
</script>
