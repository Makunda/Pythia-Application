<template>
  <v-container>
    <!-- Technology level  -->
    <v-card
      elevation-5
      dark
      v-for="(techno, i) in technologiesList"
      :key="i"
      color="deepBlue"
      width="100%"
    >
      <v-card-text
        ><p>{{ techno }}</p>
        <v-spacer> {{}} frameworks </v-spacer></v-card-text
      >
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FrameworkMetadataController from "@/controllers/framework/FrameworkMetadataController";

export default Vue.extend({
  name: "ClassificationTable",

  mounted() {
    this.getTechnologiesList();
  },

  methods: {
    async getTechnologiesList() {
      try {
        const response = await FrameworkMetadataController.getTechnologyList();
        if (response.isSuccess()) {
          this.technologiesList = response.getData();
        } else {
          console.error("Failed to get the list of technologies.");
        }
      } catch (err) {
        console.error("Failed to get the list of technologies.");
      }
    },
  },

  data: () => ({
    technologiesList: [] as string[],
  }),
});
</script>
