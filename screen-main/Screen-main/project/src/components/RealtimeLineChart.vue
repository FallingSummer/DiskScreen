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
    chartType?: 'line' | 'radar';
  }>(),
  {
    title: '实时动态',
    data: () => [],
    chartType: 'line',
  },
);

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function renderChart() {
  if (!chartRef.value) {
    return;
  }

  chartInstance = echarts.init(chartRef.value);

  if (props.chartType === 'radar') {
    const option: EChartsOption = {
      ...DefaultChartOption(props.title),
      radar: {
        radius: '65%',
        indicator: props.data.map((item) => ({ name: item.name, max: 100 })),
        axisName: {
          color: ChartThemeColors.text,
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(0, 246, 255, 0.02)', 'rgba(0, 246, 255, 0.06)'],
          },
        },
        axisLine: {
          lineStyle: { color: TechPalette.axis },
        },
        splitLine: {
          lineStyle: { color: TechPalette.axis },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: props.data.map((item) => item.value),
              name: props.title,
              areaStyle: {
                color: new (echarts as any).graphic.RadialGradient(0.5, 0.5, 1, [
                  { offset: 0, color: 'rgba(0, 246, 255, 0.25)' },
                  { offset: 1, color: 'rgba(0, 246, 255, 0.05)' },
                ]),
              },
              lineStyle: { color: TechPalette.series[0], width: 2 },
              itemStyle: { color: TechPalette.series[0] },
            },
          ],
        },
      ],
    };
    chartInstance.setOption(option);
    return;
  }

  const option: EChartsOption = {
    ...DefaultChartOption(props.title),
    xAxis: {
      type: 'category',
      data: props.data.map((item) => item.name),
      axisLine: { lineStyle: { color: TechPalette.axis } },
      axisLabel: { color: ChartThemeColors.text },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: ChartThemeColors.text },
      splitLine: { lineStyle: { color: TechPalette.splitLine } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: props.data.map((item) => item.value),
        lineStyle: { color: TechPalette.series[1], width: 3 },
        areaStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 186, 255, 0.35)' },
            { offset: 1, color: 'rgba(0, 186, 255, 0.02)' },
          ]),
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: TechPalette.series[1], borderColor: '#fff', borderWidth: 1 },
      },
    ],
  };

  chartInstance.setOption(option);
}

watch(
  () => [props.data, props.chartType],
  () => {
    if (chartInstance) {
      renderChart();
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
