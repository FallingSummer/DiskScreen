<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { ChartThemeColors } from '@/config/ChartConfig';

interface DataItem {
  name: string;
  value: number;
}

const props = defineProps<{
  data: DataItem[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const colors = ['#33D1C9', '#ffde00', '#ff4d4f'];

function buildOption(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(3, 16, 29, 0.92)',
      borderColor: 'rgba(0, 246, 255, 0.25)',
      textStyle: { color: ChartThemeColors.text },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: '2%',
      textStyle: { color: ChartThemeColors.text, fontSize: 11 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '46%'],
        data: props.data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colors[index % colors.length],
            shadowBlur: 8,
            shadowColor: colors[index % colors.length],
            borderRadius: 4,
          },
        })),
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 246, 255, 0.5)',
          },
        },
        label: {
          show: true,
          color: ChartThemeColors.text,
          formatter: '{b}\n{d}%',
          lineHeight: 14,
          fontSize: 11,
        },
        labelLine: {
          length: 8,
          length2: 10,
          lineStyle: { color: 'rgba(0, 246, 255, 0.2)' },
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 1000,
      },
    ],
  };
}

function renderChart() {
  if (!chartRef.value) return;
  chartInstance?.dispose();
  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(buildOption());
}

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.setOption(buildOption(), true);
  }
}, { deep: true });

onMounted(() => renderChart());
onBeforeUnmount(() => chartInstance?.dispose());
</script>

<template>
  <div ref="chartRef" class="chart-container" />
</template>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 260px;
}
</style>
