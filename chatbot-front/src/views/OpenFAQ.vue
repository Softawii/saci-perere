<template>
  <i-container>
    <i-row center style="margin-top: 20px">
      <i-button-group>
        <i-button color="primary" :to="{ name: 'Login'}">
          Login
        </i-button>
        <i-button>
          <ToggleMode />
        </i-button>
      </i-button-group>
    </i-row>
    <i-row center style="padding: 20px 0">
      <i-column xs="12" lg="4" style="padding: 10px 5px 0">
        <i-input v-model="nameFilter" placeholder="Digite para filtrar as categorias" clearable />
      </i-column>
      <i-column xs="12" lg="4" style="padding: 10px 5px 0">
        <i-input v-model="questionFilter" placeholder="Digite para filtrar as perguntas" clearable :disabled="questions.length === 0" />
      </i-column>
    </i-row>
    <i-row center>
      <i-column>
        <i-loader v-if="isLoadingCategories" />
        <i-button
          v-for="category in filteredCategories"
          v-else :key="category.id" class="_margin-x:1/2 _margin-y:1/2 _white-space:normal" outline
          color="primary" @click="getQuestions(category.id)"
        >
          {{ category.name }}
        </i-button>
      </i-column>
    </i-row>
    <i-row>
      <i-loader v-if="isLoadingQuestions" style="margin: auto" />
      <template v-for="question in filteredQuestions" v-else :key="question.id">
        <i-column sm="12" md="6">
          <i-card v-if="answers[question.id] && answers[question.id].length > 0" class="faq">
            <template #header>
              {{ question.question }}
            </template>
            <template v-if="answers[question.id]">
              <p v-for="(answer) in answers[question.id]" :key="answer">
                {{ answer.answer }}
              </p>
            </template>
          </i-card>
          <i-card v-else class="faq">
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
