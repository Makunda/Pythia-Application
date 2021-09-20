<template>
  <v-app>
    <v-app-bar app>
      <v-btn @click="redirect('Home')" target="_blank" text>
        <span class="mr-2 text-h4">Pythia</span>
      </v-btn>
      <v-btn @click="redirect('framework')" target="_blank" text
        >Frameworks</v-btn
      >
      <v-btn target="_blank" text>Tags</v-btn>
      <v-btn target="_blank" text>Modernization</v-btn>

      <v-spacer></v-spacer>

      <!-- Login -->
      <v-btn
        v-if="!isAuthenticated()"
        @click="redirect('Login')"
        target="_blank"
        text
      >
        <span class="mr-2">Login</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

      <v-menu v-else open-on-hover bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="redirect('Account')"
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
      <router-view />
      <FlashMessage />
    </v-main>
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
      this.$router.push({ name: route}).catch(() => {
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
