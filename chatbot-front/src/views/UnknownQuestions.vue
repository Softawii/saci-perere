<template>
  <div id="container">
    <n-thing v-for="question in questions" :key="question.id">
      <template #header>
        ID: {{ question.id }}
      </template>
      <template #header-extra>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-popconfirm
              positive-text="Apagar"
              negative-text="Cancelar"
              :positive-button-props="{'type':'error'}"
              @positive-click="deleteQuestion(question.id)"
            >
              <template #trigger>
                <n-button
                  circle size="small" type="error" :disabled="!userStore.profile.isadmin"
                >
                  <template #icon>
                    <CloseCircleIcon />
                  </template>
                </n-button>
              </template>
              Realmente deseja apagar?
            </n-popconfirm>
          </template>
          Apagar
        </n-tooltip>
      </template>
      <template #description>
        Pergunta do usuário: {{ question.user_question }}
      </template>
      Pergunta do encontrada: {{ question.predicted_question || `Pergunta de ID '${question.predicted_question_id}' não encontrada` }}
      <template #footer>
        Score: <n-tag>{{ question.predicted_score }}</n-tag>
        <n-divider />
      </template>
    </n-thing>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import { CloseCircle as CloseCircleIcon } from '@vicons/ionicons5';
import { useUserStore } from '../store/UserStore';

export default defineComponent({
  components: {
    CloseCircleIcon,
  },
  setup() {
    return {
      userStore: useUserStore(),
      message: useMessage(),
      loadingBar: useLoadingBar(),
      questions: ref([]),
    };
  },
  mounted() {
    this.updateUnknownQuestions();
  },
  methods: {
    updateUnknownQuestions() {
      const API_URL = import.meta.env.VITE_API_URL;
      this.loadingBar.start();
      axios.get(`${API_URL}/question/unknown`)
        .then(res => {
          this.questions = res.data;
          this.questions.forEach(question => {
            axios.get(`${API_URL}/question/${question.predicted_question_id}`)
              .then(res => {
                // eslint-disable-next-line no-param-reassign
                question.predicted_question = res.data.value;
              }).catch(err => {
                console.error(err);
              });
          });
          this.loadingBar.finish();
        }).catch(err => {
          console.error(err);
          this.loadingBar.error();
        });
    },
    deleteQuestion(id) {
      const API_URL = import.meta.env.VITE_API_URL;
      this.loadingBar.start();
      axios.delete(`${API_URL}/question/unknown/${id}`)
        .then(res => {
          this.loadingBar.finish();
          this.message.success('Pergunta removida com sucesso');
        }).catch(err => {
          console.error(err);
          this.loadingBar.error();
          this.message.success('Erro ao tentar remover a pergunta');
        }).finally(() => {
          this.updateUnknownQuestions();
        });
    },
  },
});
</script>

<style lang="scss" scoped>
#container {
  padding: 20px
}
</style>
