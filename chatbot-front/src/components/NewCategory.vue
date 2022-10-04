<template>
  <div>
    <!-- eslint-disable  vue/no-v-model-argument -->
    <n-form
      ref="formRef"
      :model="categoryForm"
      :rules="rules"
      style="margin: auto; max-width: 600px;"
    >
      <n-form-item label="Nome da categoria" path="name">
        <n-input v-model:value="categoryForm.name" placeholder="Nome da categoria" />
      </n-form-item>
      <n-form-item label="Descrição" path="description">
        <n-input
          v-model:value="categoryForm.description" placeholder="Descrição" type="textarea"
          :autosize="{
            minRows: 3
          }"
        />
      </n-form-item>
      <n-button type="primary" block @click="submit">
        Salvar
      </n-button>
    </n-form>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoadingBar, useMessage } from 'naive-ui';
import { ref } from 'vue';

export default {
  setup() {
    const formRef = ref(null);
    const model = ref({
      name: '',
      description: '',
    });

    return {
      loadingBar: useLoadingBar(),
      message: useMessage(),
      formRef,
      categoryForm: model,
      rules: {
        name: {
          required: true,
          message: 'Insira o nome da categoria',
          trigger: 'blur',
        },
        description: {
          required: false,
          trigger: 'blur',
        },
      },
    };
  },
  methods: {
    submit() {
      this.formRef.validate(
        errors => {
          if (!errors) {
            const API_URL = import.meta.env.VITE_API_URL;
            this.loadingBar.start();
            axios.post(`${API_URL}/category`, {
              name: this.formRef.model.name,
              description: this.formRef.model.description || null,
            }).then(res => {
              this.loadingBar.finish();
              this.message.success('Categoria criada com sucesso');
            }).catch(err => {
              this.loadingBar.error();
              console.error(err);
              this.message.warning('Erro ao criar categoria');
            }).finally(() => {
              this.$emitter.emit('refreshCategories');
            });
          } else {
            // console.log(errors);
          }
        },
      ).catch(() => {});
    },
  },
};
</script>

<style>

</style>
