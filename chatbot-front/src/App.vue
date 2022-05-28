<script setup>
</script>

<template>
  <div>
    <!-- <Login /> -->
    <!-- <Home /> -->
    <Category />
  </div>
</template>
<script>
import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Category from './views/Category.vue';

export default {
  components: {
    Login,
    Home,
    Category,
  },
};
</script>
<style>
</style>
