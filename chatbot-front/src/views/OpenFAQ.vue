<template>
  <i-container>
    <i-row center>
      <i-button color="primary" :to="{ name: 'Login'}">
        Login
      </i-button>
      <ToggleMode />
    </i-row>
    <i-row center>
      <i-input v-model="nameFilter" placeholder="Digite para filtrar as categorias" clearable />
    </i-row>
    <i-row center>
      <i-column>
        <i-button
          v-for="category in filteredCategories" :key="category.id" class="_margin-x:1/2 _margin-y:1/2 _white-space:normal" outline
          color="primary" @click="getQuestions(category.id)"
        >
          {{ category.name }}
        </i-button>
      </i-column>
    </i-row>
    <i-row center>
      <i-input v-model="questionFilter" placeholder="Digite para filtrar as perguntas" clearable :disabled="questions.length === 0" />
    </i-row>
    <i-row>
      <template v-for="question in filteredQuestions" :key="question.id">
        <i-column sm="12" md="6">
          <i-card v-if="answers[question.id] && answers[question.id].length > 0" style="width: 100%; margin: 0 10px 5px">
            <template #header>
              {{ question.question }}
            </template>
            <template v-if="answers[question.id]">
              <p v-for="(answer) in answers[question.id]" :key="answer">
                {{ answer.answer }}
              </p>
            </template>
          </i-card>
          <i-card v-else style="width: 100%; margin: 0 10px 5px">
            <template #header>
              {{ question.question }}
            </template>
            <p v-for="(answer,index) of answers[question.id]" :key="answer">
              <span>
                - {{ answer.answer }}
                <hr v-if="!(index === answers[question.id].length - 1)">
              </span>
            </p>
          </i-card>
        </i-column>
      </template>
    </i-row>
  </i-container>
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
      });
    },
    getQuestions(categoryId) {
      this.questionFilter = '';
      axios.post('/questions', {
        id: categoryId,
      }).then(response => {
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
