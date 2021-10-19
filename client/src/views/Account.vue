<template>
  <div>
    <v-navigation-drawer
      class="side-bar pa-0"
      color="lessDeepBlue"
      dark
      fixed
      permanent
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
    <div class="router-viewer">
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

  data() {
    return {
      // Tabs and section
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
              name: "Classification",
              screen: "frameworksClassification",
              icon: "mdi-file-tree",
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

.router-viewer {
  padding-left: 192px;
  width: 100%;
  min-height: 130%;
  overflow-x: hidden;
}
</style>
