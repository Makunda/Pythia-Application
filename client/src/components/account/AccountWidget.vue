<template>
  <v-card elevation="2" class="card-account pa-4">
    <v-card-title>
      <v-row class="d-flex justify-space-between mt-5">
        <p class="text-h5 ml-2">Overview of your account</p>
        <div>
          <v-btn v-if="!modification" @click="enterModificationMode()">
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
    </v-card-title>
    <v-card-subtitle> created on {{ account.createdAt }}</v-card-subtitle>

    <v-divider></v-divider>

    <v-card-text>
      <v-container>
        <v-row class="padding-border">
          <p>Account</p>
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
          <p>Profile</p>
        </v-row>

        <!-- Names -->
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
          <p>Api access</p>
          <v-spacer></v-spacer>
          <v-btn color="green" small dark text @click="testError()">
            Generate new API Key
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>

        <v-row>
          <p
            v-if="
              !account.tokens || (account.tokens && account.tokens.length == 0)
            "
          >
            <i>No API token was created for this acount</i>
          </p>
          <v-card
            v-for="(t, i) in account.tokens"
            :key="i"
            elevation="2"
            width="100%"
          >
            <v-card-text>{{ t.name }}</v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import User from "../../interface/User";
import AccountController from "../../controllers/account/AccountController";
import { ApiResponseImpl } from "@/interface/ApiResponse";
import Copy from "../../utils/Copy";
import Token from "@/interface/Token";
import flash, { FlashType } from "@/modules/flash/Flash";

// Toast

export default Vue.extend({
  name: "AccountWidget",

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
  },

  computed: {
    // Implement
  },

  methods: {
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
            const errors = resp.getErrors();
            for (const err of errors) {
              flash.commit("add", {
                type: FlashType.ERROR,
                title: "Failed to update the profile",
                body: err,
              });
            }
          }
        })
        .catch((_err) => {
          this.errors = ["Failed to update the profile. Internal error."];
        })
        .finally(() => {
          this.saveOngoing = false;
        });
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
</style>
