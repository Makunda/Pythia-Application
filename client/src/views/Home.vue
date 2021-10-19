<template>
  <HomePage></HomePage>
</template>

<script lang="ts">
import Vue from "vue";
import HomePage from "@/components/home/HomePage.vue";

export default Vue.extend({
  name: "Home",

  components: {
    HomePage,
  },
});
</script>
