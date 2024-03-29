<template>
  <n-card title="Estatísticas">
    <template v-if="isLoading">
      <n-skeleton text :repeat="10" />
    </template>
    <template v-else>
      <n-grid x-gap="12" cols="1 400:2 600:3 800:4" style="margin-bottom: 20px">
        <n-gi>
          <n-statistic label="Plataformas Registradas" :value="platforms.length" />
        </n-gi>
        <n-gi>
          <n-statistic label="Perguntas Feitas">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="stats.historyCount"
              :active="true"
              :duration="1000"
            />
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic label="Feedbacks do Usuário">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="stats.feedbackCount"
              :active="true"
              :duration="1000"
            />
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic label="Feedbacks Positivos">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="stats.positiveFeedbackCount"
              :active="true"
              :duration="1000"
            />
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic label="Feedbacks Negativos">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="stats.negativeFeedbackCount"
              :active="true"
              :duration="1000"
            />
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic label="Feedbacks em Texto">
            <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="0"
              :to="stats.textFeedbackCount"
              :active="true"
              :duration="1000"
            />
          </n-statistic>
        </n-gi>
      </n-grid>
      <n-card title="Plataformas" size="small">
        <n-collapse @item-header-click="handleItemHeaderClick">
          <n-collapse-item v-for="platform in platforms" :key="platform.name" :title="platform.name" :name="platform.name">
            <n-skeleton v-if="platform.isLoading" text :repeat="10" />
            <template v-else>
              <n-grid x-gap="12" cols="1 400:2 600:3 800:5">
                <n-gi>
                  <n-statistic label="Perguntas Feitas">
                    <n-number-animation
                      ref="numberAnimationInstRef"
                      show-separator
                      :from="0"
                      :to="platform.data.historyCount"
                      :active="true"
                      :duration="1000"
                    />
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="Feedbacks do Usuário">
                    <n-number-animation
                      ref="numberAnimationInstRef"
                      show-separator
                      :from="0"
                      :to="platform.data.feedbackCount"
                      :active="true"
                      :duration="1000"
                    />
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="Feedbacks Positivos">
                    <n-number-animation
                      ref="numberAnimationInstRef"
                      show-separator
                      :from="0"
                      :to="platform.data.positiveFeedbackCount"
                      :active="true"
                      :duration="1000"
                    />
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="Feedbacks Negativos">
                    <n-number-animation
                      ref="numberAnimationInstRef"
                      show-separator
                      :from="0"
                      :to="platform.data.negativeFeedbackCount"
                      :active="true"
                      :duration="1000"
                    />
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="Feedbacks em Texto">
                    <n-number-animation
                      ref="numberAnimationInstRef"
                      show-separator
                      :from="0"
                      :to="platform.data.textFeedbackCount"
                      :active="true"
                      :duration="1000"
                    />
                  </n-statistic>
                </n-gi>
              </n-grid>
              <component :is="platform.chart?.feedback" v-if="platform.chart?.feedback" style="max-width: 500px; margin: auto" />
              <n-collapse @item-header-click="handleTextFeedbackClick">
                <n-collapse-item title="Feedbacks em texto" :name="platform.name" style="margin: 0">
                  <n-data-table
                    :columns="platform.table.columns"
                    :data="platform.table.feedbacks"
                    :pagination="false"
                    :bordered="true"
                    :single-line="false"
                    :scroll-x="500"
                    striped
                  >
                    <template #empty>
                      <n-empty description="Nenhum registro encontrado" />
                    </template>
                  </n-data-table>
                  <div style="display:flex; margin-top: 10px;">
                    <n-pagination
                      v-model:page="platform.table.page" :page-count="platform.table.pages" :page-slot="6" style="margin: auto"
                      :on-update:page="page => pageUpdate(page, platform)"
                    />
                  </div>
                </n-collapse-item>
              </n-collapse>
            </template>
          </n-collapse-item>
        </n-collapse>
      </n-card>
    </template>
    <n-back-top :right="100" />
  </n-card>
</template>

