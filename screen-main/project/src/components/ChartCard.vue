/**
 * 该文件为通用 ECharts 图表组件，通过传入 type 与 data 渲染折线/面积图、饼图、横向条形图。
 * 不可合并：被 IndexView 引用 4 次（CPU趋势、网络趋势、告警饼图、磁盘排行），
 * 是 4 个旧图表组件（CpuMemoryTrendChart、NetworkTrendChart、AlertPieChart、DiskUtilRankChart）合并后的唯一图表载体；
 * 若内联到 IndexView 会造成页面文件超过 500 行且丧失复用能力。
 */
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { ChartThemeColors, TechPalette } from '@/config/ChartConfig';

type ChartType = 'line-area' | 'pie' | 'rank-bar';

interface LineItem {
  hour: string;
  [key: string]: number | string;
}

interface PieItem {
  name: string;
  value: number;
}

interface RankItem {
  name: string;
  value: number;
}

const props = defineProps<{
  type: ChartType;
  title: string;
  data: LineItem[] | PieItem[] | RankItem[];
  seriesNames?: string[];
  colors?: string[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const pieColors = ['#33D1C9', '#ffde00', '#ff4d4f'];

function buildLineOption(): EChartsOption {
  const d = props.data as LineItem[];
  const keys = props.seriesNames || [];
  const palette = props.colors || ['#00f6ff', '#0075ff', '#33D1C9', '#8DBDFF'];

  const series = keys.map((name, idx) => ({
    name,
    type: 'line' as const,
    smooth: true,
    data: d.map((item) => item[name] as number),
    lineStyle: { color: palette[idx], width: 3, shadowBlur: 10, shadowColor: palette[idx] },
    areaStyle: {
      color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: palette[idx] + '59' },
        { offset: 1, color: palette[idx] + '05' },
      ]),
    },
    symbol: 'circle',
    symbolSize: 6,
    itemStyle: { color: palette[idx], borderColor: '#fff', borderWidth: 2 },
  }));

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
      data: keys,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '14%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: d.map((item) => item.hour),
      axisLine: { lineStyle: { color: TechPalette.axis } },
      axisLabel: { color: ChartThemeColors.text, fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: ChartThemeColors.text },
      splitLine: { lineStyle: { color: TechPalette.splitLine } },
    },
    series,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  };
}

function buildPieOption(): EChartsOption {
  const d = props.data as PieItem[];
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
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '46%'],
      data: d.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: pieColors[index % pieColors.length],
          shadowBlur: 8,
          shadowColor: pieColors[index % pieColors.length],
          borderRadius: 4,
        },
      })),
      emphasis: {
        scale: true,
        scaleSize: 6,
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0, 246, 255, 0.5)' },
      },
      label: {
        show: true,
        color: ChartThemeColors.text,
        formatter: '{b}\n{d}%',
        lineHeight: 14,
        fontSize: 11,
      },
      labelLine: { length: 8, length2: 10, lineStyle: { color: 'rgba(0, 246, 255, 0.2)' } },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDuration: 1000,
    }],
  };
}

function buildRankBarOption(): EChartsOption {
  const d = (props.data as RankItem[]).sort((a, b) => a.value - b.value).slice(0, 10);
  const maxValue = d[d.length - 1]?.value || 1;

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(3, 16, 29, 0.92)',
      borderColor: 'rgba(0, 246, 255, 0.25)',
      textStyle: { color: ChartThemeColors.text },
    },
    grid: { left: '3%', right: '10%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      max: maxValue,
      axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: d.map((item) => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: ChartThemeColors.text, fontSize: 11 },
    },
    series: [{
      type: 'bar',
      barWidth: 14,
      data: d.map((item, index) => ({
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
      label: { show: true, position: 'right', color: '#ffffff', fontSize: 11, formatter: '{c}%' },
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => idx * 80,
    }],
  };
}

function renderChart() {
  if (!chartRef.value) return;
  chartInstance?.dispose();
  chartInstance = echarts.init(chartRef.value);
  const option = props.type === 'line-area'
    ? buildLineOption()
    : props.type === 'pie'
      ? buildPieOption()
      : buildRankBarOption();
  chartInstance.setOption(option);
}

watch(() => props.data, () => {
  if (chartInstance) renderChart();
}, { deep: true });

onMounted(() => renderChart());
onBeforeUnmount(() => chartInstance?.dispose());
</script>

<template>
  <div ref="chartRef" class="chart-card" />
</template>

<style scoped lang="scss">
.chart-card {
  width: 100%;
  height: 280px;
}
</style>
