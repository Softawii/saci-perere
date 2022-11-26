<template>
  <div id="container">
    <!-- eslint-disable  vue/no-v-model-argument -->
    <n-alert
      v-if="showPassword" title="Senha" type="info" closable
      style="margin-bottom: 20px;"
    >
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      A senha de "{{ userForm.name }}" é <n-tag type="warning"> {{ userPassword }} </n-tag>. <br>
      Avise para alterar no primeiro acesso
    </n-alert>
    <n-form
      ref="formRef"
      :model="userForm"
      :rules="rules"
      style="width: 100%; max-width: 500px;"
      @keyup.enter="submit"
    >
      <n-form-item label="Nome" path="name">
        <n-input v-model:value="userForm.name" placeholder="Fulano de Tal" />
      </n-form-item>
      <n-form-item label="Usuário" path="username">
        <n-input v-model:value="userForm.username" placeholder="fulano" />
      </n-form-item>
      <n-form-item label="E-mail" path="email">
        <n-auto-complete v-model:value="userForm.email" :options="emailAutoCompleteOptions" type="email" placeholder="fulano@mail.com" />
      </n-form-item>
      <n-button type="primary" block style="margin-top: 10px" @click="submit">
        Cadastrar
      </n-button>
    </n-form>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';

export default {
  setup() {
    const formRef = ref(null);
    const model = ref({
      name: '',
      username: '',
      email: '',
    });

    return {
      loadingBar: useLoadingBar(),
      message: useMessage(),
      formRef,
      userForm: model,
      userPassword: undefined,
      showPassword: false,
      rules: {
        name: {
          required: true,
          trigger: ['input', 'blur'],
          validator(rule, value) {
            const limit = 60;
            if (!value || !value.trim()) {
              return new Error('Campo é obrigatório');
            } if (value.length > limit) {
              return new Error(`O limite de caracteres é ${limit}, mas o campo possui ${value.length}`);
            }
            return true;
          },
        },
        username: {
          required: true,
          trigger: ['input', 'blur'],
          validator(rule, value) {
            const limit = 50;
            if (!value || !value.trim()) {
              return new Error('Campo é obrigatório');
            } if (value.length > limit) {
              return new Error(`O limite de caracteres é ${limit}, mas o campo possui ${value.length}`);
            }
            return true;
          },
        },
        email: {
          required: true,
          trigger: ['input', 'blur'],
          validator(rule, value) {
            const limit = 320;
            if (!value || !value.trim()) {
              return new Error('Campo é obrigatório');
            } if (value.length > limit) {
              return new Error(`O limite de caracteres é ${limit}, mas o campo possui ${value.length}`);
            }
            return true;
          },
        },
      },
      emailAutoCompleteOptions: computed(() => [
        '@gmail.com', '@hotmail.com', '@ufrrj.br',
      ].map(suffix => {
        const prefix = model.value.email.split('@')[0];
        return {
          label: prefix + suffix,
          value: prefix + suffix,
        };
      })),
    };
  },
  methods: {
    submit() {
      this.formRef.validate(
        errors => {
          if (!errors) {
            this.loadingBar.start();
            const API_URL = import.meta.env.VITE_API_URL;
            axios.post(`${API_URL}/auth/signup`, {
              username: this.formRef.model.username,
              email: this.formRef.model.email,
              name: this.formRef.model.name,
            }).then(res => {
              this.loadingBar.finish();
              this.message.success('Usuário cadastrado com sucesso');
              this.showPassword = true;
              this.userPassword = res.data.password;
            }).catch(err => {
              this.loadingBar.error();
              console.error(err);
              this.message.warning('Erro ao cadastrar usuário');
            }).finally(() => {
            });
          } else {
            alert(this.formRef);
          }
        },
      ).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - $nav-height);
  padding: 0 20px;
}
</style>
