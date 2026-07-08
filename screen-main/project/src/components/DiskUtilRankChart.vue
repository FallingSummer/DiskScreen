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

function buildOption(): EChartsOption {
  const sorted = [...props.data].sort((a, b) => a.value - b.value).slice(0, 10);
  const maxValue = sorted[sorted.length - 1]?.value || 1;

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(3, 16, 29, 0.92)',
      borderColor: 'rgba(0, 246, 255, 0.25)',
      textStyle: { color: ChartThemeColors.text },
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      max: maxValue,
      axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: sorted.map((item) => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: ChartThemeColors.text, fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        barWidth: 14,
        data: sorted.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: index > 6 ? '#ff4d4f' : index > 3 ? '#ffde00' : '#00f6ff' },
              { offset: 1, color: 'rgba(0,0,0,0.05)' },
            ]),
            borderRadius: [0, 6, 6, 0],
            shadowBlur: 6,
            shadowColor: index > 6 ? '#ff4d4f' : index > 3 ? '#ffde00' : '#00f6ff',
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: '#ffffff',
          fontSize: 11,
          formatter: '{c}%',
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 80,
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
  height: 280px;
}
</style>
