<template>
  <!-- eslint-disable  vue/no-v-model-argument -->
  <div id="main">
    <n-breadcrumb style="padding-top: 10px">
      <n-breadcrumb-item v-for="item in globalStore.breadcrumbNavigation" :key="item.name" @click="$router.push(item.path)">
        {{ item.name }}
      </n-breadcrumb-item>
    </n-breadcrumb>
    <n-h1 style="margin-top: 0">
      {{ category.name }}
      <n-tag v-if="category.favorite" :bordered="false" type="warning" size="small">
        Favorito
        <template #icon>
          <n-icon :component="StarIcon" />
        </template>
      </n-tag>
    </n-h1>
    <n-blockquote>
      {{ category.description }}
    </n-blockquote>
    <n-list v-if="questions.length" id="list" hoverable clickable>
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
        <n-thing :title="qa.value" content-style="margin-top: 10px;" @click="showDetails(qa)">
          {{ qa.answer }}
        </n-thing>
      </n-list-item>
    </n-list>
    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 600px"
        :title="currentQA.value"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          Oops!
        </template>
        {{ currentQA.answer }}
        <template #footer>
          Footer
        </template>
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
        {{ currentQA.answer }}
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
} from '@vicons/ionicons5';
import { useLoadingBar, NIcon } from 'naive-ui';
import { useGlobalStore } from '../store/GlobalStore';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default {
  setup() {
    return {
      StarIcon,
      EllipsisVerticalIcon,
      globalStore: useGlobalStore(),
      loadingBar: useLoadingBar(),
      qaOptions: [
        {
          label: 'Apagar',
          key: 'delete',
          icon: renderIcon(TrashIcon),
        },
        {
          label: 'Editar',
          key: 'edit',
          icon: renderIcon(DocumentTextIcon),
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
      currentQA: {},
      questions: [],
    };
  },
  watch: {
    '$route.params.id': function (previous, next) {
      if (next && previous && previous !== next) {
        this.updateData();
      }
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
      alert(`apagou: ${this.currentQA.value}`);
    },
    updateData() {
      const id = this.$route.params.id;
      const apiUrl = import.meta.env.VITE_API_URL;
      this.loadingBar.start();
      if (!this.globalStore.data.currentCategory) {
        axios.get(`${apiUrl}/category/${id}`)
          .then(res => {
            this.category = res.data;
            this.globalStore.setCurrentCategory(this.category);
          }).catch(err => {
            console.error(err);
          });
      } else {
        this.category = this.globalStore.data.currentCategory;
      }
      axios.get(`${apiUrl}/question/?category=${id}`)
        .then(res => {
          this.questions = res.data;
          Promise.all(
            this.questions.map(question => axios.get(`${apiUrl}/answer/${question.answer_id}?questions=false`)
              .then(res => {
              // eslint-disable-next-line no-param-reassign
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
        });
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
