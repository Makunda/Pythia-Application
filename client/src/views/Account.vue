<template>
  <hello-world />
</template>

<script lang="ts">
import Vue from "vue";
import Account from "../components/account/AccountWidget.vue";

export default Vue.extend({
  name: "Home",

  components: {
    HelloWorld,
  },
});
</script>
