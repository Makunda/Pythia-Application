<template>
  <AddFrameworkModal />
</template>

<script lang="ts">
import Vue from "vue";
import AddFrameworkModal from "@/components/account/frameworks/tiles/AddFrameworkModal.vue";

export default Vue.extend({
  name: "AddFramework",

  components: {
    AddFrameworkModal,
  },
});
</script>
