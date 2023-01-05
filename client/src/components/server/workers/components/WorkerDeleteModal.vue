<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="red"
          x-small
          icon
          v-bind="attrs"
          v-on="on"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Are you sure to delete the worker ?</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row style="display: flex; flex-direction: column">
            <p>You are about to delete a worker used as part of the package assessments.
              All items related to this instance will therefore be deleted with it.
              The extracted data will be kept.
              <br>
                Worker with name: <strong>{{editedItem.name}}</strong>.
                Platform: <strong>{{editedItem.platform}}</strong> /
                Language: <strong>{{editedItem.language}}</strong> /
                Architecture: <strong>{{editedItem.architecture}}</strong>.
            </p>
          </v-row>

          <!--    Information alert      -->
          <v-row v-if="informationAlertModel">
            <v-alert
                v-model="informationAlertModel"
                dismissible
                color="cyan"
                border="left"
                width="100%"
                elevation="2"
                colored-border
                icon="mdi-alert-circle"
            >
              {{validationInfo}}
            </v-alert>
          </v-row>
          <!--    Error alert      -->
          <v-row v-if="errorAlertModel">
            <v-alert
                v-model="errorAlertModel"
                dismissible
                color="red"
                type="alert"
                border="left"
                width="100%"
                elevation="2"
                colored-border
                icon="mdi-alert-octagon-outline"
            >
              <strong>Error: </strong> {{ this.errors }}
            </v-alert>
          </v-row>

        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="red darken-1"
            text
            @click="close"
        >
          Go back
        </v-btn>
        <v-btn
            color="blue darken-1"
            class="white--text"
            min-width="120px"
            @click="this.delete"
        >
          Confirm this action
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Logger from "@/utils/Logger";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import {sleep} from "@/utils/Sleep";
import Worker from "@/interface/worker/Worker";
import WorkerController from "@/controllers/worker/WorkerController";

// Basics
export default Vue.extend({
  name: "WorkerDeleteModal",
  props: ['worker'],
  components: {
    // Components to include
  },

  created() {
    // On mounted
    this.editedItem = this.worker as Worker
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
    async delete() : Promise<void> {
      // Verify ID
      if(!this.editedItem._id) {
        this.errorAlertModel = false;
        this.errors = "This instance has no associated ID";
        return ;
      }

      // Reset the form
      this.loadingDelete = true;
      this.informationAlertModel = false;
      this.errorAlertModel = false;
      this.errors = "";

      try {
        const response = await WorkerController.deleteById(this.editedItem._id as string);
        if(response.isError()) {
          this.errors = `Failed to delete the worker: ${response.getErrorsAsString()}`;
          this.errorAlertModel = true;
        } else {
          const data = response.getData();
          this.validationInfo = `Worker successfully deleted !`;
          this.informationAlertModel = true;
          this.validated = true;

          await sleep(1000);

          this.close();
        }
      } catch (err) {
        Logger.error(
            "Worker deletion failed",
            "Failed to delete the worker due to a client error.",
            err,
        );

        this.errors = "Failed to delete the worker due to a client error.";
        this.errorAlertModel = true;
      } finally {
        this.loadingDelete = false;
      }

    },


    close() : void {
      this.dialog = false;
      this.$emit("close")
    }
  },

  data: () => ({
    dialog: false,
    loadingDelete: false,
    errors: "",

    // Password
    showPassword: false,

    validated: false,
    validationInfo: "",

    // Alert
    informationAlertModel: false,
    errorAlertModel: false,

    // Populate with Data
    editedItem: {} as Worker,
    defaultItem: {} as Worker,
  }),
});
</script>