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
        <n-form-item-gi :span="24" label="Nome da categoria" path="name">
          <n-input v-model:value="userForm.name" placeholder="Nome da categoria" />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="Descrição" path="description">
          <n-input
            v-model:value="userForm.username" placeholder="Descrição" type="textarea"
            :autosize="{
              minRows: 3
            }"
          />
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
      description: '',
    });

    return {
      formRef,
      userForm: model,
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
