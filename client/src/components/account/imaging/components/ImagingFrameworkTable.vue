<template></template>

<script lang="ts">
import Vue from "vue";
import flash, { FlashType } from "@/modules/flash/Flash";
import ApiResponseImpl from "@/utils/ApiResponseImpl";
import ImagingFramework from "@/interface/imaging/ImagingFramework";

export default Vue.extend({
  name: "ImagingFrameworkTable",

  data: () => ({
    frameworkList: [] as ImagingFramework[],
  }),

  methods: {
    getTableList() {
      try {
      } catch (err) {}
    },
  },
});
</script>

<style></style>
