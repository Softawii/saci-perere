<template>
  <div id="container">
    <Logo style="padding: 20px 0" />
    <!-- eslint-disable  vue/no-v-model-argument -->
    <n-form
      ref="formRef"
      :model="loginForm"
      :rules="rules"
      style="max-width: 300px;"
      @keyup.enter="submit"
    >
      <n-alert v-if="loginErrorMessage" title="Erro ao fazer login" type="warning" style="margin-bottom: 20px;">
        {{ loginErrorMessage }}
      </n-alert>
      <n-form-item label="Usuário" path="username">
        <n-input v-model:value="loginForm.username" placeholder="fulano" />
      </n-form-item>
      <n-form-item label="Senha" path="password">
        <n-input v-model:value="loginForm.password" type="password" show-password-on="click" placeholder="123456" />
      </n-form-item>
      <n-button block type="primary" @click="submit">
        Fazer Login
      </n-button>
      <n-button block type="info" style="margin-top: 4px" @click="$router.push('/faq')">
        FAQ
      </n-button>
      <n-form-item :span="24">
        <ToggleMode style="margin: auto;" :size="20" />
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useLoadingBar } from 'naive-ui';
import Logo from '../components/Logo.vue';
import ToggleMode from '../components/ToggleMode.vue';
import { useUserStore } from '../store/UserStore';

export default {
  components: {
    Logo,
    ToggleMode,
  },
  setup() {
    const formRef = ref(null);
    const model = ref({
      username: '',
      password: '',
    });

    return {
      userStore: useUserStore(),
      loadingBar: useLoadingBar(),
      formRef,
      loginForm: model,
      rules: {
        password: {
          required: true,
          message: 'Insira a senha',
          trigger: 'blur',
        },
        username: {
          required: true,
          message: 'Insira o usuário',
          trigger: 'blur',
        },
      },
    };
  },
  data() {
    return {
      loginErrorMessage: undefined,
    };
  },
  methods: {
    submit() {
      this.formRef.validate(errors => {
        if (!errors) {
          const { username, password } = this.loginForm;
          const API_URL = import.meta.env.VITE_API_URL;
          this.loadingBar.start();
          this.loginErrorMessage = undefined;
          axios.post(`${API_URL}/auth/signin`, {
            username,
            password,
          }).then(res => {
            this.userStore.setUserProfile(res.data);
            axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
            this.loadingBar.finish();
            this.$router.push('/categories');
          }).catch(err => {
            const response = err.response;
            if (response.status === 403) {
              this.loginErrorMessage = 'Credenciais inválidas';
            } else if (err.message === 'Network Error') {
              this.loginErrorMessage = 'Ocorreu algum problema de rede';
            } else {
              this.loginErrorMessage = 'Aconteceu algo inesperado';
              console.error(err);
            }
            this.loadingBar.error();
          });
        } else {
          // console.log(errors);
        }
      }).catch(() => {});
    },
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
