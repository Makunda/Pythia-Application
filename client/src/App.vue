<template>
  <v-app background-color="background">
    <v-app-bar app dark color="deepBlue" id="appBar">
      <v-btn @click="redirect('Home')" target="_blank" text>
        <v-img
          :src="require('./assets/logo.svg')"
          class="my-1"
          contain
          height="38px"
          width="50px"
        />
        <span class="mr-2 text-h4">Pythia</span>
      </v-btn>
      <v-btn @click="redirect('/framework')" target="_blank" text
        >Frameworks</v-btn
      >
      <v-btn target="_blank" text>Tags</v-btn>
      <v-btn target="_blank" text>Modernization</v-btn>

      <v-spacer></v-spacer>

      <!-- Login -->
      <v-btn
        v-if="!isAuthenticated()"
        @click="redirect('/login')"
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
            target="_blank"
            text
            v-bind="attrs"
            v-on="on"
          >
            <span class="mr-2">My Account</span>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in accountDropdown" :key="index">
            <v-list-item-title>
              <v-btn @click="redirect(item.component)">
                <span class="mr-2">{{ item.title }}</span>
              </v-btn>
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-title>
              <v-btn @click="logout()" text>
                <span class="mr-2">Log out</span>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
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
    console.log("Store", this.$store);
  },

  methods: {
    redirect(route: string) {
      this.$router.push({ path: route }).catch(() => {
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
    baseUrl: window.location.origin,

    accountDropdown: [],
  }),
});
</script>

<style scoped>
#appBar::after {
  content: "";
  display: block;
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  background-image: url("~@/assets/banner.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
