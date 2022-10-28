<template>
  <!-- eslint-disable  vue/no-v-model-argument -->
  <SkeletonList v-if="isLoading" />
  <div v-else>
    <n-list hoverable clickable>
      <n-list-item v-for="topic in filteredCategories" :key="topic.name">
        <template #suffix>
          <n-dropdown trigger="hover" :options="topicOptions" @select="(key) => handleSelect(key, topic)">
            <n-button>
              <template #icon>
                <n-icon :component="EllipsisVerticalIcon" />
              </template>
            </n-button>
          </n-dropdown>
        </template>
        <n-thing :title="topic.name" content-style="margin-top: 10px;" @click="openCategory(topic)">
          <template #description>
            <n-space v-if="topic.favorite" size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="warning" size="small">
                Favorito
                <template #icon>
                  <n-icon :component="StarIcon" />
                </template>
              </n-tag>
            </n-space>
          </template>
          {{ topic.description }}
        </n-thing>
      </n-list-item>
    </n-list>
    <n-modal
      v-model:show="showDeleteModal"
      preset="dialog"
      type="error"
      title="Apagar tópico"
      :content="`Você realmente deseja apagar o tópico: '${currentTopic.name}'?`"
      positive-text="Apagar"
      negative-text="Cancelar"
      @positive-click="deleteCategory"
    />
    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 600px"
        :title="currentTopic.name"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="editTopicFormRef"
          :model="topicForm"
          :rules="topicFormRules"
          style="margin: auto; max-width: 600px;"
        >
          <n-form-item label="Nome do tópico" path="name">
            <n-input v-model:value="topicForm.name" placeholder="Nome do tópico" />
          </n-form-item>
          <n-form-item label="Descrição" path="description">
            <n-input
              v-model:value="topicForm.description" placeholder="Descrição" type="textarea"
              :autosize="{
                minRows: 3
              }"
            />
          </n-form-item>
          <n-button type="primary" block @click="submitEditCategory">
            Salvar
          </n-button>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import axios from 'axios';
import {
  Star as StarIcon,
  EllipsisVerticalOutline as EllipsisVerticalIcon,
  Trash as TrashIcon,
  DocumentText as DocumentTextIcon,
} from '@vicons/ionicons5';
import { useLoadingBar, useMessage, NIcon } from 'naive-ui';
import { h, ref } from 'vue';
import { useGlobalStore } from '../../store/GlobalStore';
import { useUserStore } from '../../store/UserStore';
import SkeletonList from '../SkeletonList.vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default {
  components: {
    SkeletonList,
  },
  props: {
    type: {
      type: String,
      default: 'all',
    },
  },
  setup() {
    const userStore = useUserStore();
    const editTopicFormRef = ref(null);
    const model = ref({
      name: '',
      description: '',
    });

    return {
      StarIcon,
      EllipsisVerticalIcon,
      globalStore: useGlobalStore(),
      loadingBar: useLoadingBar(),
      message: useMessage(),
      editTopicFormRef,
      topicForm: model,
      topicFormRules: {
        name: {
          required: true,
          message: 'Insira o nome do tópico',
          trigger: 'blur',
        },
        description: {
          required: false,
          trigger: 'blur',
        },
      },
      topicOptions: [
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
        {
          label: 'Favorito',
          key: 'favorite',
          icon: renderIcon(StarIcon),
        },
      ],
    };
  },
  data() {
    return {
      topics: [],
      currentTopic: {},
      showDeleteModal: false,
      showEditModal: false,
      isLoading: true,
    };
  },
  computed: {
    filteredCategories() {
      if (!this.globalStore.data?.topics) {
        return [];
      }
      return this.globalStore.data.topics.filter(topic => {
        if (this.type === 'favorites') return topic.favorite === true;
        return true;
      });
    },
  },
  mounted() {
    this.$emitter.on('refreshTopics', this.updateTopics);
    if (!this.globalStore.data.topics?.length) {
      this.updateTopics();
    } else {
      this.isLoading = false;
    }
  },
  unmounted() {
    this.$emitter.off('refreshTopics', this.updateTopics);
  },
  methods: {
    openCategory(topic) {
      this.globalStore.setCurrentCategory(topic);
      this.$router.push(`/topic/${topic.id}`);
    },
    handleSelect(key, topic) {
      this.currentTopic = topic;
      if (key === 'edit') {
        this.showEditModal = true;
        this.topicForm.name = topic.name;
        this.topicForm.description = topic.description;
      }
      if (key === 'delete') {
        this.showDeleteModal = true;
      }
      if (key === 'favorite') {
        if (topic.favorite) {
          const apiUrl = this.globalStore.apiUrl;
          axios.delete(`${apiUrl}/topic/favorite/${topic.id}`)
            .then(res => {
              this.message.success('Tópico definido como favorito');
            }).catch(err => {
              this.message.error('Ocorreu um erro ao adicionar um tópico como favorito');
            }).finally(() => {
              this.updateTopics();
            });
        } else {
          const apiUrl = this.globalStore.apiUrl;
          axios.post(`${apiUrl}/topic/favorite/${topic.id}`)
            .then(res => {
              this.message.success('Tópico definido como favorito');
            }).catch(err => {
              this.message.error('Ocorreu um erro ao adicionar um tópico como favorito');
            }).finally(() => {
              this.updateTopics();
            });
        }
      }
    },
    updateTopics() {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      this.isLoading = true;
      axios.get(`${apiUrl}/topic`)
        .then(res => {
          this.topics = res.data;
          this.globalStore.data.topics = this.topics;
          this.loadingBar.finish();
          this.message.success('Lista de tópicos foi atualizada');
        }).catch(err => {
          console.error(err);
          this.loadingBar.error();
          this.message.error('Erro ao tentar atualizar a lista de tópicos');
        }).finally(() => {
          this.isLoading = false;
        });
    },
    deleteCategory() {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.delete(`${apiUrl}/topic/${this.currentTopic.id}`)
        .then(res => {
          this.message.success(`Tópico ${this.currentTopic.name} apagado com sucesso`);
          this.loadingBar.finish();
        }).catch(err => {
          this.message.error(`Erro ao tentar apagar o tópico ${this.currentTopic.name}`);
          console.error(err);
          this.loadingBar.error();
        }).finally(() => {
          this.updateTopics();
        });
    },
    submitEditCategory() {
      this.editTopicFormRef.validate(
        errors => {
          if (!errors) {
            const API_URL = this.globalStore.apiUrl;
            this.loadingBar.start();
            axios.patch(`${API_URL}/topic/${this.currentTopic.id}`, {
              name: this.editTopicFormRef.model.name,
              description: this.editTopicFormRef.model.description || null,
            }).then(res => {
              this.message.success(`Tópico ${this.currentTopic.name} atualizado com sucesso`);
              this.loadingBar.finish();
              this.showEditModal = false;
            }).catch(err => {
              this.message.error(`Erro ao tentar editar o tópico ${this.currentTopic.name}`);
              console.error(err);
              this.loadingBar.error();
            }).finally(() => {
              this.updateTopics();
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

</style>
