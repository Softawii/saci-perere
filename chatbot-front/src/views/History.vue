<template>
  <div v-if="isLoading">
    <n-skeleton text :repeat="10" />
  </div>
  <n-card v-else title="Plataformas" size="small">
    <n-collapse @item-header-click="handleItemHeaderClick">
      <n-collapse-item v-for="platform in platforms" :key="platform.name" :title="platform.name" :name="platform.name">
        <n-skeleton v-if="platform.isLoading" text :repeat="10" />
        <template v-else>
          <n-data-table
            :columns="table.columns"
            :data="platform.questions"
            :pagination="false"
            :bordered="true"
            :single-line="false"
            :row-class-name="table.rowClassName"
            :scroll-x="2500"
            striped
          >
            <template #empty>
              <n-empty description="Nenhum registro encontrado" />
            </template>
          </n-data-table>
          <div style="display:flex; margin-top: 10px;">
            <n-pagination
              v-model:page="page" :page-count="platform.pages" :page-slot="6" style="margin: auto"
              :on-update:page="page => pageUpdate(page, platform)"
            />
          </div>
        </template>
      </n-collapse-item>
    </n-collapse>
    <n-back-top :right="100" />
  </n-card>
</template>

<script>
import axios from 'axios';
import { useLoadingBar, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useGlobalStore } from '../store/GlobalStore';

export default {
  components: {},
  setup() {
    return {
      pageSize: ref(5),
      pageCount: ref(0),
      page: ref(1),
      globalStore: useGlobalStore(),
      loadingBar: useLoadingBar(),
      message: useMessage(),
      table: {
        columns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center',
          },
          {
            title: 'Momento',
            key: 'time',
            width: 100,
            align: 'center',
            render: row => new Date(row.time).toLocaleString('pt-BR'),
          },
          {
            title: 'Tópico',
            key: 'topic',
            className: 'topic',
            render: row => row?.question?.category?.topic?.name || 'Não encontrado',
          },
          {
            title: 'Categoria',
            key: 'category',
            className: 'category',
            render: row => row?.question?.category?.name || 'Não encontrada',
          },
          {
            title: 'Pergunta do Usuário',
            key: 'user_question',
          },
          {
            title: 'Pergunta Encontrada',
            key: 'found_question',
            className: 'found_question',
            render: row => row?.question?.value || 'Não encontrada',
          },
        ],
        rowClassName(row) {
          let className = '';
          if (!row?.question) {
            className += 'missing-question ';
          }
          if (!row?.question?.category) {
            className += 'missing-category ';
          }
          if (!row?.question?.category?.topic) {
            className += 'missing-topic';
          }
          return className;
        },
      },
    };
  },
  data() {
    return {
      isLoading: true,
      platforms: [],
    };
  },
  mounted() {
    this.loadPlatforms();
  },
  methods: {
    handleItemHeaderClick({ name, expanded }) {
      const platform = this.platforms.find(platform => platform.name === name);
      if (!platform.hasAlreadyExpanded) {
        platform.hasAlreadyExpanded = true;
        this.loadPlatformHistory(platform);
      }
    },
    loadPlatforms() {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.get(`${apiUrl}/platform`)
        .then(async res => {
          this.platforms = res.data.map(platform => ({
            ...platform,
            name: this.toTitleCase(platform.name),
            isLoading: true,
          }));
          this.loadingBar.finish();
        }).catch(reason => {
          console.error(reason.message);
          this.message.error(reason.message);
          this.loadingBar.error();
        }).finally(() => {
          this.isLoading = false;
        });
    },
    loadPlatformHistory(platform, page) {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.get(`${apiUrl}/history?platform=${platform.id}&detail=true${page ? `&page=${page}` : ''}`)
        .then(async res => {
          platform.questions = res.data.data;
          platform.questionsCount = res.data.count;
          platform.pageSize = res.data.pageSize;
          platform.pages = res.data.pages;
          platform.isLoading = false;
          this.loadingBar.finish();
        }).catch(reason => {
          console.error(reason.message);
          this.message.error(reason.message);
          this.loadingBar.error();
        }).finally(() => {
          this.isLoading = false;
        });
    },
    toTitleCase(str) {
      return str.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
      );
    },
    pageUpdate(page, platform) {
      this.page = page;
      this.loadPlatformHistory(platform, page);
    },
  },
};
</script>

<style scoped>
:deep(.missing-question .found_question),
:deep(.missing-category .category),
:deep(.missing-topic .topic) {
  color: red;
}
</style>
