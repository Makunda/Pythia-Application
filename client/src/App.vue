<template>
  <v-app background-color="background">
    <v-app-bar app dark color="deepBlue" id="appBar" class="pa-0">
      <v-btn @click="redirect('/home')" target="_blank" text>
        <v-img
          :src="require('./assets/logo.svg')"
          class="my-1"
          contain
          height="38px"
          width="50px"
        />
        <span class="mr-2 text-h4">Pythia</span>
      </v-btn>

      <!-- Framework -->
      <v-menu offset-y open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="redirect('/frameworks')"
            :class="target == 'framework' ? 'active-tab-class' : 'tab-class'"
            target="_blank"
            v-bind="attrs"
            v-on="on"
            text
            >Frameworks</v-btn
          >
        </template>
        <v-list>
          <!-- Framework panel -->
          <v-container class="menu-panel">
            <!-- Titles -->
            <v-row>
              <v-col>
                <v-container>
                  <v-row
                    v-for="(section, i) in getTabSections('framework')"
                    :key="i"
                    class="d-flex flex-column"
                  >
                    <strong class="mb-3">{{ section.title }}</strong>
                    <p
                      class="pa-0 ma-0"
                      v-for="(item, i) in section.items"
                      :key="i"
                    >
                      <v-btn
                        small
                        color="l"
                        text
                        @click="redirect(item.redirect)"
                      >
                        <v-icon small class="mr-1">{{ item.icon }}</v-icon
                        >{{ item.name }}
                      </v-btn>
                    </p>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-list>
      </v-menu>

      <!-- Tags -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="redirect('/tags')"
            :class="target == 'tags' ? 'active-tab-class' : 'tab-class'"
            target="_blank"
            v-bind="attrs"
            v-on="on"
            text
            >Tags</v-btn
          >
        </template>
        <v-list> </v-list>
      </v-menu>

      <!-- Modernization -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="redirect('/modernization')"
            :class="
              target == 'modernization' ? 'active-tab-class' : 'tab-class'
            "
            target="_blank"
            v-bind="attrs"
            v-on="on"
            text
            >Modernization</v-btn
          >
        </template>
        <v-list> </v-list>
      </v-menu>

      <v-spacer></v-spacer>

      <!-- Login -->
      <v-btn
        v-if="!isAuthenticated()"
        @click="redirect('/login')"
        :class="target == 'login' ? 'active-tab-class' : 'tab-class'"
        target="_blank"
        text
      >
        <span class="mr-2">Login</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

      <v-menu v-else open-on-hover bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="redirect('/account')"
            :class="target == 'account' ? 'active-tab-class' : 'tab-class'"
            target="_blank"
            text
            v-bind="attrs"
            v-on="on"
          >
            <span class="mr-2">My Account</span>
          </v-btn>
        </template>

        <v-list>
          <!-- Framework panel -->
          <v-container class="menu-panel" style="min-width: 28vw !important">
            <!-- Titles -->
            <v-row>
              <v-col>
                <v-container>
                  <v-row class="d-flex flex-column">
                    <strong class="mb-3"> Account Management </strong>
                    <p class="pa-0 ma-0">
                      <v-btn small text @click="redirect('/account')">
                        <v-icon small class="mr-1">mdi-account</v-icon>View
                        account
                      </v-btn>
                    </p>
                    <v-divider></v-divider>
                    <p class="pa-0 ma-0">
                      <v-btn small text @click="logout()">
                        <v-icon small class="mr-1">mdi-account</v-icon>Log out
                      </v-btn>
                    </p>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main style="position: relative">
      <router-view style="min-height: 120%" />
    </v-main>

    <FlashMessage />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import CookieManager from "./utils/CookieManager";
import FlashMessage from "./modules/flash/FlashMessage.vue";

export default Vue.extend({
  name: "App",

  components: {
    FlashMessage,
  },

  mounted() {
    CookieManager.isAuthenticated();
  },

  methods: {
    getTabContent(tab: string) {
      return this.sectionsTab[tab];
    },

    getTabSize(tab: string) {
      return this.sectionsTab[tab].big;
    },

    getTabSections(tab: string) {
      return this.sectionsTab[tab].sections;
    },

    redirect(route: string) {
      this.target = route;
      this.$router.replace(route).catch(() => {
        /* Ignored */
      });
    },

    logout(): void {
      CookieManager.deleteAuthCookie();
      this.redirect("ome");
    },

    isAuthenticated() {
      return this.$store.getters.getAuthenticationStatus;
    },
  },

  data: () => ({
    target: "",
    baseUrl: window.location.origin,

    sectionsTab: {
      account: {
        name: "Account",
        big: false,
        sections: [
          {
            title: "Account Management",
            items: [
              { name: "Overview", screen: "overview", icon: "mdi-account" },
              { name: "Logout", screen: "overview", icon: "mdi-account" },
            ],
          },
        ],
      },

      framework: {
        big: true,
        name: "Frameworks",
        path: "frameworks",
        sections: [
          {
            title: "Framework Management",
            items: [
              {
                redirect: "/frameworks/explore",
                name: "Explore detected frameworks",
                icon: "mdi-magnify",
              },
              {
                redirect: "/frameworks/classification",
                name: "Explore frameworks categories",
                icon: "mdi-library-shelves",
              },
              {
                redirect: "/frameworks/review",
                name: "Framework review console",
                icon: "mdi-eye-check",
              },
            ],
          },
        ],
      },
    },

    accountDropdown: [],
  }),
});
</script>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 0px !important;
}

.active-tab-class::after {
  content: "";
  display: block;
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  z-index: 10;
  background-color: #e2e3e4;
}

.menu-panel {
  padding: 40px;
  min-width: 50vw;
  color: #051e34 !important;
}

#appBar::after {
  content: "";
  display: block;
  position: absolute;
  z-index: -1;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  background-image: url("~@/assets/banner.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.tab-class {
  min-width: 40px;
  height: 100% !important;
  border-radius: 0px;
}

.active-tab-class {
  color: #051e34;
  height: 100% !important;
  background-color: #f6f7f9;
  border: 0px solid #f6f7f9;
  border-radius: 0px;
}
</style>
