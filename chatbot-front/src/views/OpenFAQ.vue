<template>
  <!-- eslint-disable  vue/no-v-model-argument -->
  <div id="container">
    <n-grid x-gap="6" y-gap="6" cols="s:1 m:5" responsive="screen">
      <n-gi span="3">
        <n-input v-model:value="pattern" placeholder="Pesquisar" clearable />
      </n-gi>
      <n-gi span="1">
        <n-button type="primary" block @click="$router.push('/login')">
          Fazer login
        </n-button>
      </n-gi>
      <n-gi span="1" style="margin: auto">
        <ToggleMode :size="20" />
      </n-gi>
    </n-grid>
    <n-result
      v-if="noCategories"
      title="Que pena"
      description="Nenhuma categoria cadastrada"
    >
      <template #icon />
    </n-result>
    <n-tree
      v-else
      block-line
      :show-irrelevant-nodes="false"
      :pattern="pattern"
      :data="data"
      :on-load="handleLoad"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useLoadingBar, useMessage } from 'naive-ui';
import ToggleMode from '../components/ToggleMode.vue';

export default {
  components: {
    ToggleMode,
  },
  data() {
    return {
      loadingBar: useLoadingBar(),
      message: useMessage(),
      pattern: ref(''),
      data: ref([]),
      noCategories: false,
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    handleLoad(node) {
      if (node.type === 'category') {
        return this.getQuestions(node);
      }
      if (node.type === 'question') {
        return this.getAnswers(node);
      }
      return undefined;
    },
    getCategories() {
      const vm = this;
      const API_URL = import.meta.env.VITE_API_URL;
      this.loadingBar.start();
      axios.get(`${API_URL}/category`)
        .then(res => {
          this.loadingBar.finish();
          if (!res.data?.length) {
            this.noCategories = true;
            return;
          }
          vm.data = res.data.map(category => ({
            key: `category_${category.id}`,
            label: category.name,
            isLeaf: false,
            type: 'category',
            id: category.id,
          }));
        }).catch(err => {
          this.message.error('Erro ao obter as categorias');
          console.error(err);
          this.loadingBar.error();
        });
    },
    async getQuestions(categoryNode) {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        this.loadingBar.start();
        const res = await axios.get(`${API_URL}/question/?category=${categoryNode.id}`);
        // eslint-disable-next-line no-param-reassign
        categoryNode.children = res.data.map(question => ({
          key: `question_${question.id}`,
          label: question.value,
          isLeaf: false,
          type: 'question',
          id: question.id,
          answer_id: question.answer_id,
        }));
      } catch (e) {
        console.error(e);
        this.message.error('Erro ao obter as perguntas');
        this.loadingBar.error();
      }
    },
    async getAnswers(questionNode) {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        const res = await axios.get(`${API_URL}/answer/${questionNode.answer_id}?questions=false`);
        const answer = res.data;
        // eslint-disable-next-line no-param-reassign
        questionNode.children = [
          {
            key: `answer_${answer.id}`,
            label: answer.value,
            isLeaf: true,
            type: 'answer',
            id: answer.id,
          },
        ];
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  height: 100vh;
  max-width: 600px;
  margin: auto;
  padding: 20px 10px;
}
</style>