<script>
import { h, ref } from 'vue';
import axios from 'axios';
import { Doughnut } from 'vue-chartjs';
import { useLoadingBar, useMessage } from 'naive-ui';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js';
import { useGlobalStore } from '../store/GlobalStore';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  components: {
    Doughnut,
  },
  setup() {
    return {
      globalStore: useGlobalStore(),
      loadingBar: useLoadingBar(),
      message: useMessage(),
    };
  },
  data() {
    return {
      isLoading: true,
      platforms: [],
      stats: {},
      statusLabel: {
        '-1': {
          label: 'Negative',
        },
        1: {
          label: 'Positive',
        },
        0: {
          label: 'Text',
        },
        Negative: {
          color: '#d73027',
        },
        Positive: {
          color: '#1a9850',
        },
        Text: {
          color: '#ffffbf',
        },
      },
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
        this.loadPlatformData(platform);
      }
    },
    handleTextFeedbackClick({ name, expanded }) {
      const platform = this.platforms.find(platform => platform.name === name);
      if (!platform.table.hasAlreadyExpanded) {
        platform.table.hasAlreadyExpanded = true;
        this.loadFeedbackHistory(1, platform);
      }
    },
    randomHex() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    },
    loadPlatforms() {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.get(`${apiUrl}/platform`)
        .then(async res => {
          this.platforms = res.data.map(platform => ({
            ...platform,
            name: this.toTitleCase(platform.name),
            data: {},
            isLoading: true,
            table: {
              columns: [
                {
                  title: 'ID',
                  key: 'id',
                  width: 100,
                  align: 'center',
                },
                {
                  title: 'Momento',
                  key: 'time',
                  width: 100,
                  align: 'center',
                  render: row => new Date(row.history.time).toLocaleString('pt-BR'),
                },
                {
                  title: 'Mensagem',
                  key: 'user_feedback',
                  align: 'left',
                },
              ],
              pageSize: ref(5),
              pageCount: ref(0),
              page: ref(1),
            },
          }));
          this.stats.historyCount = (await axios.get(`${apiUrl}/history/count`)).data;
          this.stats.historyCount = (await axios.get(`${apiUrl}/history/count`)).data;
          const feedbackRes = await axios.get(`${apiUrl}/feedback/count`);
          this.stats.feedbackCount = feedbackRes.data.reduce((count, currentStatus) => count + currentStatus._count.status, 0);
          this.stats.positiveFeedbackCount = feedbackRes.data.find(status => status.status === 1)?._count.status;
          this.stats.negativeFeedbackCount = feedbackRes.data.find(status => status.status === -1)?._count.status;
          this.stats.textFeedbackCount = feedbackRes.data.find(status => status.status === 0)?._count.status;
          this.loadingBar.finish();
        }).catch(reason => {
          console.error(reason.message);
          this.message.error(reason.message);
          this.loadingBar.error();
        }).finally(() => {
          this.isLoading = false;
        });
    },
    loadPlatformData(platform) {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.get(`${apiUrl}/feedback/count?platform=${platform.id}`)
        .then(async res => {
          platform.data.feedback = res.data.map(status => ({
            label: this.statusLabel[status.status].label,
            count: status._count.status,
          }));
          platform.data.feedbackCount = res.data.reduce((count, currentStatus) => count + currentStatus._count.status, 0);
          platform.data.positiveFeedbackCount = res.data.find(status => status.status === 1)?._count.status;
          platform.data.negativeFeedbackCount = res.data.find(status => status.status === -1)?._count.status;
          platform.data.textFeedbackCount = res.data.find(status => status.status === 0)?._count.status;
          const labels = platform.data.feedback.map(feedback => feedback.label);
          const data = platform.data.feedback.map(feedback => feedback.count);
          const title = 'Feedbacks';
          platform.chart = {};
          if (data.length > 0) platform.chart.feedback = this.generatePlatformFeedbackChart(labels, data, title);
          platform.data.historyCount = (await axios.get(`${apiUrl}/history/count?platform=${platform.id}`)).data;
          this.loadingBar.finish();
        }).catch(reason => {
          console.error(reason.message);
          this.message.error(reason.message);
          this.loadingBar.error();
        }).finally(() => {
          platform.isLoading = false;
        });
    },
    toTitleCase(str) {
      return str.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
      );
    },
    getFeedbackChartColors(labels) {
      const self = this;
      return labels.map(status => self.statusLabel[status].color);
    },
    generatePlatformFeedbackChart(labels, data, title) {
      const isMobile = window.innerWidth < 1024;
      const chartData = {
        labels,
        datasets: [
          {
            backgroundColor: this.getFeedbackChartColors(labels),
            data,
          },
        ],
      };
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            color: 'gray',
            padding: {
              bottom: 10,
            },
          },
          legend: {
            position: isMobile ? 'bottom' : 'right',
            labels: {
              color: 'gray',
            },
          },
        },
      };
      return h(
        Doughnut,
        {
          'chart-data': chartData,
          'chart-options': chartOptions,
        },
      );
    },
    pageUpdate(page, platform) {
      platform.table.page = page;
      this.loadFeedbackHistory(page, platform);
    },
    loadFeedbackHistory(page, platform) {
      const apiUrl = this.globalStore.apiUrl;
      this.loadingBar.start();
      axios.get(`${apiUrl}/feedback/text?platform=${platform.id}&${page ? `&page=${page}` : ''}`)
        .then(async res => {
          platform.table.feedbacks = res.data.data;
          platform.table.questionsCount = res.data.count;
          platform.table.pageSize = res.data.pageSize;
          platform.table.pages = res.data.pages;
          this.loadingBar.finish();
        }).catch(reason => {
          console.error(reason.message);
          this.message.error(reason.message);
          this.loadingBar.error();
        }).finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style>

</style>
