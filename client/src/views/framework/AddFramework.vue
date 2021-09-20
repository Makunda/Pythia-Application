<template>
  <AddFrameworkModal />
</template>

<script lang="ts">
import Vue from "vue";
import AddFrameworkModal from "../../components/framework/AddFrameworkModal.vue";

export default Vue.extend({
  name: "AddFramework",

  components: {
    AddFrameworkModal,
  },
});
</script>
