<script setup>
</script>

<template>
  <div class="_background" style="min-height: 100vh; min-width: 100vw;">
    <router-link to="/">
      <n-button type="primary">
        Home
      </n-button>
    </router-link>
    <router-link to="/category">
      <n-button type="primary">
        Category
      </n-button>
    </router-link>
    <router-link to="/faq">
      <n-button type="primary">
        Faq
      </n-button>
    </router-link>
    <router-link to="/login">
      <n-button type="primary">
        Login
      </n-button>
    </router-link>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.name" />
      </transition>
    </router-view>
  </div>
</template>
<script>
import axios from 'axios';
import { useUserStore } from './store/UserStore';
import { useGlobalStore } from './store/GlobalStore';

export default {
  components: {
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

      /* eslint-disable no-param-reassign */
      config.baseURL = import.meta.env.VITE_API_URL;
      config.headers.Authorization = `Bearer ${userStore.token}`;
      config.headers.post['Content-Type'] = 'application/json';
      /* eslint-enable no-param-reassign */
      return config;
    }, error => Promise.reject(error));

    axios.interceptors.response.use(response => response, error => {
      console.error(error);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
