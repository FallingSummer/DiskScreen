<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { ChartPoint } from '@/types/ChartTypes';
import { DefaultChartOption, ChartThemeColors, TechPalette } from '@/config/ChartConfig';

const props = defineProps<{
  title: string;
  data: ChartPoint[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function renderChart() {
  if (!chartRef.value) {
    return;
  }
  chartInstance = echarts.init(chartRef.value);
  const option: EChartsOption = {
    ...DefaultChartOption(props.title),
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.name),
      axisLine: { lineStyle: { color: TechPalette.axis } },
      axisLabel: { color: ChartThemeColors.text, fontSize: 12 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: ChartThemeColors.text },
      splitLine: { lineStyle: { color: TechPalette.splitLine } },
    },
    series: [{
      type: 'bar',
      data: props.data.map((item, index) => ({
        value: item.value,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: TechPalette.series[index % TechPalette.series.length] },
            { offset: 1, color: 'rgba(0,0,0,0.15)' },
          ]),
          borderRadius: [6, 6, 0, 0],
          shadowBlur: 10,
          shadowColor: TechPalette.series[index % TechPalette.series.length],
        },
      })),
      barWidth: '36%',
      label: {
        show: true,
        position: 'top',
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        formatter: '{c}',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowBlur: 4,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 246, 255, 0.5)',
        },
      },
      animationDuration: 1400,
      animationEasing: 'elasticOut',
      animationDelay: (idx: number) => idx * 150,
    }],
  };
  chartInstance.setOption(option);
}

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.setOption({
      xAxis: { data: props.data.map((item) => item.name) },
      series: [{
        data: props.data.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: TechPalette.series[index % TechPalette.series.length] },
              { offset: 1, color: 'rgba(0,0,0,0.15)' },
            ]),
            borderRadius: [6, 6, 0, 0],
            shadowBlur: 10,
            shadowColor: TechPalette.series[index % TechPalette.series.length],
          },
        })),
      }],
    });
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
