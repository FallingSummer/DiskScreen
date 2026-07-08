<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { ChartPoint } from '@/types/ChartTypes';
import { DefaultChartOption, ChartThemeColors, TechPalette } from '@/config/ChartConfig';

const props = withDefaults(
  defineProps<{
    title: string;
    data: ChartPoint[];
    secondaryData?: ChartPoint[];
  }>(),
  {
    secondaryData: undefined,
  },
);

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function buildSeries() {
  const series: NonNullable<EChartsOption['series']> = [
    {
      name: props.title,
      type: 'line',
      smooth: true,
      data: props.data.map((item) => item.value),
      lineStyle: { color: TechPalette.series[0], width: 3, shadowBlur: 10, shadowColor: TechPalette.series[0] },
      areaStyle: {
        color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 246, 255, 0.35)' },
          { offset: 1, color: 'rgba(0, 246, 255, 0.02)' },
        ]),
      },
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: TechPalette.series[0], borderColor: '#fff', borderWidth: 2 },
      markPoint: {
        data: [
          { type: 'max', name: '最大值', itemStyle: { color: '#ffde00' } },
          { type: 'min', name: '最小值', itemStyle: { color: '#00baff' } },
        ],
        label: { color: '#fff', fontSize: 11 },
      },
      markLine: {
        silent: true,
        lineStyle: { color: 'rgba(0, 246, 255, 0.25)', type: 'dashed' },
        data: [{ type: 'average', name: '平均值' }],
        label: { color: '#8fcdfd', fontSize: 11, formatter: '平均: {c}' },
      },
    },
  ];

  if (props.secondaryData?.length) {
    series.push({
      name: '订单数',
      type: 'line',
      smooth: true,
      data: props.secondaryData.map((item) => item.value),
      lineStyle: { color: TechPalette.series[2], width: 3, shadowBlur: 10, shadowColor: TechPalette.series[2] },
      areaStyle: {
        color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 117, 255, 0.35)' },
          { offset: 1, color: 'rgba(0, 117, 255, 0.02)' },
        ]),
      },
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: TechPalette.series[2], borderColor: '#fff', borderWidth: 2 },
      markPoint: {
        data: [
          { type: 'max', name: '最大值', itemStyle: { color: '#ffde00' } },
        ],
        label: { color: '#fff', fontSize: 11 },
      },
    });
  }

  return series;
}

function renderChart() {
  if (!chartRef.value) {
    return;
  }

  chartInstance = echarts.init(chartRef.value);
  const option: EChartsOption = {
    ...DefaultChartOption(props.title),
    legend: {
      top: '8%',
      textStyle: { color: ChartThemeColors.text },
      itemGap: 20,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.name),
      axisLine: { lineStyle: { color: ChartThemeColors.text } },
      axisLabel: { color: ChartThemeColors.text },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: ChartThemeColors.text },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: buildSeries(),
    animationDuration: 1200,
    animationEasing: 'cubicOut',
  };

  chartInstance.setOption(option);
}

watch(
  () => [props.data, props.secondaryData],
  () => {
    if (chartInstance) {
      chartInstance.setOption({
        xAxis: { data: props.data.map((item) => item.name) },
        series: buildSeries(),
      });
    }
  },
  { deep: true },
);

onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  chartInstance?.dispose();
});
</script>

<template>
  <div ref="chartRef" class="chart-container" />
</template>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 300px;
}
</style>
