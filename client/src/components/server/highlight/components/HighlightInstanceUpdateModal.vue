<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          v-bind="attrs"
          v-on="on"
          @click="updateComponent"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">New Highlight instance declaration</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row style="display: flex; flex-direction: column">
            <p>
              The instance with id <strong>{{editedItem.domainId}}</strong> is being updated.
              You can either wait on this windows or close it, and the job will be running in background.
            </p>
            <v-progress-linear
                indeterminate
                color="cyan"
            ></v-progress-linear>
          </v-row>
          <!--    Information alert      -->
          <v-row v-if="updateMessage">
            <v-alert
                dismissible
                color="cyan"
                border="left"
                width="100%"
                elevation="2"
                colored-border
                icon="mdi-alert-circle"
            >
               {{updateMessage}}
            </v-alert>
          </v-row>

          <!--    Error alert      -->
          <v-row v-if="updateError">
            <v-alert
                v-model="updateError"
                dismissible
                color="red"
                type="alert"
                border="left"
                width="100%"
                elevation="2"
                colored-border
                icon="mdi-alert-octagon-outline"
            >
              <strong>Error: </strong> {{updateError}}
            </v-alert>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="green darken-1"
            class="white--text mx-2"
            min-width="120px"
            :disabled="ongoingUpdate"
            @click="this.updateComponent"
        >
          Update
        </v-btn>

        <v-btn
            color="blue darken-1"
            class="white--text"
            min-width="120px"
            @click="close"
        >
          Run in background
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import ServerLoadingAnimation from "@/components/animations/ServerLoadingAnimation.vue";
import Logger from "@/utils/Logger";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import {sleep} from "@/utils/Sleep";

// Basics
export default Vue.extend({
  name: "HighlightInstanceUpdateModal",

  props: ["instance"],

  components: {
    // Components to include
    ServerLoadingAnimation
  },

  mounted() {
    // On mounted
    this.editedItem = {} as HighlightCredentials;
    this.editedItem = this.instance as HighlightCredentials;
  },

  computed: {
    // Implement
  },

  methods: {
    async updateComponent(): Promise<void> {
      this.dialog = true;
      this.updateMessage = "";
      this.updateError = "";
      this.ongoingUpdate = true;

      try {
        await HighlightInstanceController.updateComponent(this.editedItem);
        await sleep(2000);
        this.updateMessage = "The Highlight instance as been updated."

        this.close();
      } catch (e) {
        Logger.error("Failed to update", e);
        this.updateError = String(e);
      } finally {
        this.ongoingUpdate = false;
      }
    },

    close() : void {
      this.dialog = false;
      this.$emit("close")
    }
  },

  data: () => ({
    dialog: false,
    ongoingUpdate: false,

    // Populate with Data
    editedItem: {} as HighlightCredentials,
    updateError: "",
    updateMessage: ""

  }),
});
</script>