<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import DataOverview from '@/components/DataOverview.vue';
import TrendChart from '@/components/TrendChart.vue';
import CategoryBarChart from '@/components/CategoryBarChart.vue';
import ProportionPieChart from '@/components/ProportionPieChart.vue';
import RealtimeLineChart from '@/components/RealtimeLineChart.vue';
import DataTable from '@/components/DataTable.vue';
import RankBarChart from '@/components/RankBarChart.vue';
import BaseLoading from '@/components/BaseLoading.vue';
import ChinaMapChart from '@/modules/DataModule/components/ChinaMapChart.vue';
import FlowingLight from '@/components/decorations/FlowingLight.vue';
import { DataService } from '@/services/DataService';
import { ScreenThemeConfig } from '@/config/ScreenThemeConfig';
import type { OverviewCardData, ChartPoint, TableRowData } from '@/types/ChartTypes';
import type { OverviewData } from '@/types/DataTypes';

const dataService = new DataService();
const isLoading = ref(true);
const currentTime = ref('');
const overviewData = ref<OverviewData | null>(null);

const overviewCards = computed<OverviewCardData[]>(() => {
  if (!overviewData.value) {
    return [];
  }

  return [
    {
      title: '总访问量',
      value: Math.round(overviewData.value.value * 1.1),
      unit: '人',
      trend: 12.5,
      color: ScreenThemeConfig.primary,
    },
    {
      title: '订单量',
      value: 934,
      unit: '单',
      trend: 8.2,
      color: ScreenThemeConfig.accent,
    },
    {
      title: '转化率',
      value: 6.8,
      unit: '%',
      trend: 2.1,
      color: ScreenThemeConfig.secondary,
    },
    {
      title: '活跃用户',
      value: 4580,
      unit: '人',
      trend: 5.7,
      color: '#8DBDFF',
    },
  ];
});

const accessTrendData = computed<ChartPoint[]>(() => [
  { name: '周一', value: 1240 },
  { name: '周二', value: 1380 },
  { name: '周三', value: 1420 },
  { name: '周四', value: 1510 },
  { name: '周五', value: 1620 },
  { name: '周六', value: 1750 },
  { name: '周日', value: 1810 },
]);

const orderTrendData = computed<ChartPoint[]>(() => [
  { name: '周一', value: 180 },
  { name: '周二', value: 196 },
  { name: '周三', value: 208 },
  { name: '周四', value: 216 },
  { name: '周五', value: 232 },
  { name: '周六', value: 248 },
  { name: '周日', value: 264 },
]);

const categoryData = computed<ChartPoint[]>(() => [
  { name: '课程学习', value: 38 },
  { name: '项目实战', value: 32 },
  { name: '资料下载', value: 20 },
  { name: '答题测验', value: 10 },
]);

const centerFlowData = computed<ChartPoint[]>(() => [
  { name: '官网流量', value: 42 },
  { name: '渠道广告', value: 33 },
  { name: '社媒引流', value: 25 },
]);

const radarData = computed<ChartPoint[]>(() => [
  { name: '前端基础', value: 92 },
  { name: '图表配置', value: 88 },
  { name: '数据建模', value: 84 },
  { name: '交互设计', value: 90 },
  { name: '性能优化', value: 86 },
]);

const cityRows = computed<TableRowData[]>(() => [
  { name: '上海', value: 18420, rate: 96, status: '领跑' },
  { name: '深圳', value: 16230, rate: 88, status: '增长' },
  { name: '成都', value: 14560, rate: 81, status: '稳定' },
  { name: '西安', value: 12880, rate: 74, status: '跟进' },
]);

const alertItems = [
  { title: '课程数据同步', meta: '2 分钟前', level: '正常' },
  { title: '周报生成完成', meta: '12 分钟前', level: '提醒' },
  { title: '分发节点波动', meta: '27 分钟前', level: '告警' },
];

let timer: number | undefined;

function updateClock() {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

onMounted(async () => {
  updateClock();
  timer = window.setInterval(updateClock, 1000);
  overviewData.value = await dataService.getOverviewData();
  isLoading.value = false;
});

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});
</script>

