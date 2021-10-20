<template>
  <div>
    <v-navigation-drawer
      :class="`${tinyScreen ? 'tiny-side-bar' : 'side-bar'} pa-0`"
      color="lessDeepBlue"
      dark
      fixed
      permanent
      :expand-on-hover="tinyScreen"
      shaped
    >
      <v-list
        class="pa-0"
        v-for="(section, i) in sections"
        v-bind:key="i"
        dense
        nav
      >
        <v-list-item-group>
          <!-- Section Title -->
          <v-list-item class="ml-1">
            <v-list-item-title color="#ffffff" class="text-uppercase text-h6"
              ><strong>{{ section.name }}</strong>
            </v-list-item-title>
          </v-list-item>

          <!-- List section -->
          <v-list-item
            dense
            class="pa-0 pl-3"
            style="background-color: #253d53"
            v-for="(v, i) in section.items"
            v-bind:key="i"
            link
            @click="goTo(v.screen)"
          >
            <v-list-item-icon>
              <v-icon color="#ffffff" class="pl-1">{{ v.icon }} </v-icon>
            </v-list-item-icon>
            <v-list-item-title color="#ffffff">{{ v.name }} </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>

    <!-- Router view  -->
    <div :class="tinyScreen ? 'tiny-router-viewer' : 'router-viewer'">
      <router-view v-slot="{ Component }" style="margin-left: 50px">
        <transition name="slide-fade">
          <component
            class=""
            :is="Component"
            style="background-color: #f7f7f7 !important"
          />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Home",

  methods: {
    goTo(section: string, absolute = false) {
      const path = absolute ? `/${section}` : `/account/${section}`;
      this.$router.replace(path).catch(() => {
        /** Ignored */
      });
    },
  },

  computed: {
    getWindowsWidth() {
      return window.innerWidth;
    },
  },

  mounted() {
    // Get windows height
    this.tinyScreen = window.innerWidth < 950;
    window.addEventListener("resize", () => {
      this.tinyScreen = window.innerWidth < 950;
    });
  },

  data() {
    return {
      // Tabs and section
      tinyScreen: false,
      tab: "Account$Overview",
      sections: [
        {
          name: "Account",
          items: [
            { name: "Overview", screen: "overview", icon: "mdi-account" },
          ],
        },

        {
          name: "Frameworks",
          items: [
            { name: "Explore all", screen: "frameworks", icon: "mdi-magnify" },
            {
              name: "Framework Tree",
              screen: "frameworkTree",
              icon: "mdi-file-tree",
            },
            {
              name: "Framework Categories",
              screen: "frameworksClassification",
              icon: "mdi-library-shelves",
            },
            {
              name: "Framework Review",
              screen: "frameworkReview",
              icon: "mdi-eye-check",
            },
          ],
        },
      ],
    };
  },
});
</script>

<style scoped>
.side-bar {
  margin-top: 64px;
  min-width: 64px;
}

.tiny-side-bar {
  margin-top: 60px;
  min-width: 64px;
}

.router-viewer {
  padding-left: 192px;
  width: 100%;
  min-height: 130%;
  overflow-x: hidden;
}

.tiny-router-viewer {
  padding-left: 12px;
  width: 100%;
  min-height: 130%;
  overflow-x: hidden;
}
</style>
