<template>
  <v-card elevation="2" class="card-account pa-4" style="position: relative">
    <v-card-title>
      <v-row class="d-flex justify-space-between mt-5">
        <p class="text-h5 ml-2">Frameworks created</p>
        <div></div>
      </v-row>
    </v-card-title>
    <v-card-subtitle>Review the frameworks that you created</v-card-subtitle>

    <v-divider></v-divider>

    <v-card-text>
      <v-container>
        <v-row>
          <!-- Framework list -->
          <v-col
            class="padding-border transition-width"
            cols="12"
            :md="!showOverview ? 12 : 6"
          >
            <v-container>
              <v-row class="padding-border">
                <p class="text-h6">Frameworks</p>
                <v-spacer></v-spacer>
                <v-btn
                  color="green"
                  small
                  dark
                  text
                  @click="frameworkModal = true"
                >
                  Create new framework
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-row>

              <v-row>
                <v-data-iterator
                  style="width: 100%"
                  :items="frameworkList"
                  :items-per-page.sync="itemsPerPage"
                  :page.sync="page"
                  :search="search"
                  :sort-by="sortBy.toLowerCase()"
                  :sort-desc="sortDesc"
                  hide-default-footer
                >
                  <template v-slot:header>
                    <v-text-field
                      v-model="search"
                      clearable
                      flat
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      label="Search framework"
                      class="rounded-xl"
                    ></v-text-field>
                  </template>

                  <template v-slot:default="props">
                    <v-row v-for="item in props.items" :key="item.name">
                      <v-sheet
                        color="white"
                        elevation="2"
                        height="100"
                        outlined
                        rounded
                        class="rounded-xl"
                        width="100%"
                      >
                        <v-container>
                          <v-row> {{ item.name }} </v-row>
                        </v-container>
                      </v-sheet>
                    </v-row>
                  </template>

                  <template v-slot:footer>
                    <v-row class="mt-2" align="center" justify="center">
                      <span class="grey--text">Items per page</span>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            dark
                            text
                            color="primary"
                            class="ml-2"
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ itemsPerPage }}
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(number, index) in itemsPerPageArray"
                            :key="index"
                            @click="updateItemsPerPage(number)"
                          >
                            <v-list-item-title>{{ number }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-spacer></v-spacer>

                      <span class="mr-4 grey--text">
                        Page {{ page }} of {{ numberOfPages }}
                      </span>
                      <v-btn
                        fab
                        dark
                        color="blue-grey darken-2"
                        class="mr-1"
                        @click="formerPage"
                      >
                        <v-icon>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn
                        fab
                        dark
                        color="blue-grey darken-3"
                        class="ml-1"
                        @click="nextPage"
                      >
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-row>
            </v-container>
          </v-col>

          <v-spacer vertical></v-spacer>

          <!-- Overview -->
          <v-col
            class="padding-border transition-width"
            v-show="showOverview"
            cols="12"
            md="6"
          >
            <v-container>
              <v-row class="padding-border">
                <p class="text-h6">Overview</p>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <!-- Modal Framework creation -->
    <AddFrameworkModal
      v-bind:show="frameworkModal"
      v-on:Close="frameworkModal = false"
    />
  </v-card>
</template>

<script lang="ts">
import { Framework } from "@/interface/framework/Framework";
import AddFrameworkModal from "@/components/framework/AddFrameworkModal.vue";
import Vue from "vue";

export default Vue.extend({
  name: "FrameworkWidget",

  components: {
    AddFrameworkModal,
  },

  data: () => ({
    showOverview: false,
    itemsPerPageArray: [10, 15, 20],

    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 10,
    sortBy: "name",
    loadingFrameworks: false,
    frameworkList: [] as Framework[],

    // Framework Modal
    frameworkModal: false,
  }),
});
</script>

<style scoped>
.transition-width {
  -webkit-transition: width 0.5s ease-in-out;
  -moz-transition: width 0.5s ease-in-out;
  -o-transition: width 0.5s ease-in-out;
  transition: width 0.5s ease-in-out;
}
</style>
