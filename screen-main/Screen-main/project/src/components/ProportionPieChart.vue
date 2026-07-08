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
  const total = props.data.reduce((sum, item) => sum + item.value, 0);

  const option: EChartsOption = {
    ...DefaultChartOption(props.title),
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(3, 16, 29, 0.92)',
      borderColor: 'rgba(0, 246, 255, 0.25)',
      textStyle: { color: ChartThemeColors.text },
      formatter: (params: any) => {
        const percent = ((params.value / total) * 100).toFixed(1);
        return `${params.name}<br/>
                数值: <strong style="color:${TechPalette.highlight}">${params.value}</strong><br/>
                占比: <strong style="color:${TechPalette.highlight}">${percent}%</strong>`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '70%'],
        center: ['50%', '52%'],
        data: props.data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            shadowBlur: 10,
            shadowColor: TechPalette.series[index % TechPalette.series.length],
            borderRadius: 4,
            borderColor: 'rgba(0,0,0,0.2)',
            borderWidth: 1,
          },
        })),
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 24,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 246, 255, 0.6)',
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: TechPalette.highlight,
          },
        },
        color: [...TechPalette.series],
        label: {
          color: ChartThemeColors.text,
          formatter: '{b}\n{d}%',
          lineHeight: 16,
        },
        labelLine: {
          length: 12,
          length2: 16,
          lineStyle: {
            color: TechPalette.axis,
          },
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 1200,
        animationDelay: (idx: number) => idx * 120,
      },
      {
        type: 'pie',
        radius: ['36%', '37%'],
        center: ['50%', '52%'],
        silent: true,
        itemStyle: {
          color: 'rgba(0, 246, 255, 0.08)',
        },
        label: { show: false },
        data: [{ value: 1 }],
        animation: false,
      },
    ],
  };
  chartInstance.setOption(option);
}

watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.setOption({
      series: [
        {
          data: props.data.map((item, index) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: TechPalette.series[index % TechPalette.series.length],
              borderRadius: 4,
              borderColor: 'rgba(0,0,0,0.2)',
              borderWidth: 1,
            },
          })),
        },
      ],
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
