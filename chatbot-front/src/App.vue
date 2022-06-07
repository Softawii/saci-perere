<script setup>
</script>

<template>
  <div class="_background" style="min-height: 100vh; min-width: 100vw;">
    <i-container>
      <Navbar />
    </i-container>
    <router-view />
  </div>
</template>
<script>
import axios from 'axios';
import { mapActions, mapStores } from 'pinia';
import Navbar from './components/Navbar.vue';
import { useUserStore } from './store/UserStore';
import { useGlobalStore } from './store/GlobalStore';

export default {
  components: {
    Navbar,
  },
  setup() {
    const userStore = useUserStore();
    const globalStore = useGlobalStore();
    axios.interceptors.request.use(config => {
      /* eslint-disable no-param-reassign */
      config.baseURL = globalStore.apiUrl;
      config.headers.Authorization = `Bearer ${userStore.token}`;
      config.headers.post['Content-Type'] = 'application/json';
      /* eslint-enable no-param-reassign */
      return config;
    }, error => Promise.reject(error));

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
