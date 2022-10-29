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
      </n-grid>
      <n-card title="Plataformas" size="small">
        <n-collapse @item-header-click="handleItemHeaderClick">
          <n-collapse-item v-for="platform in platforms" :key="platform.name" :title="platform.name" :name="platform.name">
            <n-skeleton v-if="platform.isLoading" text :repeat="10" />
            <template v-else>
              <n-grid x-gap="12" cols="1 400:2 600:3 800:4">
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
              </n-grid>
              <component :is="platform.chart?.feedback" v-if="platform.chart?.feedback" />
            </template>
          </n-collapse-item>
        </n-collapse>
      </n-card>
    </template>
    <n-back-top :right="100" />
  </n-card>
</template>

<script>
import { h } from 'vue';
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
          color: '#b30000',
        },
        Positive: {
          color: '#2e7d32',
        },
        Text: {
          color: '#fff176',
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
          }));
          this.stats.historyCount = (await axios.get(`${apiUrl}/history/count`)).data;
          this.stats.historyCount = (await axios.get(`${apiUrl}/history/count`)).data;
          this.stats.feedbackCount = (await axios.get(`${apiUrl}/feedback/count`)).data
            .reduce((count, currentStatus) => count + currentStatus['_count'].status, 0);
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
          const labels = platform.data.feedback.map(feedback => feedback.label);
          const data = platform.data.feedback.map(feedback => feedback.count);
          const title = 'Feedbacks';
          platform.chart = {};
          platform.chart.feedback = this.generatePlatformFeedbackChart(labels, data, title);
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
  },
};
</script>

<style>

</style>
