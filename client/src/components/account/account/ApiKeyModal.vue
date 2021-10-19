<template>
  <v-dialog :value="show" transition="dialog-top-transition" max-width="1200">
    <template v-slot:default="">
      <v-card>
        <v-toolbar color="lessDeepBlue" dark>API Key generation</v-toolbar>
        <v-card-text>
          <v-container>
            <v-row class="px-12 py-8">
              <div class="text-subtitle-1">
                You are about to generate an API key that will grant the same
                privileges as your privileges as your account and can be used in
                NASD Atlas.
                <br />
                This key will only appear once, so be sure to save it somewhere.
                If you have lost an API key, you can either delete it and create
                a new one, or regenerate a new one in the account dashboard.
                <br />
                <strong>
                  You must provided a unique name for this token
                </strong>
              </div>
            </v-row>
            <!-- Name entry  -->
            <v-row class="px-12">
              <div class="text-subtitle-1">
                Enter the name of the token to generate:
              </div>
            </v-row>
            <v-row class="px-12">
              <v-col cols="10">
                <v-text-field
                  v-model="tokenName"
                  label="Token Name"
                  hint="Name of the token to generate"
                  :readonly="generationSuccessFull"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn
                  dark
                  block
                  :loading="generationLoading"
                  :disabled="generationSuccessFull"
                  color="lightDeepBlue"
                  @click="generateToken"
                >
                  {{ generationSuccessFull ? "Generated !" : "Generate" }}
                </v-btn>
              </v-col>
              <!-- Errors during the generation -->
              <v-row class="px-10" v-if="generationError">
                <div class="text-subtitle-2 red--text">
                  {{ generationError }}
                </div>
              </v-row>
            </v-row>
            <v-row class="px-12 mt-6">
              <div class="text-subtitle-1">
                Generated token ( click on the text to copy to clipboard ):
              </div>
            </v-row>
            <!-- Token description -->
            <v-row class="px-12">
              <v-textarea
                v-model="generatedToken"
                auto-grow
                outlined
                rows="5"
                row-height="15"
                name="input-7-4"
                label="Generated Token"
                readonly
                @click="copyToken"
              ></v-textarea>
            </v-row>
          </v-container>
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
import { copyTextToClipboard } from "@/utils/js/CopyToClipBoard";
import flash, { FlashType } from "@/modules/flash/Flash";

export default Vue.extend({
  name: "ApiKeyModal",

  props: {
    show: Boolean,
  },

  mounted() {
    this.tokenName = "";
    this.generatedToken = "No token has been generated.";
    this.generationSuccessFull = false;
    this.generationError = "";
    this.generationLoading = false;
  },

  methods: {
    close() {
      this.$emit("close");
    },

    /**
     * Copy the token to the clipboard if the generation was succesful
     */
    copyToken() {
      // Check successulf generation
      if (this.generationSuccessFull) {
        copyTextToClipboard(this.generatedToken);
        flash.commit("add", {
          type: FlashType.SUCCESS,
          title: "Token copied.",
          body: "Token has been copied to clipboard. You can now paste it.",
        });
      }
    },

    /**
     * Generate a new API Token
     */
    async generateToken() {
      this.generationLoading = true;
      try {
        const response = await ApiKeyController.createToken(this.tokenName);
        if (response.isSuccess()) {
          this.generatedToken = response.getData();
          this.generationSuccessFull = true;
        } else {
          this.generationError = response.getErrorsAsString();
        }
      } catch (err) {
        this.generationError = String(err);
      } finally {
        this.generationLoading = false;
      }
    },
  },

  data: () => ({
    tokenName: "",
    generatedToken: "No token has been generated.",

    // Errors & loads
    generationSuccessFull: false,
    generationError: "",
    generationLoading: false,
  }),
});
</script>
