<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
      >
        New Worker
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">New worker declaration</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row style="display: flex; flex-direction: column">
            <p>Declare a new worker on Pythia. This worker cannot be redundant with an existing one.</p>
            <v-form
                ref="form"
                lazy-validation
            >
              <v-text-field
                  v-model="editedItem.name"
                  label="Name of the Worker"
                  :rules="[v => !!v || 'Name is required']"
              ></v-text-field>

              <v-autocomplete
                  v-model="editedItem.architecture"
                  :items="architectureChoice"
                  label="Architecture"
              ></v-autocomplete>

              <v-autocomplete
                  v-model="editedItem.platform"
                  :items="platformChoice"
                  label="Platform"
              ></v-autocomplete>


              <v-autocomplete
                  v-model="editedItem.language"
                  :items="languageChoice"
                  label="Language"
              ></v-autocomplete>


              <v-text-field
                  v-model="editedItem.url"
                  label="Url of the worker"
                  :rules="[v => !!v || 'URL is required']"
              ></v-text-field>

              <v-text-field
                  v-model="editedItem.key"
                  label="Key"
                  :rules="[v => !!v || 'Key is required']"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
              ></v-text-field>

            </v-form>
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
              <strong>Error: </strong> {{this.errors}}
            </v-alert>
          </v-row>
          <!--     Confirmation     -->
          <v-row style="display: flex; flex-direction: column; justify-content: center">
            <v-btn
                color="green darken-1"
                :loading="loadingValidation"
                :disabled="disableValidate"
                dark
                @click="validate"
            >
              Validate
            </v-btn>
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
          Cancel
        </v-btn>
        <v-btn
            color="blue darken-1"
            class="white--text"
            min-width="120px"
            :disabled="!validated"
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import ServerLoadingAnimation from "@/components/animations/ServerLoadingAnimation.vue";
import Logger from "@/utils/Logger";
import {sleep} from "@/utils/Sleep";
import WorkerController from "@/controllers/worker/WorkerController";
import Worker from "@/interface/worker/Worker";

// Basics
export default Vue.extend({
  name: "WorkerInstanceAddModal",

  components: {
    // Components to include
    ServerLoadingAnimation
  },

  mounted() {
    // On mounted
    this.editedItem = {} as Worker

    WorkerController.getArchitectures().then(response => {
      if(response.isError()) throw response.getErrorsAsString();
      this.architectureChoice = response.getData() as string[];
    }).catch(err => {
      Logger.error(
          "Failed to get the list of architecture",
          "Failed to get the list of architecture due to a server error.",
          err,
      );
      this.architectureChoice = [];
    });

    WorkerController.getLanguages().then(response => {
      if(response.isError()) throw response.getErrorsAsString();
      this.languageChoice = response.getData() as string[];
    }).catch(err => {
      Logger.error(
          "Failed to get the list of language",
          "Failed to get the list of language due to a server error.",
          err,
      );

      this.languageChoice = [];
    });

    WorkerController.getPlatforms().then(response => {
      if(response.isError()) throw response.getErrorsAsString();
      this.platformChoice = response.getData() as string[];
    }).catch(err => {
      Logger.error(
          "Failed to get the list of platform",
          "Failed to get the list of platforms due to a server error.",
          err,
      );
    });

    this.platformChoice = [];
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
    async save() : Promise<void> {
      // Reset the validation parameters
      this.disableValidate = true;
      this.loadingSave = true;
      this.informationAlertModel = false;
      this.errorAlertModel = false;
      this.errors = "";

      // Worker creation request
      try {
        const response = await WorkerController.create(this.editedItem);
        if(response.isError()) {
          this.errors = `Failed to save the worker: ${response.getErrorsAsString()}`;
          this.errorAlertModel = true;
        } else {
          const data = response.getData();
          this.validationInfo = `Worker successfully registered !.`;
          this.informationAlertModel = true;
          this.validated = true;

          await sleep(1000);
          this.close();
        }
      } catch (err) {
        Logger.error(
            "Worker creation failed",
            "Failed to create the worker due to a client error.",
            err,
        );

        this.errors = "Failed to create the worker due to a client error.";
        this.errorAlertModel = true;
      } finally {
        this.loadingSave = false;
        this.disableValidate = false;
      }
    },

    async validate() : Promise<void> {
      // Reset the form
      this.loadingValidation = true;
      this.informationAlertModel = false;
      this.errorAlertModel = false;
      this.errors = "";

      try {
        const response = await WorkerController.validate(this.editedItem);
        if(response.isError()) {
          this.errors = `Failed to worker the framework: ${response.getErrorsAsString()}`;
          this.errorAlertModel = true;
        } else {
          const data = response.getData();
          this.validationInfo = `Successfully contacted the worker.`;
          this.informationAlertModel = true;
          this.validated = true;
        }
      } catch (err) {
        Logger.error(
            "Worker validation failed",
            "Failed to validate the worker due to a client error.",
            err,
        );

        this.errors = "Failed to validate the worker due to a client error.";
        this.errorAlertModel = true;
      } finally {
        this.loadingValidation = false;
      }
    },


    close() : void {
      this.dialog = false;
      this.$emit("close")
    }
  },

  data: () => ({
    dialog: false,
    loadingSave: false,
    loadingValidation: false,
    disableValidate: false,
    errors: "",

    // Pasword
    showPassword: false,

    // Choices
    architectureChoice: [] as string[],
    platformChoice: [] as string[],
    languageChoice: [] as string[],

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