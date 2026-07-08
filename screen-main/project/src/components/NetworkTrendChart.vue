<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { ChartThemeColors, TechPalette } from '@/config/ChartConfig';

interface DataItem {
  hour: string;
  inflow: number;
  outflow: number;
}

const props = defineProps<{
  data: DataItem[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function buildOption(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(3, 16, 29, 0.92)',
      borderColor: 'rgba(0, 246, 255, 0.25)',
      textStyle: { color: ChartThemeColors.text },
    },
    legend: {
      top: '2%',
      textStyle: { color: ChartThemeColors.text },
      data: ['入网流量', '出网流量'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '14%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.map((d) => d.hour),
      axisLine: { lineStyle: { color: TechPalette.axis } },
      axisLabel: { color: ChartThemeColors.text, fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: ChartThemeColors.text },
      splitLine: { lineStyle: { color: TechPalette.splitLine } },
    },
    series: [
      {
        name: '入网流量',
        type: 'line',
        smooth: true,
        data: props.data.map((d) => d.inflow),
        lineStyle: { color: '#33D1C9', width: 3, shadowBlur: 10, shadowColor: '#33D1C9' },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(51, 209, 201, 0.35)' },
            { offset: 1, color: 'rgba(51, 209, 201, 0.02)' },
          ]),
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#33D1C9', borderColor: '#fff', borderWidth: 2 },
      },
      {
        name: '出网流量',
        type: 'line',
        smooth: true,
        data: props.data.map((d) => d.outflow),
        lineStyle: { color: '#8DBDFF', width: 3, shadowBlur: 10, shadowColor: '#8DBDFF' },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(141, 189, 255, 0.35)' },
            { offset: 1, color: 'rgba(141, 189, 255, 0.02)' },
          ]),
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#8DBDFF', borderColor: '#fff', borderWidth: 2 },
      },
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut',
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
