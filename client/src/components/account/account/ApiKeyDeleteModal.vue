<template>
  <v-dialog :value="show" transition="dialog-top-transition" max-width="1200">
    <template v-slot:default="">
      <v-card>
        <v-toolbar color="lessDeepBlue" dark>Remove API Key</v-toolbar>
        <v-card-text>
          <v-container>
            <v-row class="px-12 py-8">
              <div class="text-h6">
                You are about to remove an API key. This action cannot be undone.
              </div>
            </v-row>
            <!-- Name entry  -->
            <v-row class="px-12">
              <div class="text-h6">
                Enter the name (<strong> {{ token }} </strong>) of the Token to delete it:
              </div>
            </v-row>
            <v-row class="px-10">
              <v-col cols="10">
                <v-text-field
                  v-model="tokenName"
                  label="Token Name"
                  hint="Name of the token to generate"
                  :readonly="deleteLoading"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn
                  dark
                  block
                  class="mt-2"
                  :loading="deleteLoading"
                  color="warning"
                  @click="deleteToken"
                >
                  Delete
                </v-btn>
              </v-col>
              <!-- Errors during the generation -->
              <v-row class="px-10" v-if="deleteErrors">
                <div class="text-subtitle-2 red--text">
                  {{ deleteErrors }}
                </div>
              </v-row>
            </v-row>      
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="close">Go back to the Account</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import ApiKeyController from "@/controllers/account/ApiKeyController";

export default Vue.extend({
  name: "ApiKeyDeleteModal",

  props: {
    show: Boolean,
    token: String
  },

  mounted() {
    this.tokenName = "";
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
    async deleteToken() {
      if( this.tokenName != this.token) {
          this.deleteErrors = "The name provided doesn't match";
          return;
      } 

      this.deleteLoading = true;
      try {
        const response = await ApiKeyController.deleteToken(this.token);
        if (response.isSuccess()) {
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
    tokenName: "",

    // Errors & loads
    deleteErrors: "",
    deleteLoading: false,
  }),
});
</script>
