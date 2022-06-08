<template>
  <i-modal
    v-model="isVisible" color="warning" :close-on-press-escape="false" :hide-on-click-outside="false"
    :show-close="false"
  >
    <template #header>
      Token Expirado
    </template>
    <i-alert v-if="loginError" color="danger" style="margin-bottom: 20px">
      <template #icon>
        <i-icon name="ink-danger" />
      </template>
      <p>{{ loginError }}</p>
    </i-alert>
    <i-form v-model="form">
      <i-form-group>
        <i-form-label>Usuário</i-form-label>
        <i-input name="username" placeholder="Digite seu usuário..." />
      </i-form-group>
      <i-form-group>
        <i-form-label>Senha:</i-form-label>
        <i-input type="password" name="password" :placeholder="'Digite sua senha...'" />
      </i-form-group>
      <i-form-group>
        <i-row center>
          <i-button :color="!passwordIsFilled ? 'secondary' : 'danger'" :disabled="passwordIsFilled" @click="submit">
            Fazer Login
          </i-button>
        </i-row>
      </i-form-group>
    </i-form>
  </i-modal>
</template>

<script>
import axios from 'axios';
import { mapState } from 'pinia';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';

export default {
  setup() {
    const userStore = useUserStore();
    const globalStore = useGlobalStore();

    return {
      userStore,
      globalStore,
    };
  },
  data() {
    return {
      password: undefined,
      loginError: undefined,
      isVisible: false,
      form: this.getForm(),
    };
  },
  computed: {
    ...mapState(useUserStore, ['isAuthenticated', 'username']),
    passwordIsFilled() {
      return !(this.form.password.value.length !== 0);
    },
  },
  watch: {
    isAuthenticated(novo, antigo) {
      if (!novo && antigo) {
        this.isVisible = true;
      } else if (novo && !antigo) {
        this.isVisible = false;
      }
    },
    isVisible() {
      this.reset();
    },
  },
  methods: {
    reset() {
      this.form.username.value = this.userStore.username || '';
      this.form.password.value = '';
    },
    getForm() {
      const formSchema = {
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
      };
      return this.$inkline.form(formSchema);
    },
    submit() {
      const form = this.form;
      const username = form.username.value;
      const password = form.password.value;

      const url = this.globalStore.apiUrl;
      this.loading = true;
      axios.post(`${url}/auth/signin`, {
        username,
        password,
      }).then(response => {
        this.userStore.updateToken(response.data.token);
      }).catch(err => {
        if (err.response.status === 401) {
          this.loginError = 'Credenciais inválidas';
        } else {
          this.loginError = err;
        }
      });
    },
  },
};
</script>

<style>

</style>
