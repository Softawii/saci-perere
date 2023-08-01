<template>
  <n-modal v-model:show="showProfileModal">
    <n-card
      style="width: 600px"
      title="Perfil"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template v-if="mode === 'details'">
        <n-descriptions label-placement="left" :columns="1">
          <n-descriptions-item label="Nome">
            {{ userStore.profile.name }}
          </n-descriptions-item>
          <n-descriptions-item label="E-mail">
            {{ userStore.profile.email }}
          </n-descriptions-item>
          <n-descriptions-item label="Usuário">
            {{ userStore.profile.username }}
          </n-descriptions-item>
          <n-descriptions-item label="Admin">
            <n-tag :type="userStore.profile.isadmin? 'success' : 'error'">
              {{ userStore.profile.isadmin? 'Sim' : 'Não' }}
            </n-tag>
          </n-descriptions-item>
        </n-descriptions>
        <n-button block type="primary" style="margin-top: 20px" @click="mode = 'edit'">
          Editar dados
        </n-button>
      </template>
      <template v-else-if="mode === 'edit'">
        <n-form
          ref="formRef"
          :model="userForm"
          :rules="rules"
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
          <n-form-item label="Senha" path="password">
            <n-auto-complete v-model:value="userForm.password" type="password" placeholder="Insira para atualizar" />
          </n-form-item>
          <n-button type="primary" block style="margin-bottom: 10px" @click="submit">
            Atualizar dados
          </n-button>
          <n-button type="error" block @click="mode = 'details'">
            Voltar
          </n-button>
        </n-form>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import { useUserStore } from '../../store/UserStore';

export default {
  emits: ['status'],
  setup() {
    const userStore = useUserStore();
    const formRef = ref(null);
    const model = ref({
      name: '',
      username: '',
      email: '',
    });

    return {
      loadingBar: useLoadingBar(),
      message: useMessage(),
      userStore,
      formRef,
      userForm: model,
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
        password: {
          required: false,
        },
      },
      emailAutoCompleteOptions: computed(() => ['@gmail.com', '@hotmail.com'].map(suffix => {
        const prefix = model.value.email.split('@')[0];
        return {
          label: prefix + suffix,
          value: prefix + suffix,
        };
      })),
    };
  },
  data() {
    return {
      showProfileModal: true,
      mode: 'details',
    };
  },
  watch: {
    showProfileModal(newValue) {
      if (!newValue) this.$emit('status');
    },
    mode(newValue) {
      if (newValue === 'edit') {
        for (const key of Object.keys(this.userForm)) {
          if (key in this.userStore.profile) {
            this.userForm[key] = this.userStore.profile[key];
          }
        }
      }
    },
  },
  methods: {
    submit() {
      this.formRef.validate(
        errors => {
          if (!errors) {
            this.loadingBar.start();
            const API_URL = import.meta.env.VITE_API_URL;
            axios.patch(`${API_URL}/user/profile`, {
              ...this.formRef.model,
            }).then(res => {
              this.userStore.setUserProfile(res.data);
              this.mode = 'details';
              this.message.success('Dados atualizados com sucesso');
              this.loadingBar.finish();
            }).catch(err => {
              this.loadingBar.error();
              console.error(err);
              this.message.warning('Erro ao atualizar perfil');
            });
          } else {
            this.message.warning('Formulário inválido');
          }
        },
      );
    },
  },
};
</script>

<style>

</style>
