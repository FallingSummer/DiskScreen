<script setup lang="ts">
import DataOverview from '@/components/DataOverview.vue';
import TrendChart from '@/components/TrendChart.vue';
import CategoryBarChart from '@/components/CategoryBarChart.vue';
import ProportionPieChart from '@/components/ProportionPieChart.vue';
import RealtimeLineChart from '@/components/RealtimeLineChart.vue';
import DataTable from '@/components/DataTable.vue';
import type { OverviewCardData, ChartPoint, TableRowData } from '@/types/ChartTypes';

const overviewCards: OverviewCardData[] = [
  { title: '总访问量', value: 12800, unit: '人', trend: 12.5, color: '#1fd1ff' },
  { title: '订单量', value: 934, unit: '单', trend: 8.2, color: '#3be0c6' },
  { title: '转化率', value: 6.8, unit: '%', trend: 2.1, color: '#f6c85f' },
  { title: '活跃用户', value: 4580, unit: '人', trend: 5.7, color: '#9b8cff' },
];

const trendData: ChartPoint[] = [
  { name: '周一', value: 120 },
  { name: '周二', value: 132 },
  { name: '周三', value: 101 },
  { name: '周四', value: 134 },
  { name: '周五', value: 90 },
  { name: '周六', value: 230 },
  { name: '周日', value: 210 },
];

const categoryData: ChartPoint[] = [
  { name: 'A类', value: 320 },
  { name: 'B类', value: 240 },
  { name: 'C类', value: 180 },
  { name: 'D类', value: 160 },
];

const proportionData: ChartPoint[] = [
  { name: '官网流量', value: 42 },
  { name: '渠道广告', value: 33 },
  { name: '社媒引流', value: 25 },
];

const tableRows: TableRowData[] = [
  { name: '设备一', value: 1280, rate: 32, status: '正常' },
  { name: '设备二', value: 980, rate: 24, status: '警告' },
  { name: '设备三', value: 760, rate: 19, status: '正常' },
];
</script>

<template>
  <div class="screen-shell">
    <header class="screen-header">
      <h1>DataScreenPractice 大屏概览</h1>
      <p>基于 Vue3 + ECharts 的数据可视化展示</p>
    </header>

    <section class="dashboard-grid">
      <div class="panel panel-large">
        <DataOverview :cards="overviewCards" />
      </div>
      <div class="panel">
        <TrendChart title="趋势走势" :data="trendData" />
      </div>
      <div class="panel">
        <CategoryBarChart title="分类分布" :data="categoryData" />
      </div>
      <div class="panel">
        <ProportionPieChart title="占比分析" :data="proportionData" />
      </div>
      <div class="panel">
        <RealtimeLineChart title="能力雷达模型" :data="[{ name: '前端基础', value: 92 }, { name: '图表配置', value: 88 }, { name: '数据建模', value: 84 }, { name: '交互设计', value: 90 }, { name: '性能优化', value: 86 } ]" chartType="radar" />
      </div>
      <div class="panel panel-table">
        <DataTable :rows="tableRows" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.screen-shell {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #07131f 0%, #0e2a3f 100%);
  color: #eaf8ff;
}

.screen-header {
  margin-bottom: 16px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 16px;
}

.panel {
  padding: 16px;
  border-radius: 14px;
  background: rgba(7, 19, 31, 0.82);
  border: 1px solid rgba(88, 199, 255, 0.16);
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.25);
}

.panel-large {
  grid-column: span 3;
}

.panel-table {
  grid-column: span 3;
}

@media (max-width: 1280px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }

  .panel-large,
  .panel-table {
    grid-column: span 2;
  }
}
</style>
