<template>
  <div>
    faq
  </div>
</template>

<script>
import axios from 'axios';
import ToggleMode from '../components/ToggleMode.vue';

export default {
  components: {
    ToggleMode,
  },
  data() {
    return {
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
  beforeMount() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      axios.get('/categories', {
      }).then(response => {
        this.categories = response.data.categories;
        this.isLoadingCategories = false;
      });
    },
    getQuestions(categoryId) {
      this.isLoadingQuestions = true;
      this.questionFilter = '';
      axios.post('/questions', {
        id: categoryId,
      }).then(response => {
        this.isLoadingQuestions = false;
        this.questions = response.data.questions;
        this.questions.forEach(question => this.loadAnswers(question.id));
      });
    },
    loadAnswers(questionId) {
      axios.post('/answers', {
        id: questionId,
      }).then(response => {
        this.answers[questionId] = response.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
