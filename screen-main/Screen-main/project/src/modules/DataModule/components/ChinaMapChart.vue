<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import chinaJson from '@/assets/china.json';
import { TechPalette } from '@/config/ChartConfig';

const props = withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: '全国地区订单量汇总',
  },
);

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 注册中国地图
echarts.registerMap('china', chinaJson as any);

// 34 个省级行政区模拟数据（名称必须与 china.json 中的 name 属性完全匹配）
const provinceNames = [
  '北京市', '天津市', '上海市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省',
  '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区',
];

function generateMockData() {
  return provinceNames.map((name) => ({
    name,
    value: Math.floor(Math.random() * 8000) + 1200,
  }));
}

const mapData = ref(generateMockData());

function renderChart() {
  if (!chartRef.value) {
    return;
  }

  chartInstance = echarts.init(chartRef.value);

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    title: {
      text: props.title,
      left: 'center',
      top: 12,
      textStyle: {
        color: '#dff7ff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(3, 16, 29, 0.92)',
      borderColor: 'rgba(0, 246, 255, 0.3)',
      textStyle: {
        color: '#dff7ff',
      },
      formatter: (params: any) => {
        return `${params.name}<br/>订单量: <strong style="color:${TechPalette.highlight}">${params.value || 0}</strong> 单`;
      },
    },
    visualMap: {
      min: 1000,
      max: 9000,
      left: '4%',
      bottom: '6%',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#0a1f44', '#0075ff', '#00baff', '#00f6ff', '#ffde00'],
      },
      textStyle: {
        color: '#dff7ff',
      },
    },
    series: [
      {
        name: '订单量',
        type: 'map',
        map: 'china',
        roam: true,
        zoom: 1.2,
        label: {
          show: true,
          color: '#dff7ff',
          fontSize: 10,
        },
        itemStyle: {
          borderColor: 'rgba(0, 246, 255, 0.35)',
          borderWidth: 1,
        },
        emphasis: {
          label: {
            show: true,
            color: '#ffffff',
          },
          itemStyle: {
            areaColor: 'rgba(0, 186, 255, 0.55)',
            borderColor: '#00f6ff',
            borderWidth: 1.5,
            shadowBlur: 16,
            shadowColor: 'rgba(0, 246, 255, 0.5)',
          },
        },
        select: {
          itemStyle: {
            areaColor: '#00baff',
          },
        },
        data: mapData.value,
      } as any,
    ],
  };

  chartInstance.setOption(option);
}

watch(
  () => props.title,
  () => {
    if (chartInstance) {
      chartInstance.setOption({
        title: { text: props.title },
      });
    }
  },
);

// 定时刷新模拟数据
let refreshTimer: number | undefined;

onMounted(() => {
  renderChart();
  refreshTimer = window.setInterval(() => {
    mapData.value = generateMockData();
    if (chartInstance) {
      chartInstance.setOption({
        series: [{ data: mapData.value }],
      });
    }
  }, 5000);
});

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  chartInstance?.dispose();
});
</script>

<template>
  <div ref="chartRef" class="china-map-chart" />
</template>

<style scoped lang="scss">
.china-map-chart {
  width: 100%;
  height: 100%;
  min-height: 520px;
}
</style>
