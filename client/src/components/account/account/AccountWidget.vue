<template>
  <v-container class="pa-0" fluid fill-height style="overflow-x: hidden">
    <v-row class="pa-0 ma-0">
      <v-parallax
        style="width: 100%"
        height="250"
        src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg"
      ></v-parallax>
    </v-row>
    <v-row class="d-flex justify-center screen-content">
      <v-container class="mb-12" style="max-width: 1185px;! important">
        <v-row class="d-flex justify-space-between mt-5">
          <p class="text-h4 ml-2">Overview of your account</p>
          <div>
            <v-btn
              dark
              v-if="!modification"
              color="lightDeepBlue"
              @click="enterModificationMode()"
            >
              Modify Account
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              v-if="modification"
              outlined
              color="red"
              class="mr-3"
              @click="cancelModifications()"
              :disabled="saveOngoing"
            >
              Cancel
            </v-btn>
            <v-btn
              v-if="modification"
              color="green"
              dark
              :loading="saveOngoing"
              @click="saveModifications()"
            >
              Save
            </v-btn>
          </div>
        </v-row>

        <!-- General & Parameters -->
        <v-row class="padding-border">
          <p class="ml-2 text-h6">General information</p>
        </v-row>

        <v-row>
          <v-col class="padding-border" md="12">
            <v-text-field
              v-model="account.username"
              label="Username"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="padding-border" md="12">
            <v-text-field
              v-model="account.email"
              label="E-mail"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="padding-border">
          <p class="ml-2 text-h6">Profile</p>
        </v-row>

        <v-row>
          <v-col class="padding-border" md="6">
            <v-text-field
              v-model="account.profile.firstName"
              label="First Name"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>

          <v-col class="padding-border" md="6"
            ><v-text-field
              v-model="account.profile.lastName"
              label="Last Name"
              :readonly="readOnly"
            ></v-text-field
          ></v-col>
        </v-row>

        <v-row>
          <v-col class="padding-border" md="6">
            <v-text-field
              v-model="account.profile.gender"
              label="Gender"
              :readonly="readOnly"
            ></v-text-field>
          </v-col>

          <v-col class="padding-border" md="6"
            ><v-text-field
              v-model="account.country"
              label="Country"
              :readonly="readOnly"
            ></v-text-field
          ></v-col>
        </v-row>

        <v-row class="padding-border">
          <p class="ml-2 text-h6">Api access</p>
          <v-progress-circular
            v-show="loadingTokens"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <v-btn
            class="ml-2 mt-1"
            v-show="!loadingTokens"
            @click="getTokens()"
            text
            color="green"
            small
          >
            Reload
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="mt-1"
            color="green"
            small
            dark
            text
            @click="apiKeyModal = true"
          >
            Generate new API Key
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>

        <v-row class="px-2">
          <p v-if="!tokens || (tokens && tokens.length == 0)">
            <i>No API token was created for this acount</i>
          </p>
          <v-card
            class="mb-1"
            v-for="(t, i) in tokens"
            :key="i"
            elevation="2"
            height="62px"
            width="100%"
          >
            <v-card-title class="d-flex flex-rox text-h6">
              <p class="pt-1">Name: {{ t.name }}</p>
              <p class="pt-1 ml-2 text-subtitle-1">
                Created on : {{ convertTimestamp(t.createdAt) }}
              </p>
              <v-spacer></v-spacer>
              <p class="pt-1">Actions:</p>
              <v-btn
                class="ml-1 mb-2"
                small
                icon
                color="warning"
                @click="openDeleteModal(t.name)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-title>
          </v-card>
        </v-row>
      </v-container>
    </v-row>

    <!-- Various Modals -->
    <ApiKeyModal
      v-bind:show="apiKeyModal"
      v-on:close="closeApiKeysModal()"
    ></ApiKeyModal>

    <ApiKeyDeleteModal
      v-bind:show="apiKeyDeleteModal"
      v-bind:token="selectedToken"
      v-on:close="closeDeleteModal()"
    >
    </ApiKeyDeleteModal>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import User from "@/interface/account/User";
