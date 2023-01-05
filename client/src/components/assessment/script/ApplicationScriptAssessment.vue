<template>
  <v-card elevation="2" min-height="200px"
          min-width="100%" class="mt-4"
  >
    <v-card-title>
      <h3 class="mx-3"><strong>Compatibility script statistics:</strong></h3>
      <v-spacer></v-spacer>
      <!--  Status button    -->

    </v-card-title>
    <v-card-text>
      <v-container fluid>

        <!--    Select options    -->
        <v-row>
          <v-col cols="3">
            <v-combobox
                v-model="selectedTechnology"
                :items="technologyChoices"
                class="mr-2"
                dense
                label="Technology"
                outlined
            ></v-combobox>
          </v-col>

          <v-col cols="3">
            <v-combobox
                v-model="selectedTarget"
                :items="targetMap.get(selectedTechnology)"
                class="mr-2"
                dense
                label="Target (optional)"
                outlined
            ></v-combobox>
          </v-col>

          <v-col cols="3">
            <v-combobox
                v-model="selectedArchitecture"
                :items="architectureChoices"
                class="mr-2"
                dense
                label="Architecture"
                outlined
            ></v-combobox>
          </v-col>

          <v-col cols="3">
            <v-combobox
                v-model="selectedPlatform"
                :items="platformChoices"
                class="mr-2"
                dense
                label="Platform"
                outlined
            ></v-combobox>
          </v-col>
        </v-row>

        <v-row justify="end">
          <v-col class="d-flex justify-end" cols="3">
            <v-btn
                :loading="loadingStatistics"
                color="green darken-1"
                dark
                @click="loadScript"
            >
              Generate script
            </v-btn>
          </v-col>
        </v-row>

        <!-- Code Highlight for the cypher-->
        <v-row>
          <v-col cols="12">
            <highlight-code class="w-100" language="cypher">{{ scriptContent }}</highlight-code>
          </v-col>
        </v-row>

      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import PackageCharacteristicsController from "@/controllers/option/PackageCharacteristicsController";
import {ArcElement, Chart, DoughnutController, Legend} from "chart.js";
import Logger from "@/utils/Logger";
import {AssessmentStatisticsController} from "@/controllers/assessment/AssessmentStatisticsController";

export default Vue.extend ({
  name: "ApplicationScriptAssessment",

  components: {},

  props: ["portfolio", "application"],


  async mounted() {
    this.technologyChoices = await PackageCharacteristicsController.getTechnologiesList ();
    this.architectureChoices = await PackageCharacteristicsController.getArchitectureList ();
    this.platformChoices = await PackageCharacteristicsController.getPlatformsList ();
    this.targetMap = await PackageCharacteristicsController.getTargetListMap ();
  },

  methods: {

    validate() {

    },

    async loadScript() {
      this.loadingStatistics = true;

      try {
        const response = await AssessmentStatisticsController.createStatisticsScriptByApplication (
            this.portfolio._id,
            this.application._id,
            this.selectedTechnology,
            this.selectedPlatform,
            this.selectedArchitecture,
            this.selectedTarget
        );

        if(response.isError()) {
          throw response.getRawResponse();
        }

        this.scriptContent = response.getData();
      } catch (e) {
        Logger.error ("Failed to get statistics by portfolio.", e, "Portfolio Assessment Statistics");
      } finally {
        this.loadingStatistics = false;
      }
    },


  },


  data: () => ({
    scriptContent: "Select the characteristics and generate the script",

    selectedTechnology: "",
    selectedArchitecture: "",
    selectedPlatform: "",
    selectedTarget: "",

    technologyChoices: [] as string[],
    architectureChoices: [] as string[],
    platformChoices: [] as string[],
    targetMap: new Map<string, string[]> (),

    statistics: {} as any,
    loadingStatistics: false,

    chart: {} as any,
    loadingValidation: false,


  }),
});
</script>

<style scoped>
.chart-container {
  width: 80%;
  height: 480px;
  margin: 0 auto;
}

.pie-chart-container,
.doughnut-chart-container {
  height: 360px;
  width: 360px;
  float: left;
}
</style>