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
      <div @click="openContextModal">
        <p class="_font-size:xl" style="margin-bottom: 0">
          Adicionar mais perguntas
        </p>
        <i-icon name="ink-plus" />
      </div>
    </i-row>
    <i-modal v-model="isAddingContext" size="lg">
      <template #header>
        Adicionar Contexto
      </template>
      <i-alert v-if="addingQuestionError" color="danger" style="margin-bottom: 20px">
        <template #icon>
          <i-icon name="ink-danger" />
        </template>
        <p>{{ addingQuestionError }}</p>
      </i-alert>
      <i-form v-model="form">
        <i-form-group>
          <i-form-label>Contexto:</i-form-label>
          <i-textarea
            placeholder="Contexto" name="context"
            required clearable style="min-height: 100px; max-height: 300px;"
          />
        </i-form-group>
        <i-form-group>
          <i-form-label>Pergunta:</i-form-label>
          <i-input
            placeholder="Pergunta" name="question"
            required clearable
          />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-button color="primary" @click="openQuestionModal">
              Próximo
            </i-button>
          </i-row>
        </i-form-group>
      </i-form>
    </i-modal>
    <i-modal v-model="isAddingQuestion" size="lg">
      <template #header>
        Adicionar Pergunta
      </template>
      <i-alert v-if="addingQuestionError" color="danger" style="margin-bottom: 20px">
        <template #icon>
          <i-icon name="ink-danger" />
        </template>
        <p>{{ addingQuestionError }}</p>
      </i-alert>
      <i-form v-model="form">
        <i-form-group>
          <i-form-label>Contexto:</i-form-label>
          <Selection
            :text="form.context.value" :button-text="'Definir resposta'" @selection="setAnswer"
          />
        </i-form-group>
        <i-form-group>
          <i-form-label>Pergunta:</i-form-label>
          <i-input
            v-model="form.question.value" readonly
          />
        </i-form-group>
        <i-form-group>
          <i-form-label>Resposta:</i-form-label>
          <i-textarea
            v-model="newAnswer" placeholder="Resposta" name="answer"
            readonly style="min-height: 100px; max-height: 300px;"
          />
        </i-form-group>
        <i-form-group>
          <i-row center>
            <i-button color="secondary" style="margin-right: 10px;" @click="reopenContextModal">
              Voltar
            </i-button>
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
import Selection from '../components/Selection.vue';

export default {
  components: {
    DotsVertical,
    Refresh,
    Selection,
  },
  data() {
    const formSchema = {
      question: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      context: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
      answer: {
        validators: [
          {
            name: 'required',
          },
        ],
      },
    };

    return {
      id: undefined,
      category: {},
      answers: {},
      isAddingContext: false,
      isAddingQuestion: false,
      addingQuestionError: undefined,
      newAnswer: undefined,
      newAnswerData: undefined,
      form: this.$inkline.form(formSchema),
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
    openQuestionModal() {
      const form = this.form;
      if (form.context.invalid || !form.context.value.trim()) {
        this.addingQuestionError = 'Contexto é inválido';
        return;
      }
      if (form.question.invalid || !form.question.value.trim()) {
        this.addingQuestionError = 'Pergunta é inválida';
        return;
      }

      this.isAddingContext = false;
      this.addingQuestionError = undefined;
      this.isAddingQuestion = true;
    },
    openContextModal() {
      // const form = this.form;
      // form.context.value = '';
      this.isAddingContext = true;
    },
    reopenContextModal() {
      this.isAddingQuestion = false;
      this.isAddingContext = true;
    },
    addQuestion() {
      const form = this.form;
      if (form.answer.value && !form.answer.value.trim()) {
        console.log(form.answer);
        this.addingQuestionError = 'Resposta é inválida';
        return;
      }

      axios.post('/questions/create', {
        id: this.id,
        question: form.question.value.trim(),
        answer: form.answer.value.trim(),
        answer_start: this.newAnswerData.start,
        context: form.context.value.trim(),
      }).then(() => {
        this.addingQuestionError = undefined;
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
        axios.post('/questions/delete', {
          id,
        }).then(() => {
          this.loadCategory();
        }).catch(err => {
          console.error(err);
          this.loadCategory();
        });
      }
    },
    setAnswer(data) {
      if (data) {
        this.form.answer.value = data.text;
        this.newAnswerData = data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
