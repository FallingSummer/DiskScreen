<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { TableRowData } from '@/types/ChartTypes';
import { ChartThemeColors, TechPalette } from '@/config/ChartConfig';

const props = defineProps<{
  title: string;
  rows: TableRowData[];
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

function getRankColor(index: number) {
  if (index === 0) return '#ffde00';
  if (index === 1) return '#00f6ff';
  if (index === 2) return '#00baff';
  return TechPalette.series[index % TechPalette.series.length];
}

function buildOption(): EChartsOption {
  const sorted = [...props.rows].sort((a, b) => b.value - a.value);
  const maxValue = sorted[0]?.value || 1;

  return {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      top: 0,
      textStyle: {
        color: ChartThemeColors.text,
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(3, 16, 29, 0.92)',
      borderColor: 'rgba(0, 246, 255, 0.25)',
      textStyle: { color: ChartThemeColors.text },
      formatter: (params: any) => {
        const p = params[0];
        const row = sorted[p.dataIndex];
        return `${row.name}<br/>
                数值: <strong style="color:${TechPalette.highlight}">${row.value}</strong><br/>
                占比: <strong style="color:${TechPalette.highlight}">${row.rate}%</strong><br/>
                状态: <strong style="color:${TechPalette.highlight}">${row.status}</strong>`;
      },
    },
    grid: {
      left: '3%',
      right: '8%',
      top: '14%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: sorted.map((item) => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: ChartThemeColors.text,
        fontSize: 13,
        formatter: (_value: string, index: number) => {
          const rank = index + 1;
          const color = getRankColor(index);
          return `{rank|${rank}}  {name|${_value}}`;
        },
        rich: {
          rank: {
            color: '#00f6ff',
            fontSize: 12,
            fontWeight: 'bold',
            padding: [0, 6, 0, 0],
            width: 22,
            align: 'center',
          },
          name: {
            color: ChartThemeColors.text,
            fontSize: 13,
          },
        },
      },
    },
    series: [
      {
        name: '背景',
        type: 'bar',
        barWidth: 16,
        barGap: '-100%',
        data: sorted.map(() => maxValue),
        itemStyle: {
          color: 'rgba(0, 246, 255, 0.04)',
          borderRadius: [0, 8, 8, 0],
        },
        emphasis: { disabled: true },
        animation: false,
      },
      {
        name: '数值',
        type: 'bar',
        barWidth: 16,
        data: sorted.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: getRankColor(index) },
              { offset: 1, color: 'rgba(0,0,0,0.05)' },
            ]),
            borderRadius: [0, 8, 8, 0],
            shadowBlur: 8,
            shadowColor: getRankColor(index),
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: ChartThemeColors.text,
          fontSize: 12,
          formatter: (params: any) => {
            const row = sorted[params.dataIndex];
            return `{val|${params.value}}  {rate|${row.rate}%}`;
          },
          rich: {
            val: {
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 'bold',
            },
            rate: {
              color: '#8fcdfd',
              fontSize: 11,
            },
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 16,
            shadowColor: 'rgba(0, 246, 255, 0.6)',
          },
        },
        animationDuration: 1200,
        animationEasing: 'cubicOut',
        animationDelay: (idx: number) => idx * 120,
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

watch(() => props.rows, () => {
  if (chartInstance) {
    chartInstance.setOption(buildOption(), true);
  }
}, { deep: true });

onMounted(() => renderChart());
onBeforeUnmount(() => chartInstance?.dispose());
</script>

<template>
  <div ref="chartRef" class="rank-bar-chart" />
</template>

<style scoped lang="scss">
.rank-bar-chart {
  width: 100%;
  height: 320px;
}
</style>
