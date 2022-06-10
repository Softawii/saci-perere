<script setup>
import axios from 'axios';
import { mapStores } from 'pinia';
import AccountIcon from '../components/icons/Account.vue';
import LockIcon from '../components/icons/Lock.vue';
import EyeIcon from '../components/icons/Eye.vue';
import EyeOffIcon from '../components/icons/EyeOff.vue';

import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';
</script>
<template>
  <div id="main" style="min-height: 100vh; display: flex; align-items: center;">
    <i-container>
      <i-row center style="">
        <h1 style="margin: 0 0 80px">
          SAMA
        </h1>
      </i-row>
      <i-row v-if="$route.query.unAuthenticated" center style="margin: 0 0 20px">
        <i-alert color="info">
          <template #icon>
            <i-icon name="ink-info" />
          </template>
          <p>Você não está autenticado para poder acessar a página.</p>
        </i-alert>
      </i-row>
      <i-row v-if="wrongCredentials" center style="margin: 0 0 20px">
        <i-alert color="danger">
          <template #icon>
            <i-icon name="ink-danger" />
          </template>
          <p>As credenciais inseridas estão incorretas.</p>
        </i-alert>
      </i-row>
      <i-row v-if="unexpectedError" center style="margin: 0 0 20px">
        <i-alert color="danger">
          <template #icon>
            <i-icon name="ink-danger" />
          </template>
          <p>Algo de errado ocorreu, entre em contato com os administradores.</p>
        </i-alert>
      </i-row>
      <i-row center style="">
        <i-form v-model="form" @submit="submit">
          <i-form-group>
            <i-input name="username" placeholder="Usuário">
              <template #prefix>
                <AccountIcon />
              </template>
            </i-input>
            <i-form-error for="username" />
          </i-form-group>

          <i-form-group>
            <i-input :type="isPasswordVisible? 'text' :'password'" name="password" placeholder="Senha">
              <template #prefix>
                <LockIcon />
              </template>
              <template #suffix>
                <EyeIcon v-if="isPasswordVisible" @click="togglePasswordVisibility" />
                <EyeOffIcon v-else @click="togglePasswordVisibility" />
              </template>
            </i-input>
            <i-form-error for="password" />
          </i-form-group>

          <i-form-group class="_margin-x:auto" style="max-width: 200px;">
            <i-button id="sign-in" outline color="primary">
              <span v-if="!loading">
                Entrar
              </span>
              <i-loader v-else />
            </i-button>
          </i-form-group>
        </i-form>
      </i-row>
    </i-container>
  </div>
</template>

<script>

import {mapStores} from "pinia";

export default {
  components: {
  },
  data() {
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
    return {
      isPasswordVisible: false,
      form: this.$inkline.form(formSchema),
      loading: false,
      wrongCredentials: false,
      unexpectedError: false,
    };
  },
  computed: {
    ...mapStores(useGlobalStore, useUserStore),
  },
  methods: {
    submit() {
      const form = this.form;
      const username = form.username.value;
      const password = form.password.value;

      this.loading = true;
      axios.post(`/auth/signin`, {
        username,
        password,
      }).then(response => {
        this.userStore.updateToken(response.data.token);
        this.$router.push({
          path: '/',
        });
      }).catch(err => {
        this.loading = false;
        if (err.response.status === 401) {
          this.wrongCredentials = true;
        } else {
          this.unexpectedError = true;
        }
      });
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  color: white;
  background-color: #023E8A;
}

#sign-in {
  border-width: 2px;
  border-color: white;
  width: 200px;
  color: white;
}
</style>
