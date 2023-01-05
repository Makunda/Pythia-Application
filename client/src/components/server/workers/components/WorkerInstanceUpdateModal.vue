<template>
  <v-dialog
      v-model="dialog"
      max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon
          class="mr-2"
          small
          v-bind="attrs"
          v-on="on"
      >
        mdi-pencil
      </v-icon>

    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Update worker declaration</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row style="display: flex; flex-direction: column">
            <p>Update a worker on Pythia. This worker cannot be redundant with an existing one.</p>
            <v-form
                ref="form"
                lazy-validation
            >
              <v-text-field
                  v-model="editedItem.name"
                  :rules="[v => !!v || 'Name is required']"
                  label="Name of the Worker"
              ></v-text-field>

              <span class="text-h6">Specifications</span>

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

              <v-autocomplete
                  v-model="editedItem.target"
                  :items="targetChoiceMap[editedItem.language]"
                  label="Target"
              ></v-autocomplete>

              <span class="text-h6">Credentials</span>

              <v-text-field
                  v-model="editedItem.url"
                  :rules="[v => !!v || 'URL is required']"
                  label="Url of the worker"
              ></v-text-field>

              <v-text-field
                  v-model="editedItem.key"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Key"
                  placeholder="****************"
                  @click:append="showPassword = !showPassword"
              ></v-text-field>

            </v-form>
          </v-row>
          <!--    Information alert      -->
          <v-row v-if="informationAlertModel">
            <v-alert
                v-model="informationAlertModel"
                border="left"
                color="cyan"
                colored-border
                dismissible
                elevation="2"
                icon="mdi-alert-circle"
                width="100%"
            >
              {{ validationInfo }}
            </v-alert>
          </v-row>
          <!--    Error alert      -->
          <v-row v-if="errorAlertModel">
            <v-alert
                v-model="errorAlertModel"
                border="left"
                color="red"
                colored-border
                dismissible
                elevation="2"
                icon="mdi-alert-octagon-outline"
                type="alert"
                width="100%"
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
          Cancel
        </v-btn>
        <v-btn
            class="white--text"
            color="blue darken-1"
            min-width="120px"
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
import ApiResponseImpl from "@/utils/ApiResponseImpl";

// Basics
export default Vue.extend ({
  name: "WorkerInstanceUpdateModal",

  props: ["workerEdit"],

  components: {
    // Components to include
    ServerLoadingAnimation
  },

  mounted() {
    // On mounted
    if (this.editedItem) this.editing = false;
    this.editedItem = this.workerEdit || {} as Worker

    WorkerController.getArchitectures ().then (response => {
      if (response.isError ()) throw response.getErrorsAsString ();
      this.architectureChoice = response.getData () as string[];
    }).catch (err => {
      Logger.error (
          "Failed to get the list of architecture",
          "Failed to get the list of architecture due to a server error.",
          err,
      );
      this.architectureChoice = [];
    });

    WorkerController.getTechnologies ().then (response => {
      if (response.isError ()) throw response.getErrorsAsString ();
      this.languageChoice = response.getData () as string[];
    }).catch (err => {
      Logger.error (
          "Failed to get the list of language",
          "Failed to get the list of language due to a server error.",
          err,
      );

      this.languageChoice = [];
    });

    WorkerController.getPlatforms ().then (response => {
      if (response.isError ()) throw response.getErrorsAsString ();
      this.platformChoice = response.getData () as string[];
    }).catch (err => {
      Logger.error (
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
    async save(): Promise<void> {
      // Reset the validation parameters
      this.disableValidate = true;
      this.loadingSave = true;
      this.informationAlertModel = false;
      this.errorAlertModel = false;
      this.errors = "";

      // Worker creation request
      try {

        let response: ApiResponseImpl<Worker>;
        if (this.editing) response = await WorkerController.create (this.editedItem);
        else response = await WorkerController.update (this.editedItem);

        if (response.isError ()) {
          this.errors = `Failed to ${this.editing ? "update" : "save"} the worker: ${response.getErrorsAsString ()}`;
          this.errorAlertModel = true;
        } else {
          const data = response.getData ();
          this.validationInfo = `Worker successfully registered !.`;
          this.informationAlertModel = true;
          this.validated = true;

          await sleep (1000);
          this.close ();
        }
      } catch (err) {
        Logger.error (
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

    close(): void {
      this.dialog = false;
      this.$emit ("close")
    }
  },

  data: () => ({
    editing: false,
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

    targetChoiceMap: {
      "dotnet": [
        "net6.0"
      ]
    },

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