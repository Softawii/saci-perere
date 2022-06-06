<template>
  <div>
    <i-navbar v-if="userStore.isAuthenticated" id="navbar" class="blue" style="min-width: 99%; margin: 0px 2px 4px;">
      <i-navbar-brand to="/">
        <span style="color: #ffffff; font-weight: bolder;">
          Olá, {{ userStore.name }}
        </span>
      </i-navbar-brand>
      <i-navbar-collapsible class="blue _justify-content:flex-end">
        <i-nav>
          <i-nav-item class="blue" @click="showProfile">
            Perfil
          </i-nav-item>
          <i-nav-item class="blue" to="/">
            Cadastrar Usuário
          </i-nav-item>
          <i-nav-item class="blue" @click="logout">
            Logout
          </i-nav-item>
        </i-nav>
      </i-navbar-collapsible>
    </i-navbar>
    <i-modal v-model="isShowingProfile">
      <template #header>
        Dados Pessoais
      </template>
      <i-alert v-if="editProfileError" color="danger" style="margin-bottom: 20px">
        <template #icon>
          <i-icon name="ink-danger" />
        </template>
        <p>{{ editProfileError }}</p>
      </i-alert>
      <i-form>
        <i-form-group>
          <i-form-label>Usuário:</i-form-label>
          <i-input v-model="username" placeholder="Seu nome de usuário" />
        </i-form-group>
        <i-form-group>
          <i-form-label>Nome:</i-form-label>
          <i-input v-model="userName" placeholder="Seu nome" />
        </i-form-group>
        <i-form-group>
          <i-form-label>E-mail:</i-form-label>
          <i-input v-model="userEmail" placeholder="Seu e-mail" />
        </i-form-group>
        <i-form-group>
          <i-form-label>Senha:</i-form-label>
          <i-input v-model="userPassword" placeholder="Digite sua nova senha ou deixe em branco" />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-button color="primary" @click="updateProfile">
              Atualizar
            </i-button>
          </i-row>
        </i-form-group>
      </i-form>
    </i-modal>
  </div>
</template>
<script>

import { mapActions, mapStores } from 'pinia';
import { useUserStore } from '../store/UserStore';

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
      isShowingProfile: false,
      userName: undefined,
      username: undefined,
      userEmail: undefined,
      userPassword: undefined,
      editProfileError: undefined,
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
    showProfile() {
      this.isShowingProfile = true;
      this.userName = this.userStore.name;
      this.username = this.userStore.username;
      this.userEmail = this.userStore.email;
      this.userPassword = '';
    },
    updateProfile() {
      alert('em dev');
    },
  },
};
</script>
<style>
#main {
  background-color: #DDE2E4;
}
</style>