import AccountController from "@/controllers/account/AccountController";
import Copy from "@/utils/Copy";
import Token from "@/interface/account/Token";
import flash, { FlashType } from "@/modules/flash/Flash";
import ApiResponseImpl from "@/utils/ApiResponseImpl";

// Utils

// Components
import ApiKeyModal from "./ApiKeyModal.vue";
import ApiKeyDeleteModal from "./ApiKeyDeleteModal.vue";
import ApiKeyController from "@/controllers/account/ApiKeyController";
// Toast

export default Vue.extend({
  name: "AccountWidget",

  components: {
    ApiKeyModal,
    ApiKeyDeleteModal,
  },

  mounted() {
    AccountController.getAccountInfo()
      .then((response: ApiResponseImpl<User>) => {
        if (response.isSuccess()) {
          this.account = response.getData();
        } else {
          // Else handle and diplasy the error
          this.errors = response.getErrors();
        }
      })
      .catch((err) => {
        this.errors = [err];
      });
    this.getTokens();
  },

  computed: {
    // Implement
  },

  methods: {
    /**
     * Open the delete modal
     */
    openDeleteModal(tokenName: string) {
      this.selectedToken = tokenName;
      this.apiKeyDeleteModal = true;
    },

    /**
     * Close the delete modal
     */
    closeDeleteModal() {
      this.selectedToken = "";
      this.apiKeyDeleteModal = false;
      this.getTokens();
    },

    /**
     * Close the modal of API keys and reload keys
     */
    closeApiKeysModal() {
      this.apiKeyModal = false;
      this.getTokens();
    },

    convertTimestamp(timestamp: number) {
      return new Date(timestamp).toDateString();
    },

    // Implement
    enterModificationMode() {
      this.previousAccount = Copy.deepCopy(this.account);
      this.readOnly = false;
      this.modification = true;
    },

    cancelModifications() {
      this.account = Copy.deepCopy(this.previousAccount);
      this.readOnly = true;
      this.modification = false;
    },

    saveModifications() {
      // Send modifcation
      this.readOnly = true;
      this.modification = false;

      // Post the new info and wait for the answer
      this.saveOngoing = true;
      AccountController.updateAccountInfo(this.account)
        .then((resp) => {
          if (resp.isSuccess()) {
            // Success, update profile
          } else {
            // Errors
            flash.commit("add", {
              type: FlashType.ERROR,
              title: "Failed to update the profile",
              body: resp.getErrorsAsString(),
            });
          }
        })
        .catch((_err) => {
          this.errors = ["Failed to update the profile. Internal error."];
        })
        .finally(() => {
          this.saveOngoing = false;
        });
    },

    /**
     * Get the tokens linked to the account
     */
    async getTokens() {
      this.loadingTokens = true;

      try {
        const response = await ApiKeyController.getAllUserToken();
        if (response.isSuccess()) {
          this.tokens = response.getData();
        } else {
          flash.commit("add", {
            type: FlashType.ERROR,
            title: "Failed to get account's token",
            body: response.getErrorsAsString(),
          });
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get account's token",
          body: err,
        });
      } finally {
        this.loadingTokens = false;
      }
    },

    testError() {
      flash.commit("add", {
        type: FlashType.ERROR,
        title: "Failed to update the profile",
        body: "err",
      });
    },
  },

  data: () => ({
    loading: true,
    errors: [] as string[],

    // Modify options
    readOnly: true,
    modification: false,
    previousAccount: {} as any as User,

    saveOngoing: false,

    //Default account
    account: {
      username: "",
      email: "",
      tokens: [] as Token[],
      country: "",
      role: {} as unknown,
      profile: {
        firstName: "",
        lastName: "",
        gender: "",
        location: "",
        website: "",
        picture: "",
      },
    } as any as User,

    // Tokens
    loadingTokens: false,
    tokens: [] as Token[],

    // Modals
    apiKeyModal: false, // Key Creation

    apiKeyDeleteModal: false,
    selectedToken: "",
  }),
});
</script>

<style scoped>
.card-account {
}

.padding-border {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.screen-content {
  padding-left: 42px;
  max-width: 96% !important;
}
</style>
