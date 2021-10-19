<template>
  <v-dialog :value="show" transition="dialog-top-transition" max-width="600">
    <template v-slot:default="">
      <v-card>
        <v-toolbar color="lessDeepBlue" dark>Remove Framework</v-toolbar>
        <v-card-text>
          <v-container>
            <v-row class="px-2 py-3">
              <div class="text-h6">
                You are about to remove a Framework. This action cannot be
                undone.
              </div>
            </v-row>
            <!-- Name entry  -->
            <v-row class="px-2 pt-2">
              <div class="text-subtitle-1">
                Framework: {{ framework.name }} with
                {{ framework.patterns ? framework.patterns.length : 0 }}
                patterns.
                {{
                  framework.description
                    ? `Description: ${framework.description}. `
                    : ""
                }}Framework accumulated {{ framework.views || 0 }} views.
              </div>
            </v-row>

            <!-- Errors during the generation -->
            <v-row class="px-6" v-if="deleteErrors">
              <div class="text-subtitle-2 red--text">
                {{ deleteErrors }}
              </div>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text color="green" @click="close">Go back</v-btn>
          <v-btn
            dark
            class="mt-2"
            :loading="deleteLoading"
            color="warning"
            @click="deleteFramework"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import FrameworkController from "@/controllers/framework/FrameworkController";
import { Framework } from "@/interface/framework/Framework";

export default Vue.extend({
  name: "FrameworkDeleteModal",

  props: {
    show: Boolean,
    framework: Object,
  },

  mounted() {
    this.deleteErrors = "";
    this.deleteLoading = false;
  },

  methods: {
    close() {
      this.$emit("close");
    },

    /**
     * Delete the API Token
     */
    async deleteFramework() {
      this.deleteLoading = true;
      try {
        const response = await FrameworkController.deleteFramework(
          this.framework._id,
        );
        if (response.isSuccess()) {
          this.deleteErrors = "";
          this.close(); // Close on success
        } else {
          this.deleteErrors = response.getErrorsAsString();
        }
      } catch (err) {
        this.deleteErrors = String(err);
      } finally {
        this.deleteLoading = false;
      }
    },
  },

  data: () => ({
    // Errors & loads
    deleteErrors: "",
    deleteLoading: false,
  }),
});
</script>
