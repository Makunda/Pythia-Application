<template>
  <v-container fill-height>
    <v-row class="d-flex justify-center">
      <AccountWidget />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import AccountWidget from "../components/account/AccountWidget.vue";

export default Vue.extend({
  name: "Home",

  components: {
    AccountWidget,
  },
});
</script>
