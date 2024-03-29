<template>
  <div v-if="isLoading" id="container">
    <n-thing v-for="i in 5" :key="i">
      <template #header>
        <n-skeleton text width="100px" />
      </template>
      <template #description>
        <n-skeleton text width="500px" />
      </template>
      <n-skeleton text width="500px" />
      <template #footer>
        <n-skeleton text width="100px" />
        <n-divider />
      </template>
    </n-thing>
  </div>
  <div v-else id="container">
    <template v-if="questions?.length === 0">
      <n-empty description="Nenhuma pergunta não respondida cadastrada" />
    </template>
    <template v-else-if="questions">
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
        <template v-if="question.predicted_question_id">
          Pergunta não encontrada
        </template>
        <template v-else>
          Pergunta encontrada: {{ question.predicted_question || `Pergunta de ID '${question.predicted_question_id}' não encontrada` }}
        </template>
        <template #footer>
          Score: <n-tag>{{ question.predicted_score }}</n-tag>
          <n-divider />
        </template>
      </n-thing>
      <div style="display:flex; margin-top: 10px;">
        <n-pagination
          v-model:page="page" :page-count="pages" :page-slot="6" style="margin: auto"
          :on-update:page="page => pageUpdate(page)"
        />
      </div>
    </template>
    <n-back-top :right="100" />
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
      pageSize: ref(5),
      pageCount: ref(0),
      page: ref(1),
      pages: ref(1),
      userStore: useUserStore(),
      message: useMessage(),
      loadingBar: useLoadingBar(),
      questions: ref(),
      isLoading: ref(true),
    };
  },
  mounted() {
    this.updateUnknownQuestions();
  },
  methods: {
    updateUnknownQuestions(page) {
      const API_URL = import.meta.env.VITE_API_URL;
      this.loadingBar.start();
      this.isLoading = true;
      axios.get(`${API_URL}/question/unknown?${page ? `&page=${page}` : ''}`)
        .then(async res => {
          this.questions = res.data.data;
          this.pageSize = res.data.pageSize;
          this.pages = res.data.pages;
          await this.questions.forEach(question => {
            if (question.predicted_question_id) {
              axios.get(`${API_URL}/question/${question.predicted_question_id}`)
                .then(res => {
                  question.predicted_question = res.data.value;
                }).catch(err => {
                  console.error(err);
                });
            }
          });
          this.loadingBar.finish();
        }).catch(err => {
          console.error(err);
          this.loadingBar.error();
        }).finally(() => {
          this.isLoading = false;
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
    pageUpdate(page, platform) {
      this.page = page;
      this.updateUnknownQuestions(page);
    },
  },
});
</script>

<style lang="scss" scoped>
#container {
  padding: 20px
}
</style>