<template>
  <main class="index-view">
    <section v-if="isLoading" class="loading-shell">
      <BaseLoading text="正在加载大屏数据..." />
    </section>

    <section v-else class="screen-shell">
      <header class="screen-header glass-panel">
        <div class="title-group">
          <div class="title-badge">DataScreenPractice</div>
          <div>
            <p class="eyebrow">Teaching Intelligence Center · Single Page Dashboard</p>
            <h1>教学数据中台可视化大屏</h1>
          </div>
        </div>
        <div class="header-metrics">
          <div class="metric-pill glass-badge">
            <span class="metric-label">系统状态</span>
            <strong>在线</strong>
          </div>
          <div class="metric-pill glass-badge">
            <span class="metric-label">数据源</span>
            <strong>Mock</strong>
          </div>
          <div class="clock-card glass-badge">
            <span class="clock-label">当前时间</span>
            <strong>{{ currentTime }}</strong>
          </div>
        </div>
      </header>

      <section class="dashboard-grid">
        <article class="panel panel-large panel-animated glass-panel">
          <DataOverview :cards="overviewCards" />
        </article>

        <article class="panel panel-animated glass-panel">
          <TrendChart title="访问趋势" :data="accessTrendData" :secondaryData="orderTrendData" />
        </article>

        <article class="panel panel-animated glass-panel">
          <CategoryBarChart title="分类占比" :data="categoryData" />
        </article>

        <article class="panel panel-featured panel-animated glass-panel">
          <ChinaMapChart />
        </article>

        <article class="panel panel-animated glass-panel">
          <ProportionPieChart title="占比分析" :data="centerFlowData" />
        </article>

        <article class="panel panel-animated glass-panel">
          <RealtimeLineChart title="能力雷达模型" :data="radarData" chartType="radar" />
        </article>

        <article class="panel panel-table panel-animated glass-panel">
          <div class="table-head">
            <div>
              <p class="table-kicker">实时动态</p>
              <h3>城市访问排名</h3>
            </div>
          </div>
          <div class="table-chart-split">
            <div class="table-zone">
              <DataTable :rows="cityRows" :headers="['城市', '访问量', '热度', '状态']" />
            </div>
            <div class="chart-zone">
              <RankBarChart title="访问排名可视化" :rows="cityRows" />
            </div>
          </div>
          <div class="alert-list">
            <div v-for="item in alertItems" :key="item.title" class="alert-item glass-badge">
              <span class="alert-dot" />
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.meta }}</p>
              </div>
              <em>{{ item.level }}</em>
            </div>
          </div>
        </article>
      </section>

      <FlowingLight />
    </section>
  </main>
</template>

<style scoped lang="scss">
.index-view {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(0, 117, 255, 0.18), transparent 35%),
    radial-gradient(circle at bottom right, rgba(106, 0, 255, 0.12), transparent 40%),
    linear-gradient(135deg, #040d18 0%, #061526 100%);
  color: #eaf7ff;
  overflow: hidden;
  position: relative;
}

.index-view::before,
.index-view::after {
  content: '';
  position: absolute;
  inset: -20%;
  pointer-events: none;
}

.index-view::before {
  background: linear-gradient(120deg, transparent 0%, rgba(0, 246, 255, 0.08) 25%, rgba(0, 186, 255, 0.14) 50%, transparent 80%);
  animation: sweep 10s ease-in-out infinite;
  transform: translateX(-120%);
}

.index-view::after {
  background: radial-gradient(circle, rgba(0, 117, 255, 0.14) 0%, transparent 60%);
  filter: blur(30px);
  animation: pulse 6s ease-in-out infinite;
}

