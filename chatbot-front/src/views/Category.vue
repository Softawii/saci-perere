<template>
  <!-- eslint-disable  vue/no-v-model-argument -->
  <div id="main">
    <n-h1 v-if="isLoadingHeader" style="margin-top: 0">
      <n-skeleton text style="max-width: 400px" />
      <n-button
        strong secondary circle style="margin-left: 10px;"
        :disabled="true"
      >
        <template #icon>
          <n-icon :component="AddCircleIcon" />
        </template>
      </n-button>
    </n-h1>
    <n-h1 v-else style="margin-top: 0">
      {{ category.name }}
      <n-tag v-if="category.favorite" :bordered="false" type="warning" size="small">
        Favorito
        <template #icon>
          <n-icon :component="StarIcon" />
        </template>
      </n-tag>
      <n-button
        strong secondary circle style="margin-left: 10px;"
        :disabled="!userStore.profile.isadmin"
        @click="showCreateQAModal = true"
      >
        <template #icon>
          <n-icon :component="AddCircleIcon" />
        </template>
      </n-button>
    </n-h1>
    <n-blockquote>
      {{ category.description }}
    </n-blockquote>
    <SkeletonList v-if="isLoadingList" />
    <n-list v-else-if="questions.length" id="list" hoverable clickable>
      <n-list-item v-for="qa in questions" :key="qa.question">
        <template #suffix>
          <n-dropdown trigger="hover" :options="qaOptions" @select="(key) => handleSelect(key, qa)">
            <n-button>
              <template #icon>
                <n-icon :component="EllipsisVerticalIcon" />
              </template>
            </n-button>
          </n-dropdown>
        </template>
        <n-thing :title="qa.value" content-style="margin-top: 10px; word-wrap: anywhere;" @click="showDetails(qa)">
          {{ qa.answer.substr(0, 200) }} {{ qa.answer.length > 200 ? '...' : '' }}
        </n-thing>
      </n-list-item>
    </n-list>
    <n-modal v-model:show="showCreateQAModal">
      <n-card
        style="width: 600px"
        title="Cadastrar nova Pergunta"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="qaFormRef"
          :model="qaForm"
          :rules="qaFormRules"
          style="margin: auto; max-width: 600px;"
        >
          <n-form-item label="Pergunta" path="question">
            <n-input v-model:value="qaForm.question" placeholder="Pergunta" />
          </n-form-item>
          <n-form-item label="Resposta" path="answer">
            <n-input
              v-model:value="qaForm.answer" placeholder="Resposta" type="textarea"
              :autosize="{
                minRows: 3
              }"
            />
          </n-form-item>
          <n-button type="primary" block @click="submitNewQA">
            Salvar
          </n-button>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 600px"
        :title="currentQA.value"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="qaFormRef"
          :model="qaForm"
          :rules="qaFormRules"
          style="margin: auto; max-width: 600px;"
        >
          <n-form-item label="Pergunta" path="question">
            <n-input v-model:value="qaForm.question" placeholder="Pergunta" />
          </n-form-item>
          <n-form-item label="Resposta" path="answer">
            <n-input
              v-model:value="qaForm.answer" placeholder="Resposta" type="textarea"
              :autosize="{
                minRows: 3
              }"
            />
          </n-form-item>
          <n-button type="primary" block @click="submitEditQA">
            Salvar
          </n-button>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showDetailsModal">
      <n-card
        style="width: 600px"
        :title="currentQA.value"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div style="white-space: pre-wrap;">
          {{ currentQA.answer }}
        </div>
      </n-card>
    </n-modal>
    <n-modal
      v-model:show="showDeleteModal"
      preset="dialog"
      type="error"
      title="Apagar pergunta"
      :content="`Você realmente deseja apagar a pergunta: '${currentQA.value}'`"
      positive-text="Apagar"
      negative-text="Cancelar"
      @positive-click="deleteQuestion"
    />
    <n-back-top :right="100" />
  </div>
</template>

