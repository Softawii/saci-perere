<template>
  <n-card title="Estatísticas">
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
    <n-card title="Plataformas">
      <n-collapse @item-header-click="handleItemHeaderClick">
        <n-collapse-item v-for="platform in platforms" :key="platform.name" :title="platform.name" :name="platform.name">
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
          <Doughnut v-if="platform?.chart?.feedback" :chart-data="platform?.chart?.feedback" :chart-options="platform?.chart?.feedback.chartOptions" />
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </n-card>
</template>

<script>
import axios from 'axios';
import { Doughnut } from 'vue-chartjs';
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
    };
  },
  data() {
    return {
      platforms: [],
      stats: {},
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
      axios.get(`${apiUrl}/platform`)
        .then(res => {
          this.platforms = res.data.map(platform => ({
            ...platform,
            name: this.toTitleCase(platform.name),
            data: {},
          }));
        });
      axios.get(`${apiUrl}/history/count`)
        .then(res => {
          this.stats.historyCount = res.data;
        });
      axios.get(`${apiUrl}/history/count`)
        .then(res => {
          this.stats.historyCount = res.data;
        });
      axios.get(`${apiUrl}/feedback/count`)
        .then(res => {
          // eslint-disable-next-line dot-notation
          this.stats.feedbackCount = res.data.reduce((count, currentStatus) => count + currentStatus['_count'].status, 0);
        });
    },
    loadPlatformData(platform) {
      const statusLabel = {
        '-1': 'Negative',
        1: 'Positive',
        0: 'Text',
      };
      const apiUrl = this.globalStore.apiUrl;
      axios.get(`${apiUrl}/feedback/count?platform=${platform.id}`)
        .then(res => {
          platform.data.feedback = res.data.map(status => ({
            label: statusLabel[status.status],
            // eslint-disable-next-line dot-notation
            count: status['_count'].status,
          }));
          // eslint-disable-next-line dot-notation
          platform.data.feedbackCount = res.data.reduce((count, currentStatus) => count + currentStatus['_count'].status, 0);
          const labels = platform.data.feedback.map(feedback => feedback.label);
          const data = platform.data.feedback.map(feedback => feedback.count);
          const title = 'Feedbacks';
          platform.chart = {};
          platform.chart.feedback = this.generatePlatformFeedbackChart(labels, data, title);
        });
      axios.get(`${apiUrl}/history/count?platform=${platform.id}`)
        .then(res => {
          platform.data.historyCount = res.data;
        });
    },
    toTitleCase(str) {
      return str.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
      );
    },
    generatePlatformFeedbackChart(labels, data, title) {
      return {
        labels,
        datasets: [
          {
            backgroundColor: ['green', 'red', 'yellow', 'purple', 'cyan', 'orange'],
            data,
          },
        ],
        chartOptions: {
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
        },
      };
    },
  },
};
</script>

<style>

</style>
