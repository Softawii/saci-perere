<script setup>
</script>

<template>
  <div>
    <div style="text-align: center">
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/login">
        Login
      </router-link> |
      <router-link to="/category">
        Category
      </router-link>
    </div>
    <router-view />
  </div>
</template>
<script>

export default {
  components: {},
  setup() {
  },
};
</script>
<style>
</style>
