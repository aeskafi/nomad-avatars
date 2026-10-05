<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { useChartTheme } from '../../composables/useChartTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const props = defineProps<{
  labels: string[];
  values: number[];
  color: string;
  formatValue: (value: number) => string;
}>();

const { chartKey, tooltipConfig, gridColor, tickColor } = useChartTheme();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      borderColor: props.color,
      backgroundColor: props.color + '18',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 10,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: props.color,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      ...tooltipConfig(),
      displayColors: false,
      callbacks: {
        label: (ctx: any) => props.formatValue(ctx.parsed.y),
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: tickColor(),
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 8,
        font: { size: 12 },
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        color: gridColor(),
      },
      ticks: {
        color: tickColor(),
        callback: (value: any) => props.formatValue(value),
        font: { size: 12 },
      },
      border: {
        display: false,
      },
    },
  },
}));
</script>

<template>
  <div class="app-stats-chart">
    <Line :key="chartKey" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style lang="scss" scoped>
.app-stats-chart {
  height: 300px;
  position: relative;
}

@media (max-width: 640px) {
  .app-stats-chart {
    height: 220px;
  }
}
</style>
