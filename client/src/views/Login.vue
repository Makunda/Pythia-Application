<template>
  <LoginForm />
</template>

<script lang="ts">
import Vue from "vue";
import LoginForm from "../components/login/LoginForm.vue";

export default Vue.extend({
  name: "Login",

  components: {
    LoginForm,
  },
});
</script>
