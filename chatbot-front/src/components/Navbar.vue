<template>
  <div>
    <i-navbar v-if="userStore.isAuthenticated" id="navbar" class="blue" style="min-width: 99%; margin: 0px 2px 4px;">
      <i-navbar-brand to="/">
        <span style="font-weight: bolder;">
          Olá, {{ userStore.name }}
        </span>
      </i-navbar-brand>
      <i-navbar-collapsible class="_justify-content:flex-end">
        <i-nav>
          <i-nav-item @click="showProfile">
            Perfil
          </i-nav-item>
          <i-nav-item @click="showCreateUserModal">
            Cadastrar Usuário
          </i-nav-item>
          <i-nav-item @click="showReportsModal">
            Relatórios
          </i-nav-item>
          <i-nav-item @click="toggleThemeMode">
            Dark/Light
          </i-nav-item>
          <i-nav-item @click="logout">
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
    <i-modal v-model="isReportsModal">
      <template #header>
        Relatórios
      </template>
      <i-container>
        <i-row center>
          <i-card color="primary" style="width: 100%; margin-bottom: 2px;">
            <template #header>
              Completo
            </template>
            <i-button-group block>
              <i-button @click="fullReport(false)">
                Ver
              </i-button>
              <i-button disabled @click="fullReport(true)">
                Baixar
              </i-button>
            </i-button-group>
          </i-card>
          <i-card color="secondary" style="width: 100%">
            <template #header>
              Perguntas
            </template>
            <i-button-group block>
              <i-button @click="questionsReport(false)">
                Ver
              </i-button>
              <i-button disabled @click="questionsReport(false)">
                Baixar
              </i-button>
            </i-button-group>
          </i-card>
        </i-row>
      </i-container>
    </i-modal>
  </div>
</template>
<script>
import axios from 'axios';
import { mapActions, mapStores } from 'pinia';
import { getCurrentInstance } from 'vue';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';

export default {
  components: {},
  setup() {
    const userStore = useUserStore();
    const app = getCurrentInstance();

    return {
      userStore,
      app,
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
      isReportsModal: true,
    };
  },
  computed: {
    ...mapStores(useGlobalStore, useUserStore),
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

      axios.post('/auth/signup', {
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
    showReportsModal() {
      this.isReportsModal = true;
    },
    fullReport(download) {
      axios.get(`/report/full?download=${download}&parse=${!download}`)
        .then(response => {
          const blob = new Blob([JSON.stringify(response.data)], {
            type: 'application/json',
          });
          const fileUrl = window.URL.createObjectURL(blob);
          window.open(fileUrl);
        });
    },
    questionsReport(download) {
      axios.get(`/report/questions?download=${download}&parse=${!download}`)
        .then(response => {
          const blob = new Blob([JSON.stringify(response.data)], {
            type: 'application/json',
          });
          const fileUrl = window.URL.createObjectURL(blob);
          window.open(fileUrl);
        });
    },
    toggleThemeMode() {
      const app = this.app;
      const current = app.appContext.config.globalProperties.$inkline.options.colorMode;
      if (current === 'dark') app.appContext.config.globalProperties.$inkline.options.colorMode = 'light';
      else app.appContext.config.globalProperties.$inkline.options.colorMode = 'dark';
    },
  },
};
</script>
<style>
#main {
  background-color: #DDE2E4;
}
</style>
