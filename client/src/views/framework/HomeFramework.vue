<template>
  <FrameworkList />
</template>

<script lang="ts">
import Vue from "vue";
import FrameworkList from "../../components/framework/FrameworkList.vue";

export default Vue.extend({
  name: "HomeFramework",

  components: {
    FrameworkList,
  },
});
</script>
