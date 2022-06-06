<script setup>
</script>

<template>
  <div id="main" style="min-height: 100vh; min-width: 100vw;">
    <i-container>
      <i-navbar v-if="userStore.isAuthenticated" id="navbar" class="blue" style="min-width: 99%; margin: 0px 2px 4px;">
        <i-navbar-brand to="/">
          <span style="color: #ffffff; font-weight: bolder;">
            Olá, {{ userStore.name }}
          </span>
        </i-navbar-brand>
        <i-navbar-collapsible class="blue _justify-content:flex-end">
          <i-nav>
            <i-nav-item class="blue" to="/">
              Cadastrar Usuário
            </i-nav-item>
            <i-nav-item class="blue" @click="logout">
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
  setup() {
    const userStore = useUserStore();

    return {
      userStore,
    };
  },
  data() {
    return {
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