<script>
import { ref, h } from 'vue';
import axios from 'axios';
import {
  Star as StarIcon,
  EllipsisVerticalOutline as EllipsisVerticalIcon,
  Trash as TrashIcon,
  DocumentText as DocumentTextIcon,
  AddCircle as AddCircleIcon,
} from '@vicons/ionicons5';
import { useLoadingBar, useMessage, NIcon } from 'naive-ui';
import { useGlobalStore } from '../store/GlobalStore';
import { useUserStore } from '../store/UserStore';
import SkeletonList from '../components/SkeletonList.vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default {
  components: {
    SkeletonList,
  },
  setup() {
    const userStore = useUserStore();
    const qaFormRef = ref(null);
    const model = ref({
      name: '',
      description: '',
    });

    return {
      AddCircleIcon,
      StarIcon,
      EllipsisVerticalIcon,
      userStore,
      globalStore: useGlobalStore(),
      loadingBar: useLoadingBar(),
      message: useMessage(),
      qaFormRef,
      qaForm: model,
      qaFormRules: {
        question: {
          required: true,
          message: 'Insira a pergunta',
          trigger: 'blur',
        },
        answer: {
          required: true,
          message: 'Insira a resposta',
          trigger: 'blur',
        },
      },
      qaOptions: [
        {
          label: 'Apagar',
          key: 'delete',
          icon: renderIcon(TrashIcon),
          disabled: !userStore.profile.isadmin,
        },
        {
          label: 'Editar',
          key: 'edit',
          icon: renderIcon(DocumentTextIcon),
          disabled: !userStore.profile.isadmin,
        },
      ],
      category: ref({}),
    };
  },
  data() {
    return {
      showDetailsModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showCreateQAModal: false,
      currentQA: {},
      questions: [],
      isLoadingList: true,
      isLoadingHeader: true,
    };
  },
  watch: {
    '$route.params.id': function (previous, next) {
      if (next && previous && previous !== next) {
        this.updateData();
      }
    },
    showCreateQAModal() {
      this.qaForm.question = '';
      this.qaForm.answer = '';
    },
  },
  mounted() {
    this.updateData();
  },
  methods: {
    handleSelect(key, qa) {
      this.currentQA = qa;
      if (key === 'edit') {
        this.showEditModal = true;
        this.qaForm.question = qa.value;
        this.qaForm.answer = qa.answer;
      }
      if (key === 'delete') {
        this.showDeleteModal = true;
      }
    },
    showDetails(qa) {
      this.currentQA = qa;
      this.showDetailsModal = true;
    },
    deleteQuestion() {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.delete(`${apiUrl}/question/${this.currentQA.id}`)
        .then(res => {
          this.message.success('Pergunta apagada com sucesso');
          this.loadingBar.finish();
        }).catch(err => {
          this.message.error(`Erro ao tentar apagar a pergunta ${this.currentCategory.name}`);
          console.error(err);
          this.loadingBar.error();
        }).finally(() => {
          this.updateData(true);
        });
    },
    async updateData(force) {
      const id = this.$route.params.id;
      const apiUrl = import.meta.env.VITE_API_URL;
      this.loadingBar.start();
      if (!this.globalStore.data.currentCategory || force) {
        this.isLoadingHeader = true;
        axios.get(`${apiUrl}/category/${id}`)
          .then(res => {
            this.category = res.data;
            this.globalStore.setCurrentCategory(this.category);
            this.message.success('Perguntas atualizadas com sucesso');
          }).catch(err => {
            console.error(err);
            this.message.error('Erro ao tentar atualizar as perguntas');
          }).finally(() => {
            this.isLoadingHeader = false;
          });
      } else {
        this.category = this.globalStore.data.currentCategory;
        this.isLoadingHeader = false;
      }
      this.isLoadingList = true;
      axios.get(`${apiUrl}/question/?category=${id}`)
        .then(async res => {
          this.questions = res.data;
          await Promise.all(
            this.questions.map(question => axios.get(`${apiUrl}/answer/${question.answer_id}?questions=false`)
              .then(res => {
                question.answer = res.data.value;
              })),
          ).then(() => {
            this.loadingBar.finish();
          }).catch(err => {
            this.loadingBar.error();
          });
        }).catch(err => {
          console.error(err);
          this.loadingBar.error();
        }).finally(() => {
          this.isLoadingList = false;
        });
    },
    submitEditQA() {
      this.qaFormRef.validate(
        errors => {
          if (!errors) {
            const API_URL = this.globalStore.apiUrl;
            this.loadingBar.start();
            axios.patch(`${API_URL}/question/${this.currentQA.id}`, {
              question: this.qaFormRef.model.question,
              answer: this.qaFormRef.model.answer,
            }).then(res => {
              this.message.success('Pergunta atualizada com sucesso');
              this.loadingBar.finish();
              this.showEditModal = false;
            }).catch(err => {
              this.message.error('Erro ao tentar editar a pergunta');
              console.error(err);
              this.loadingBar.error();
            }).finally(() => {
              this.updateData(true);
            });
          } else {
            // console.log(errors);
          }
        },
      );
    },
    submitNewQA() {
      this.qaFormRef.validate(
        errors => {
          if (!errors) {
            const API_URL = this.globalStore.apiUrl;
            this.loadingBar.start();
            axios.post(`${API_URL}/question/?category=${this.category.id}`, {
              question: this.qaFormRef.model.question,
              answer: this.qaFormRef.model.answer,
            }).then(res => {
              this.message.success('Pergunta cadastrada com sucesso');
              this.loadingBar.finish();
              this.showCreateQAModal = false;
            }).catch(err => {
              this.message.error('Erro ao tentar cadastrar a pergunta');
              console.error(err);
              this.loadingBar.error();
            }).finally(() => {
              this.updateData(true);
            });
          } else {
            // console.log(errors);
          }
        },
      );
    },
  },
};
</script>

<style>
#main {
  margin-left: 20px;
  margin-right: 20px;
}

#list {
  padding: 10px;
}
</style>
