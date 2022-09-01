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
            {{ user.name }}
          </n-descriptions-item>
          <n-descriptions-item label="E-mail">
            {{ user.email }}
          </n-descriptions-item>
          <n-descriptions-item label="Usuário">
            {{ user.username }}
          </n-descriptions-item>
          <n-descriptions-item label="Admin">
            <n-tag :type="user.isAdmin? 'success' : 'error'">
              {{ user.isAdmin? 'Sim' : 'Não' }}
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
          <n-grid :span="24" :x-gap="12">
            <n-form-item-gi :span="24" label="Nome" path="name">
              <n-input v-model:value="userForm.name" placeholder="Fulano de Tal" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Usuário" path="username">
              <n-input v-model:value="userForm.username" placeholder="fulano" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="E-mail" path="email">
              <n-auto-complete v-model:value="userForm.email" :options="emailAutoCompleteOptions" type="email" placeholder="fulano@mail.com" />
            </n-form-item-gi>
            <n-form-item-gi :span="24">
              <n-button type="primary" block @click="submit">
                Atualizar dados
              </n-button>
            </n-form-item-gi>
            <n-form-item-gi :span="24">
              <n-button type="error" block @click="mode = 'details'">
                Voltar
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  props: {
    showProfileModal: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const formRef = ref(null);
    const model = ref({
      name: '',
      username: '',
      email: '',
    });

    return {
      formRef,
      userForm: model,
      rules: {
        name: {
          required: true,
          message: 'Insira o nome',
          trigger: 'blur',
        },
        username: {
          required: true,
          message: 'Insira o usuário',
          trigger: 'blur',
        },
        email: {
          required: true,
          message: 'Insira o e-mail',
          trigger: 'blur',
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
      mode: 'details',
    };
  },
  watch: {
    mode(newValue) {
      if (newValue === 'edit') {
        for (const key of Object.keys(this.userForm)) {
          if (key in this.user) {
            this.userForm[key] = this.user[key];
          }
        }
      }
    },
  },
  methods: {
    submit() {
      console.log(this.formRef.value);
      this.formRef.value?.validate(
        errors => {
          if (!errors) {
            alert(this.formRef);
          } else {
            alert(this.formRef);
          }
        },
      );
    },
  },
};
</script>

<style>

</style>
