<script setup>
</script>

<template>
  <div id="main" style="min-height: 100vh; min-width: 100vw;">
    <i-container>
      <Navbar />
    </i-container>
    <router-view />
  </div>
</template>
<script>
import { mapActions, mapStores } from 'pinia';
import Navbar from './components/Navbar.vue';
import { useUserStore } from './store/UserStore';

export default {
  components: {
    Navbar,
  },
  setup() {
    return {
    };
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
  },
};
</script>
<style>
#main {
  background-color: #DDE2E4;
}
</style>
