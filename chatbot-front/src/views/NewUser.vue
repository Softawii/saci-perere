<template>
  <div>
    <!-- eslint-disable  vue/no-v-model-argument -->
    <n-form
      ref="formRef"
      :model="userForm"
      :rules="rules"
      style="margin: auto; max-width: 600px;"
    >
      <n-grid :span="24" :x-gap="24">
        <n-form-item-gi :span="12" label="Nome" path="name">
          <n-input v-model:value="userForm.name" placeholder="Fulano de Tal" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Usuário" path="username">
          <n-input v-model:value="userForm.username" placeholder="fulano" />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="E-mail" path="email">
          <n-auto-complete v-model:value="userForm.email" :options="emailAutoCompleteOptions" type="email" placeholder="fulano@mail.com" />
        </n-form-item-gi>
        <n-form-item-gi :span="24">
          <n-button type="primary" block @click="submit">
            Validate
          </n-button>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
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
