<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { ChartThemeColors, TechPalette } from '@/config/ChartConfig';

interface DataItem {
  hour: string;
  cpu: number;
  mem: number;
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
      data: ['CPU使用率', '内存使用'],
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
        name: 'CPU使用率',
        type: 'line',
        smooth: true,
        data: props.data.map((d) => d.cpu),
        lineStyle: { color: TechPalette.series[0], width: 3, shadowBlur: 10, shadowColor: TechPalette.series[0] },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 246, 255, 0.35)' },
            { offset: 1, color: 'rgba(0, 246, 255, 0.02)' },
          ]),
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: TechPalette.series[0], borderColor: '#fff', borderWidth: 2 },
      },
      {
        name: '内存使用',
        type: 'line',
        smooth: true,
        data: props.data.map((d) => d.mem),
        lineStyle: { color: TechPalette.series[2], width: 3, shadowBlur: 10, shadowColor: TechPalette.series[2] },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 117, 255, 0.35)' },
            { offset: 1, color: 'rgba(0, 117, 255, 0.02)' },
          ]),
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: TechPalette.series[2], borderColor: '#fff', borderWidth: 2 },
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