.loading-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen-shell {
  min-height: 100vh;
  padding: 24px 28px 32px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

/* 玻璃材质统一类 */
.glass-panel {
  background: rgba(25, 50, 100, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 246, 255, 0.2);
  border-radius: 8px;
}

.glass-badge {
  background: rgba(5, 18, 34, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 246, 255, 0.15);
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding: 18px 22px;
  position: relative;
  overflow: hidden;
}

.screen-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 246, 255, 0.08), transparent 45%, rgba(0, 186, 255, 0.06));
  pointer-events: none;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-badge {
  padding: 8px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(0, 246, 255, 0.18), rgba(0, 117, 255, 0.12));
  border: 1px solid rgba(0, 246, 255, 0.3);
  color: #9ed8ff;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.eyebrow {
  margin: 0 0 6px;
  color: #7fc7ff;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: 30px;
  color: #ffffff;
  text-shadow: 0 0 18px rgba(0, 246, 255, 0.2);
}

.header-metrics {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metric-pill,
.clock-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  box-shadow: inset 0 0 16px rgba(0, 246, 255, 0.06);
}

.metric-label,
.clock-label {
  font-size: 11px;
  color: #8fcdfd;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

strong {
  font-size: 14px;
  color: #ffffff;
}

/* 新布局网格 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 16px;
  align-items: stretch;
}

.panel {
  padding: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02) inset, 0 12px 32px rgba(0, 0, 0, 0.24);
}

.panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 246, 255, 0.06), transparent 42%, rgba(0, 186, 255, 0.04));
  pointer-events: none;
}

.panel-animated {
  animation: floatIn 0.8s ease both;
}

.panel-large {
  grid-column: span 3;
}

/* 左侧列 */
.panel:nth-child(2) {
  grid-column: 1;
  grid-row: 2;
}

.panel:nth-child(3) {
  grid-column: 1;
  grid-row: 3;
}

/* 中间地图 featured */
.panel-featured {
  grid-column: 2;
  grid-row: 2 / span 2;
  border-color: rgba(0, 246, 255, 0.3);
  box-shadow: 0 0 28px rgba(0, 246, 255, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  min-height: 560px;
  display: flex;
  flex-direction: column;
}

/* 右侧列 */
.panel:nth-child(5) {
  grid-column: 3;
  grid-row: 2;
}

.panel:nth-child(6) {
  grid-column: 3;
  grid-row: 3;
}

.panel-table {
  grid-column: span 3;
  grid-row: 4;
}

.table-chart-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.table-zone {
  min-width: 0;
}

.chart-zone {
  min-width: 0;
}

.table-head {
  margin-bottom: 10px;
}

.table-kicker {
  margin: 0 0 4px;
  color: #8fd8ff;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h3 {
  margin: 0;
  font-size: 18px;
  color: #f6fbff;
}

.alert-list {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.alert-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 10px;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00f6ff, #0075ff);
  box-shadow: 0 0 10px rgba(0, 246, 255, 0.4);
}

.alert-item strong {
  display: block;
  font-size: 13px;
  margin-bottom: 2px;
}

.alert-item p {
  margin: 0;
  font-size: 11px;
  color: #8fcdfd;
}

.alert-item em {
  font-style: normal;
  color: #ffde00;
  font-size: 11px;
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes sweep {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.06);
  }
}

@media (max-width: 1600px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto auto;
  }

  .panel-large {
    grid-column: span 2;
  }

  .panel-featured {
    grid-column: span 2;
    grid-row: auto;
    min-height: 480px;
  }

  .panel:nth-child(2),
  .panel:nth-child(3),
  .panel:nth-child(5),
  .panel:nth-child(6) {
    grid-column: auto;
    grid-row: auto;
  }

  .panel-table {
    grid-column: span 2;
    grid-row: auto;
  }
}

@media (max-width: 1100px) {
  .screen-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-metrics {
    flex-wrap: wrap;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .panel-large,
  .panel-table,
  .panel-featured {
    grid-column: span 1;
    grid-row: auto;
  }

  .panel:nth-child(2),
  .panel:nth-child(3),
  .panel:nth-child(5),
  .panel:nth-child(6) {
    grid-column: auto;
    grid-row: auto;
  }

  .table-chart-split {
    grid-template-columns: 1fr;
  }
}
</style>
