<template>
  <div id="container">
    <Logo style="padding: 20px 0" />
    <!-- eslint-disable  vue/no-v-model-argument -->
    <n-form
      ref="formRef"
      :model="loginForm"
      :rules="rules"
      style="max-width: 300px;"
    >
      <n-form-item label="Usuário" path="username">
        <n-input v-model:value="loginForm.username" placeholder="fulano" />
      </n-form-item>
      <n-form-item label="Senha" path="password">
        <n-input v-model:value="loginForm.password" type="password" show-password-on="click" placeholder="123456" />
      </n-form-item>
      <n-form-item :span="24">
        <n-button block type="primary" @click="submit">
          Fazer Login
        </n-button>
      </n-form-item>
      <n-form-item :span="24">
        <ToggleMode style="margin: auto;" :size="20" />
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Logo from '../components/Logo.vue';
import ToggleMode from '../components/ToggleMode.vue';

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
  methods: {
    submit() {
      this.$router.push('/');
    },
  },
};
</script>

<style>
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
