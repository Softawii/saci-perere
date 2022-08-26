<template>
  <div id="main">
    <n-h1>
      {{ name }}
      <n-tag v-if="isFavorite" :bordered="false" type="warning" size="small">
        Favorito
        <template #icon>
          <n-icon :component="StarIcon" />
        </template>
      </n-tag>
    </n-h1>
    <n-blockquote>
      {{ description }}
    </n-blockquote>
    <n-list id="list" hoverable clickable>
      <n-list-item v-for="qa in data" :key="qa.question">
        <template #suffix>
          <n-dropdown trigger="hover" :options="categoryOptions" @select="(key) => handleSelect(key, qa)">
            <n-button>
              <template #icon>
                <n-icon :component="EllipsisVerticalIcon" />
              </template>
            </n-button>
          </n-dropdown>
        </template>
        <n-thing :title="qa.question" content-style="margin-top: 10px;">
          {{ qa.answer }}
        </n-thing>
      </n-list-item>
    </n-list>
    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 600px"
        title="Modal"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          Oops!
        </template>
        Content
        <template #footer>
          Footer
        </template>
      </n-card>
    </n-modal>
    <n-modal
      v-model:show="showDeleteModal"
      preset="dialog"
      title="Apagar pergunta"
      :content="`Você realmente deseja apagar essa a pergunta: ${currentQA.question}`"
      positive-text="Apagar"
      negative-text="Cancelar"
      @positive-click="deleteQuestion"
    />
  </div>
</template>

<script>
import {
  Star as StarIcon,
  EllipsisVerticalOutline as EllipsisVerticalIcon,
} from '@vicons/ionicons5';

const category = {
  name: 'Ações, Programas e Políticas do SUS',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  isFavorite: true,
  id: 0,
  data: [
    {
      question: 'Como atua o Programa Nacional de Imunizações?',
      answer: 'O Programa Nacional de Imunizações tem avançado ano a ano para proporcionar melhor qualidade de vida à população com a prevenção de doenças.',
      id: 0,
    },
    {
      question: 'Como funciona o programa “O Brasil conta comigo” ?',
      answer: 'A Ação Estratégica foi instituída com o objetivo de mitigar os efeitos da COVID-19 no Sistema Único de Saúde (SUS), fortalecer o quadro de profissionais de saúde, ampliar a ',
      id: 1,
    },
  ],
};

export default {
  setup() {
    return {
      ...category,
      StarIcon,
      EllipsisVerticalIcon,
      categoryOptions: [
        {
          label: 'Apagar',
          key: 'delete',
        },
        {
          label: 'Editar',
          key: 'edit',
        },
      ],
    };
  },
  data() {
    return {
      showEditModal: false,
      showDeleteModal: false,
      currentQA: {},
    };
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
    deleteQuestion() {
      alert(`apagou: ${this.currentQA.question}`);
    },
    log(data) {
      console.log(data);
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
