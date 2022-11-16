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
        New Instance
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">New Highlight instance declaration</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row style="display: flex; flex-direction: column">
            <p>Declare a new Highlight instance on Pythia. This instance cannot be redundant with an existing one.</p>
            <v-form
                ref="form"
                lazy-validation
            >
              <v-text-field
                  v-model="editedItem.url"
                  label="URL of the instance"
                  :rules="[v => !!v || 'URL is required']"
              ></v-text-field>

              <v-text-field
                  v-model="editedItem.domainId"
                  label="Domain ID"
                  :rules="[v => !!v || 'Domain ID is required']"
              ></v-text-field>

              <v-text-field
                  v-model="editedItem.username"
                  label="Username"
                  :rules="[v => !!v || 'Username is required']"
              ></v-text-field>

              <v-text-field
                  v-model="editedItem.password"
                  label="Password"
                  :rules="[v => !!v || 'Password is required']"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
              ></v-text-field>

              <v-text-field
                  v-model="editedItem.companyName"
                  label="Company Name"
              ></v-text-field>

              <v-text-field
                  v-model="editedItem.partnerName"
                  label="Partner Name"
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
import {HighlightCredentials} from "@/interface/highlight/HighlightCredentials";
import ServerLoadingAnimation from "@/components/animations/ServerLoadingAnimation.vue";
import Logger from "@/utils/Logger";
import HighlightInstanceController from "@/controllers/highlight/HighlightInstanceController";
import {sleep} from "@/utils/Sleep";

// Basics
export default Vue.extend({
  name: "HighlightInstanceAddModal",

  components: {
    // Components to include
    ServerLoadingAnimation
  },

  mounted() {
    // On mounted
    this.editedItem = {} as HighlightCredentials
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
    async save() : Promise<void> {

      // Reset the form
      this.disableValidate = true;
      this.loadingSave = true;
      this.informationAlertModel = false;
      this.errorAlertModel = false;
      this.errors = "";

      try {
        const response = await HighlightInstanceController.create(this.editedItem);
        if(response.isError()) {
          this.errors = `Failed to save the Highlight instance: ${response.getErrorsAsString()}`;
          this.errorAlertModel = true;
        } else {
          const data = response.getData();
          this.validationInfo = `Highlight instance successfully registered !`;
          this.informationAlertModel = true;
          this.validated = true;

          await sleep(1000);

          this.close();
        }
      } catch (err) {
        Logger.error(
            "Highlight instance validation failed",
            "Failed to validate the instance due to a client error.",
            err,
        );

        this.errors = "Failed to validate the instance due to a client error.";
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
        const response = await HighlightInstanceController.validate(this.editedItem);
        if(response.isError()) {
          this.errors = `Failed to validate the framework: ${response.getErrorsAsString()}`;
          this.errorAlertModel = true;
        } else {
          const data = response.getData();
          this.validationInfo = `Found portfolio with name: ${data.officialName}.`;
          this.informationAlertModel = true;
          this.validated = true;
        }
      } catch (err) {
        Logger.error(
            "Framework validation failed",
            "Failed to validate the framework due to a client error.",
            err,
        );

        this.errors = "Failed to validate the framework due to a client error.";
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

    // Password
    showPassword: false,

    validated: false,
    validationInfo: "",

    // Alert
    informationAlertModel: false,
    errorAlertModel: false,

    // Populate with Data
    editedItem: {} as HighlightCredentials,
    defaultItem: {} as HighlightCredentials,
  }),
});
</script>