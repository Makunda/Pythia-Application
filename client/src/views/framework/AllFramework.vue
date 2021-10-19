<template>
  <v-container class="pt-12" style="max-width: 60vw">
    <!-- Display if no framework was found -->
    <v-row v-if="loadingFrameworks" class="d-flex justify-space-between">
      <v-progress-circular
        size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <v-row class="pt-12">
      <p
        class="text-h3 text-center w-100 font-weight-light"
        style="width: 100%"
      >
        Search Frameworks
      </p>
    </v-row>
    <v-row>
      <v-container fluid>
        <v-data-iterator
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
              outlined
              prepend-inner-icon="mdi-magnify"
              label="Search framework"
              class="rounded-xl"
            ></v-text-field>
          </template>

          <template v-slot:default="props">
            <v-row
              class="pa-4 mt-1"
              v-for="item in props.items"
              :key="item.name"
            >
              <v-sheet
                color="#f4f4f4"
                elevation="5"
                min-height="60"
                outlined
                rounded
                class="rounded-pill"
                width="100%"
              >
                <v-container>
                  <v-row class="pl-4 pt-3">
                    <p style="text-overflow: ellipsis; width: 60%">
                      <span class="text-h6 font-weight-regular">{{
                        item.name
                      }}</span
                      >:
                      <span class="text-h6 font-weight-thin">{{
                        item.description
                      }}</span>
                    </p>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="grey"
                      fab
                      class="pr-2"
                      text
                      @click="viewFramework(item._id)"
                      style="margin-top: -14px"
                      ><v-icon large
                        >mdi-arrow-right-drop-circle-outline</v-icon
                      ></v-btn
                    >
                  </v-row>
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
                color="blue darken-3"
                class="mr-1"
                @click="formerPage"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                color="blue darken-3"
                class="ml-1"
                @click="nextPage"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-data-iterator>
      </v-container>
    </v-row>
    <v-row class="pt-12">
      <p
        class="text-center w-100 font-weight-light"
        style="width: 100%"
        @click="redirect()"
      >
        Start adding frameworks
      </p>
    </v-row>

    <!-- Add Framework Modal -->
    <AddFrameworkModal />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Logger from "@/utils/Logger";
import { Framework } from "@/interface/framework/Framework";
import FrameworkController from "@/controllers/framework/FrameworkController";
import flash, { FlashType } from "@/modules/flash/Flash";
import AddFrameworkModal from "@/components/account/frameworks/tiles/AddFrameworkModal.vue";

export default Vue.extend({
  name: "AllFramework",

  components: {
    AddFrameworkModal,
  },

  mounted() {
    this.getPoularFrameworks(); // retrieve list
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.frameworkList.length / this.itemsPerPage);
    },
  },

  methods: {
    //
    redirect(route: string) {
      this.$router.push({ name: route }).catch(() => {
        /* Ignored */
      });
    },

    // Go to a Framework
    viewFramework(frameworkId: number) {
      this.$router.push({ path: `/framework/view/${frameworkId}` });
    },

    /**
     * Get popular frameworks list
     */
    async getPoularFrameworks() {
      this.loadingFrameworks = true;

      try {
        const response = await FrameworkController.getPopularFrameworkList(20);

        if (response.isSuccess()) {
          this.frameworkList = response.getData();
        } else {
          // Display an error
          const errors = response.getErrors();
          for (const err of errors) {
            Logger.error("Failed to get the framework list.", err);
            flash.commit("add", {
              type: FlashType.ERROR,
              title: "Failed to get the framework list.",
              body: err,
            });
          }
        }
      } catch (err) {
        flash.commit("add", {
          type: FlashType.ERROR,
          title: "Failed to get the framework list.",
          body: err,
        });
      } finally {
        this.loadingFrameworks = false;
      }
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number: number) {
      this.itemsPerPage = number;
    },
  },

  data: () => ({
    itemsPerPageArray: [10, 15, 20],
    search: "",
    filter: {},
    sortDesc: false,
    page: 1,
    itemsPerPage: 10,
    sortBy: "name",
    loadingFrameworks: false,
    frameworkList: [] as Framework[],
  }),
});
</script>
