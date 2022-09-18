<template>
  <n-config-provider :theme="userStore.isDarkMode ? darkTheme : lightTheme">
    <n-message-provider>
      <n-loading-bar-provider>
        <div v-if="$route.meta.label" style="height: 100vh; width: 100vw;">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <div v-if="$route.meta.label === 'faq' || $route.meta.label === 'home' ">
                <n-layout-content>
                  <component :is="Component" :key="$route.name" />
                </n-layout-content>
              </div>
              <div v-else>
                <n-layout-header>
                  <Navbar v-if="$route.meta.label !== 'login'" />
                </n-layout-header>
                <n-layout-content>
                  <Sidebar @menu-updated="changeRoute">
                    <component :is="Component" :key="$route.name" />
                  </Sidebar>
                </n-layout-content>
              </div>
            </transition>
          </router-view>
        </div>
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script>
import { darkTheme, lightTheme } from 'naive-ui';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { useUserStore } from './store/UserStore';

export default {
  components: {
    Navbar,
    Sidebar,
  },
  setup() {
    const userStore = useUserStore();

    return {
      darkTheme,
      lightTheme,
      userStore,
    };
  },
  beforeMount() {
  },
  methods: {
    changeRoute(key) {
      this.$router.push(`/${key}`);
    },
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
