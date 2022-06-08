<script setup>
</script>

<template>
  <div class="_background" style="min-height: 100vh; min-width: 100vw;">
    <i-container>
      <Navbar />
      <!-- <LoginModal v-show="!userStore.isAuthenticated && $route.name !== 'Login'" /> -->
    </i-container>
    <router-view />
  </div>
</template>
<script>
import axios from 'axios';
import Navbar from './components/Navbar.vue';
import LoginModal from './components/LoginModal.vue';
import { useUserStore } from './store/UserStore';
import { useGlobalStore } from './store/GlobalStore';

export default {
  components: {
    Navbar,
    LoginModal,
  },
  setup() {
    const userStore = useUserStore();
    const globalStore = useGlobalStore();

    return {
      userStore,
      globalStore,
    };
  },
  beforeMount() {
    axios.interceptors.request.use(config => {
      const userStore = useUserStore();
      const globalStore = useGlobalStore();

      /* eslint-disable no-param-reassign */
      config.baseURL = globalStore.apiUrl;
      config.headers.Authorization = `Bearer ${userStore.token}`;
      config.headers.post['Content-Type'] = 'application/json';
      /* eslint-enable no-param-reassign */
      return config;
    }, error => Promise.reject(error));

    axios.interceptors.response.use(response => response, error => {
      if (error.response.status === 401) {
        const userStore = useUserStore();
        userStore.isAuthenticated = false;
        this.isExpiredToken = true;

        return Promise.reject(error);
      }
      return Promise.reject(error);
    });
  },
};
</script>
<style>
#main {
  background-color: #DDE2E4;
}
</style>
