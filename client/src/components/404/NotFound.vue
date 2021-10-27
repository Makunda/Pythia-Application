<template>
  <v-container class="pa-0 main-container" fluid style="overflow-x: hidden">
    <v-container class="text-center">
      <v-row
        class="justify-center px-12"
        style="margin-top: -60px; transform: translateY(-50%)"
      >
        <v-col cols="6" class="d-flex flex-column">
          <span>
            <p class="text-h4 pt-8 white--text text-glow">4Ω4 - ΠOT FOUΠD</p>
            <p class="text-h2 white--text text-glow">
              Ψσυ'яє lσѕт σи <span class="warning--text">ρутнια</span>
            </p>
          </span>
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <div class="animated-logo">
            <span class="flame"> </span>
            <v-img
              :src="require('@/assets/logo.svg')"
              class="my-1 flame-image"
              contain
              height="200px"
              width="200px"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

// Basics
import flash, { FlashType } from "@/modules/flash/Flash";
import ApiResponseImpl from "@/utils/ApiResponseImpl";

export default Vue.extend({
  name: "NotFound",

  components: {
    // Components to include
  },

  mounted() {
    // On mounted
  },

  computed: {
    // Implement
  },

  methods: {
    // Populate with methods
  },

  data: () => ({
    // Populate with Data
  }),
});
</script>

<style scoped>
.padding-border {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Flame animation by Chalda Pnuzig : gg and thanks */
.main-container {
  background: #03101b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-glow {
  filter: blur(0.5px);
}

.animated-logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.animated-logo .flame-image {
  position: absolute;
  z-index: -1;
  top: 0;
}

.flame {
  z-index: -1;
  width: 150px;
  height: 150px;
  background: linear-gradient(-45deg, red, orange);
  border-radius: 150px 150px 0px 150px;
  transform: rotate(-135deg);
  animation: 0.1s flame infinite;
  filter: blur(10px);
  position: relative;
  box-shadow: 17px 20px 90px #700;
  border: 45px solid black;
  border-left-width: 25px;
  border-top-width: 25px;
}
.flame:after,
.flame:before {
  content: "";
  width: 100px;
  height: 100px;
  display: block;
  position: absolute;
  background: linear-gradient(-45deg, red, orange);
  animation: 0.2s flame infinite;
  transform: scale(0.8) rotate(20deg);
  border-radius: 100px 100px 0px 100px;
  top: 20px;
}
.flame:before {
  top: 0;
  animation-duration: 0.09s;
  transform: scale(0.9) rotate(-15deg) translate(10px, 0px);
}
@keyframes flame {
  0% {
    height: 150px;
    width: 150px;
  }
  50% {
    height: 140px;
    width: 140px;
  }
  100% {
    height: 150px;
    width: 150px;
  }
}
</style>
