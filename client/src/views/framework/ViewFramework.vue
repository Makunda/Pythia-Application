<template>
  <v-container>
    <ViewSingleFramework />
  </v-container>
</template>

<script lang="ts">
import { Framework } from "@/interface/framework/Framework";
import ViewSingleFramework from "@/components/framework/ViewSingleFramework.vue"
import Vue from "vue";

export default Vue.extend({
  name: "ViewFramework",

  components: {
    ViewSingleFramework,
  },

  data: () => ({
    framework: undefined as unknown as Framework,
  }),
  props: ["id"],
});
</script>
