<template>
  <v-card elevation="2"> 
    {{ errors }}
    {{ account }}

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import User from "../../interface/User";
import AccountController from "../../controllers/account/AccountController";
import { ApiResponseImpl } from "@/interface/ApiResponse";

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
  },
  data: () => ({
    loading: true,
    errors: [] as string[],
    account: {} as User,
  }),
});
</script>
