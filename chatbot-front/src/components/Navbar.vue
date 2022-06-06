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
          <i-nav-item class="blue" @click="showCreateUserModal">
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
      <i-form v-model="profileForm">
        <i-form-group>
          <i-form-label>Nome:</i-form-label>
          <i-input name="name" placeholder="Seu nome" />
        </i-form-group>
        <i-form-group>
          <i-form-label>Usuário:</i-form-label>
          <i-input name="username" placeholder="Seu nome de usuário" />
        </i-form-group>
        <i-form-group>
          <i-form-label>E-mail:</i-form-label>
          <i-input name="email" placeholder="Seu e-mail" />
        </i-form-group>
        <i-form-group>
          <i-form-label>Senha:</i-form-label>
          <i-input name="password" placeholder="Digite sua nova senha ou deixe em branco" />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-button color="primary" @click="updateProfile">
              Atualizar Dados Pessoais
            </i-button>
          </i-row>
        </i-form-group>
      </i-form>
    </i-modal>
    <i-modal v-model="isCreatingUser">
      <template #header>
        Dados do Novo Usuário
      </template>
      <i-alert v-if="creatingUserError" color="danger" style="margin-bottom: 20px">
        <template #icon>
          <i-icon name="ink-danger" />
        </template>
        <p>{{ creatingUserError }}</p>
      </i-alert>
      <i-form v-model="newUserForm">
        <i-form-group>
          <i-form-label>Nome:</i-form-label>
          <i-input name="name" required placeholder="Nome" />
        </i-form-group>
        <i-form-group>
          <i-form-label>Usuário:</i-form-label>
          <i-input name="username" required placeholder="Nome de usuário" />
        </i-form-group>
        <i-form-group>
          <i-form-label>E-mail:</i-form-label>
          <i-input name="email" required placeholder="Seu e-mail" />
        </i-form-group>
        <i-form-group>
          <i-form-label>Senha:</i-form-label>
          <i-input name="password" required placeholder="Digite sua nova senha ou deixe em branco" />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-button color="primary" @click="createUser">
              Cadastrar Novo Usuário
            </i-button>
          </i-row>
        </i-form-group>
      </i-form>
    </i-modal>
  </div>
</template>
<script>
import axios from 'axios';
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
    const formSchemaNewUser = {
      username: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      password: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      name: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      email: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
    };
    const formSchemaProfile = {
      username: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      password: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      name: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      email: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
    };

    return {
      isShowingProfile: false,
      isCreatingUser: false,
      editProfileError: undefined,
      creatingUserError: undefined,
      newUserForm: this.$inkline.form(formSchemaNewUser),
      profileForm: this.$inkline.form(formSchemaProfile),
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
      const form = this.profileForm;
      this.isShowingProfile = true;
      form.name.value = this.userStore.name;
      form.username.value = this.userStore.username;
      form.email.value = this.userStore.email;
      form.password.value = '';
    },
    updateProfile() {
      alert('em dev');
    },
    showCreateUserModal() {
      this.isCreatingUser = true;
      this.userName = '';
      this.username = '';
      this.userEmail = '';
      this.userPassword = '';
    },
    createUser() {
      const form = this.newUserForm;
      const username = form.username.value;
      const password = form.password.value;
      const name = form.name.value;
      const email = form.email.value;

      const url = this.globalStore.apiUrl;
      axios.post(`${url}/auth/signup`, {
        username,
        password,
        name,
        email,
      }).then(response => {
        this.creatingUserError = 'sucesso';
      }).catch(err => {
        this.creatingUserError = err;
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
