<template>
  <v-card elevation="2" min-height="200px"
          min-width="100%"
  >
    <v-card-title>
      <h3 class="mx-3"><strong>Compatibility statistics:</strong></h3>
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
                @click="loadAssessment"
            >
              Assess portfolio
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6" style="position: relative">
            <div class="doughnut-chart-container" style="min-height: 100%; min-width: 100%; position: relative">
              <canvas id="doughnut-chartcanvas-1"
                      style="position: absolute; top: 0; left: 0; transform: translateX(50%)"></canvas>
            </div>
          </v-col>
          <v-col class="d-flex flex-column " cols="6" justify="center">
            <h2>Statistics </h2>
            <h3>Assessment for {{ selectedTechnology }} packages on {{ selectedPlatform }} (architecture:
              {{ selectedArchitecture }})</h3>
            <p><strong>Compatibles packages: </strong>{{ statistics.compatibleElements }}</p>
            <p><strong>Partially compatibles packages: </strong>{{ statistics.partialCompatibilityElements }}</p>
            <p><strong>Incompatible packages: </strong>{{ statistics.incompatibleElements }}</p>
            <p><strong>Unaddressed packages: </strong>{{ statistics.unaddressedElements }}</p>
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
  name: "ApplicationAssessmentStatistics",

  components: {},

  props: ["portfolio", "application"],


  async mounted() {
    this.technologyChoices = await PackageCharacteristicsController.getTechnologiesList ();
    this.architectureChoices = await PackageCharacteristicsController.getArchitectureList ();
    this.platformChoices = await PackageCharacteristicsController.getPlatformsList ();
    this.targetMap = await PackageCharacteristicsController.getTargetListMap ();

    this.generateChart ();
  },

  methods: {

    validate() {

    },

    async loadAssessment() {
      this.loadingStatistics = true;

      try {
        const response = await  AssessmentStatisticsController.getStatisticsByApplication (
            this.portfolio._id,
            this.application._id,
            this.selectedTechnology,
            this.selectedPlatform,
            this.selectedArchitecture,
            this.selectedTarget);
        if (response.isError ()) throw response.getRawResponse ();
        const stats = response.getData ();
        this.statistics = stats;


        this.chartData.datasets[0] = {
          label: "Package Assessment",
          data: [stats.compatibleElements, stats.partialCompatibilityElements, stats.incompatibleElements, stats.unaddressedElements],
          backgroundColor: [
            'rgb(20,141,0)',
            'rgb(210,114,14)',
            'rgb(211,8,8)',
            'rgb(82,82,82)'
          ],
          hoverOffset: 4
        }

        this.chart.update ();


      } catch (e) {
        Logger.error ("Failed to get statistics by portfolio.", e, "Portfolio Assessment Statistics");
      } finally {
        this.loadingStatistics = false;
      }
    },

    generateChart() {
      // Initiate diagrams
      // const ctx = this.$refs[];
      Chart.register (DoughnutController, ArcElement, Legend);

      const ctx = document.getElementById ("doughnut-chartcanvas-1") as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart (ctx, {
          type: "doughnut",
          data: this.chartData,
          options: this.chartOptions
        });
        this.chart.update ();
      }

      Logger.success ("Chart generated", "", "Portfolio Assessment Statistics");
    }
  },


  data: () => ({
    chartContext: HTMLElement,

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

    chartData: {
      labels: ["Compatible", "Partially compatible", "Incompatible", "Unaddressed"],
      datasets: [
        {
          label: "Package Assessment",
          data: [1, 1, 1],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }
      ]
    },

    chartOptions: {
      responsive: true,
      title: {
        display: true,
        position: "top",
        text: "Package Statistics",
        fontSize: 18,
        fontColor: "#111"
      },
      plugins: {
        legend: {
          display: true,
        }
      }
    },
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