<template>
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
    <n-tree
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
import ToggleMode from '../components/ToggleMode.vue';

export default {
  components: {
    ToggleMode,
  },
  data() {
    return {
      pattern: ref(''),
      data: ref([]),
      categories: [],
      questions: [],
      answers: {},
      nameFilter: '',
      questionFilter: '',
      isLoadingCategories: true,
      isLoadingQuestions: false,
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category => category.name.toLowerCase().startsWith(this.nameFilter.toLowerCase()));
    },
    filteredQuestions() {
      return this.questions.filter(question => question.question.toLowerCase().startsWith(this.questionFilter.toLowerCase()));
    },
  },
  watch: {
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
      axios.get(`${API_URL}/category`)
        .then(res => {
          vm.data = res.data.map(category => ({
            key: `category_${category.id}`,
            label: category.name,
            isLeaf: false,
            type: 'category',
            id: category.id,
          }));
        });
    },
    async getQuestions(categoryNode) {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
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
