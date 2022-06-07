<template>
  <i-container>
    <div class="_display:flex _justify-content:space-between">
      <div class="_font-size:xl" style="margin: 10px 10px 0">
        Perguntas e respostas:
      </div>
      <div class="_align-self:end" style="margin-right: 10px;">
        <Refresh @click="loadCategory" />
      </div>
    </div>
    <i-row>
      <!-- eslint-disable-next-line vue/no-v-for-template-key -->
      <template v-for="question in category.questions" :key="question.question">
        <i-card v-if="question.answers" style="width: 100%; margin: 0 10px 5px">
          <template #header>
            <div class="_clearfix">
              <span class="_vertical-align:text-top"> <!-- _float:right -->
                {{ question.question }}
              </span>
              <span class="_float:right">
                <i-dropdown>
                  <DotsVertical />
                  <template #body>
                    <i-dropdown-item>Editar</i-dropdown-item>
                    <i-dropdown-item @click="deleteQuestion(question.id)">Apagar</i-dropdown-item>
                  </template>
                </i-dropdown>
              </span>
            </div>
          </template>
          <template v-if="question.answers">
            <p v-for="answer in question.answers" :key="answer">
              {{ answer }}
            </p>
          </template>
        </i-card>
        <i-card v-else style="width: 100%; margin: 0 10px 5px">
          <template #header>
            <div class="_clearfix">
              <span class="_vertical-align:text-top"> <!-- _float:right -->
                {{ question.question }}
              </span>
              <span class="_float:right">
                <i-dropdown>
                  <DotsVertical />
                  <template #body>
                    <i-dropdown-item>Editar</i-dropdown-item>
                    <i-dropdown-item @click="deleteQuestion(question.id)">Apagar</i-dropdown-item>
                  </template>
                </i-dropdown>
              </span>
            </div>
          </template>
          <p v-for="(answer,index) of answers[question.id]" :key="answer">
            <span>
              - {{ answer.answer }}
              <hr v-if="!(index === answers[question.id].length - 1)">
            </span>
          </p>
        </i-card>
      </template>
    </i-row>
    <i-row center>
      <div @click="addQuestionModal">
        <p class="_font-size:xl" style="margin-bottom: 0">
          Adicionar mais perguntas
        </p>
        <i-icon name="ink-plus" />
      </div>
    </i-row>
    <i-modal v-model="isAddingQuestion">
      <template #header>
        Adicionar Pergunta
      </template>
      <i-alert v-if="addingQuestionError" color="danger" style="margin-bottom: 20px">
        <template #icon>
          <i-icon name="ink-danger" />
        </template>
        <p>{{ addingQuestionError }}</p>
      </i-alert>
      <i-form>
        <i-form-group>
          <i-form-label>Pergunta:</i-form-label>
          <i-input v-model="newQuestion" placeholder="Pergunta" required="true" :clearable="true" />
        </i-form-group>
        <i-form-group>
          <i-form-label>Resposta:</i-form-label>
          <i-input v-model="newAnswer" placeholder="Resposta" required="true" :clearable="true" />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-button color="primary" @click="addQuestion">
              Confirmar
            </i-button>
          </i-row>
        </i-form-group>
      </i-form>
    </i-modal>
  </i-container>
</template>

<script>
import axios from 'axios';
import { mapActions, mapStores } from 'pinia';
import { useUserStore } from '../store/UserStore';
import { useGlobalStore } from '../store/GlobalStore';

import DotsVertical from '../components/icons/DotsVertical.vue';
import Refresh from '../components/icons/Refresh.vue';

export default {
  components: {
    DotsVertical,
    Refresh,
  },
  data() {
    return {
      id: undefined,
      category: {},
      answers: {},
      isAddingQuestion: false,
      addingQuestionError: undefined,
      newQuestion: undefined,
      newAnswer: undefined,
    };
  },
  computed: {
    ...mapStores(useGlobalStore, useUserStore),
  },
  beforeMount() {
    this.id = this.$route.params.id;
    this.loadCategory();
  },
  methods: {
    loadCategory() {
      axios.post('/questions', {
        id: this.id,
      }).then(response => {
        this.category = response.data;
        this.category.questions.forEach(question => this.loadAnswers(question.id));
      });
    },
    loadAnswers(questionId) {
      axios.post('/answers', {
        id: questionId,
      }).then(response => {
        this.answers[questionId] = response.data;
      });
    },
    addQuestionModal() {
      this.newQuestion = '';
      this.newAnswer = '';
      this.addingQuestionError = undefined;
      this.isAddingQuestion = true;
    },
    addQuestion() {
      axios.post(`${this.globalStore.apiUrl}/questions/create`, {
        id: this.id,
        question: this.newQuestion,
        answer: this.newAnswer,
      }).then(() => {
        this.isAddingQuestion = false;
        this.loadCategory();
      }).catch(err => {
        console.error(err);
        this.addingQuestionError = err;
        this.loadCategory();
      });
    },
    deleteQuestion(id) {
      if (confirm('Você tem certeza disso?')) {
        axios.post(`${this.globalStore.apiUrl}/questions/delete`, {
          id,
        }).then(() => {
          this.loadCategory();
        }).catch(err => {
          console.error(err);
          this.loadCategory();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#main {
  background-color: #DDE2E4;
}
</style>
