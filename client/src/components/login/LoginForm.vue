<template>
  <v-container fill-height>
    <v-layout row wrap align-center>
      <v-row class="text-center">
        <v-card
          elevation="2"
          persistent
          max-width="600px"
          min-width="360px"
          style="margin: auto"
        >
          <div>
            <v-tabs
              v-model="tab"
              show-arrows
              background-color="lessDeepBlue"
              icons-and-text
              dark
              grow
            >
              <v-tabs-slider color="lightDeepBlue"></v-tabs-slider>
              <v-tab v-for="(i, index) in tabs" :key="index">
                <v-icon large>{{ i.icon }}</v-icon>
                <div class="caption py-1">{{ i.name }}</div>
              </v-tab>
              <v-tab-item>
                <v-card class="px-4">
                  <v-card-text>
                    <v-form ref="loginForm" v-model="valid" lazy-validation>
                      <v-row v-if="info">
                        <p class="green--text">{{ info }}</p>
                      </v-row>
                      <v-row
                        class="d-flex flex-column"
                        v-if="errors.length != 0"
                      >
                        <p
                          v-for="(err, i) in errors"
                          :key="i"
                          class="red--text"
                        >
                          {{ err }}
                        </p>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="loginEmail"
                            :rules="loginEmailRules"
                            label="E-mail"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="loginPassword"
                            :append-icon="show1 ? 'eye' : 'eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Password"
                            hint="At least 8 characters"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col
                          class="d-flex"
                          cols="12"
                          sm="3"
                          xsm="12"
                          align-end
                        >
                          <v-btn
                            x-large
                            block
                            :disabled="!valid"
                            color="success"
                            @click="validate"
                          >
                            Login
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card class="px-4">
                  <v-card-text>
                    <v-form ref="registerForm" v-model="valid" lazy-validation>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="firstName"
                            :rules="[rules.required]"
                            label="First Name"
                            maxlength="20"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field
                            v-model="lastName"
                            :rules="[rules.required]"
                            label="Last Name"
                            maxlength="20"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Password"
                            hint="At least 8 characters"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            block
                            v-model="verify"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, passwordMatch]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Confirm Password"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                          <v-btn
                            x-large
                            block
                            :disabled="!valid"
                            color="success"
                            @click="validate"
                            >Register</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </div>
        </v-card>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoginController from "../../controllers/login/LoginController";
import Logger from "../../utils/Logger";
import { Cookie } from "../../enum/Cookie";
import CookieManager from "@/utils/CookieManager";
import ApiResponseImpl from "@/utils/ApiResponseImpl";

export default Vue.extend({
  name: "LoginForm",

  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
  },
  methods: {
    async validate() {
      this.errors = [];
      this.info = "";

      try {
        const response: ApiResponseImpl<string> =
          await LoginController.sendLogin({
            email: this.loginEmail,
            password: this.loginPassword,
          });

        if (response.isSuccess() && response.getData() != null) {
          // Get token and redirect
          this.info = "Succesful login, you'll be now redirected.";
          console.log("Token", response.getData());
          // Set cookie - JWT
          CookieManager.setAuthCookie(response.getData());

          // Redirect to Account
          this.$router.push("account");
        } else {
          this.errors = response.getErrors();
          this.errors.push("Login failed. Check username/password");
        }
      } catch (err) {
        Logger.error("Login", "Login failed.", err);
        this.errors.push("Login failed. Wrong username/password");
      }
    },

    reset() {
      // To Implement
    },

    resetValidation() {
      this.loginEmail = "";
      this.loginPassword = "";
    },
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
      { name: "Login", icon: "mdi-account" },
      { name: "Register", icon: "mdi-account-outline" },
    ],
    valid: true,

    errors: [] as string[],
    info: "",

    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      (v: string) => !!v || "Required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    emailRules: [
      (v: string) => !!v || "Required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],

    show1: false,
    rules: {
      required: (value: string) => !!value || "Required.",
      min: (v: string) => (v && v.length >= 8) || "Min 8 characters",
    },
  }),
});
</script>
