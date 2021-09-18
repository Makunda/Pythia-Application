<template>
  <v-container fill-height>
      
   </v-container>
</template>

<script lang="ts">
import { ApiResponseImpl } from "@/interface/ApiResponse";
import Vue from "vue";
import LoginController from "../../controllers/login/LoginController";
import Logger from "../../utils/Logger";
import { Cookie } from "../../enum/Cookie";

export default Vue.extend({
  name: "AccountWidget",

  computed: {
      // Implement
  },
  methods: {
    // Implement
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
