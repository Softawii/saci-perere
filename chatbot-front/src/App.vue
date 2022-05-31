<script setup>
</script>

<template>
  <div id="main" style="min-height: 100vh; min-width: 100vw;">
    <i-container>
      <i-navbar v-if="userStore.isAuthenticated" id="navbar" style="min-width: 99%; margin: 0 2px 4px;">
        <i-navbar-brand to="/">
          <span>
            Olá, {{ userStore.name }}
          </span>
        </i-navbar-brand>
        <i-navbar-collapsible class="_justify-content:flex-end">
          <i-nav>
            <i-nav-item to="/">
              Cadastrar Usuário
            </i-nav-item>
            <i-nav-item @click="logout">
              Logout
            </i-nav-item>
          </i-nav>
        </i-navbar-collapsible>
      </i-navbar>
    </i-container>
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

import { mapActions, mapStores } from 'pinia';
import { useUserStore } from './store/UserStore';

export default {
  components: {},
  data() {
    return {
    };
  },
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    ...mapActions(useUserStore, ['clearCredentials']),
    logout() {
      this.clearCredentials()
        .then(() => {
          this.$router.push({
            name: 'Login',
          });
        });
    },
  },
};
</script>
<style>
#main {
  background-color: #DDE2E4;
}
</style>
