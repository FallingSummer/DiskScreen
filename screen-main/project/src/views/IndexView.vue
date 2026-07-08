<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { useGlobalStore } from '@/stores/GlobalStore';
import BaseLoading from '@/components/BaseLoading.vue';
import CpuMemoryTrendChart from '@/components/CpuMemoryTrendChart.vue';
import NetworkTrendChart from '@/components/NetworkTrendChart.vue';
import DiskUtilRankChart from '@/components/DiskUtilRankChart.vue';
import AlertPieChart from '@/components/AlertPieChart.vue';
import ServerStatusTable from '@/components/ServerStatusTable.vue';
import FlowingLight from '@/components/decorations/FlowingLight.vue';

const store = useGlobalStore();

const overviewCards = computed(() => {
  const ov = store.overview;
  if (!ov) return [];
  return [
    { title: '主机总数', value: ov.TotalHosts, unit: '台', color: '#00f6ff' },
    { title: '正常运行', value: ov.NormalHosts, unit: '台', color: '#33D1C9' },
    { title: '告警主机', value: ov.WarningHosts, unit: '台', color: '#ffde00' },
    { title: '严重告警', value: ov.CriticalHosts, unit: '台', color: '#ff4d4f' },
    { title: '平均CPU', value: ov.AvgCpuUsage, unit: '%', color: '#00baff' },
    { title: '平均内存', value: ov.AvgMemUsage, unit: '%', color: '#8DBDFF' },
  ];
});

const performanceByHour = computed(() => {
  const map = new Map<string, { hour: string; cpu: number; mem: number }>();
  for (const p of store.performanceList) {
    const key = p.StatHour;
    const ex = map.get(key);
    if (ex) {
      ex.cpu += p.CpuUsageAvg;
      ex.mem += p.MemUsedAvg;
    } else {
      map.set(key, { hour: key, cpu: p.CpuUsageAvg, mem: p.MemUsedAvg });
    }
  }
  return Array.from(map.values())
    .map((d) => ({ hour: d.hour.slice(5, 16), cpu: Number((d.cpu / store.alertStats.total).toFixed(2)), mem: Number((d.mem / store.alertStats.total).toFixed(2)) }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
});

const networkByHour = computed(() => {
  const map = new Map<string, { hour: string; inflow: number; outflow: number }>();
  for (const n of store.networkList) {
    const key = n.StatHour;
    const ex = map.get(key);
    if (ex) {
      ex.inflow += n.NetInAvg;
      ex.outflow += n.NetOutAvg;
    } else {
      map.set(key, { hour: key, inflow: n.NetInAvg, outflow: n.NetOutAvg });
    }
  }
  return Array.from(map.values())
    .map((d) => ({ hour: d.hour.slice(5, 16), inflow: Number(d.inflow.toFixed(2)), outflow: Number(d.outflow.toFixed(2)) }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
});

const diskRankData = computed(() => {
  const map = new Map<string, { sum: number; count: number }>();
  for (const d of store.diskList) {
    const key = `${d.HostId}-${d.DiskName}`;
    const entry = map.get(key) || { sum: 0, count: 0 };
    entry.sum += d.UtilAvg;
    entry.count += 1;
    map.set(key, entry);
  }
  return Array.from(map.entries())
    .map(([name, { sum, count }]) => ({ name, value: Number((sum / count).toFixed(2)) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
});

const alertPieData = computed(() => {
  const stats = store.alertStats;
  return [
    { name: '正常', value: stats.total - stats.warning - stats.critical },
    { name: '告警', value: stats.warning },
    { name: '严重', value: stats.critical },
  ].filter((d) => d.value > 0);
});

let timer: number | undefined;

onMounted(async () => {
  store.updateClock();
  timer = window.setInterval(store.updateClock, 1000);
  await store.loadDashboardData();
});

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <main class="index-view">
    <section v-if="store.isLoading" class="loading-shell">
      <BaseLoading text="正在加载监控数据..." />
    </section>

    <section v-else class="screen-shell">
      <header class="screen-header glass-panel">
        <div class="title-group">
          <div class="title-badge">DataScreenPractice</div>
          <div>
            <p class="eyebrow">Server Monitoring Center · Single Page Dashboard</p>
            <h1>服务器监控数据可视化大屏</h1>
          </div>
        </div>
        <div class="header-metrics">
          <div class="metric-pill glass-badge">
            <span class="metric-label">系统状态</span>
            <strong>在线</strong>
          </div>
          <div class="metric-pill glass-badge">
            <span class="metric-label">数据源</span>
            <strong>{{ store.overview ? 'API' : 'Mock' }}</strong>
          </div>
          <div class="clock-card glass-badge">
            <span class="clock-label">当前时间</span>
            <strong>{{ store.currentTime }}</strong>
          </div>
        </div>
      </header>

      <section class="overview-row">
        <article v-for="card in overviewCards" :key="card.title" class="overview-card glass-panel">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value" :style="{ color: card.color }">{{ card.value }}{{ card.unit }}</div>
        </article>
      </section>

      <section class="dashboard-grid">
        <article class="panel panel-animated glass-panel">
          <h3 class="panel-title">服务器状态快照</h3>
          <ServerStatusTable :data="store.statusList" />
        </article>

        <article class="panel panel-wide panel-animated glass-panel">
          <h3 class="panel-title">CPU / 内存趋势</h3>
          <CpuMemoryTrendChart :data="performanceByHour" />
        </article>

        <article class="panel panel-animated glass-panel">
          <h3 class="panel-title">告警分布</h3>
          <AlertPieChart :data="alertPieData" />
        </article>

        <article class="panel panel-wide panel-animated glass-panel">
          <h3 class="panel-title">网络流量趋势</h3>
          <NetworkTrendChart :data="networkByHour" />
        </article>

        <article class="panel panel-animated glass-panel">
          <h3 class="panel-title">磁盘利用率排行</h3>
          <DiskUtilRankChart :data="diskRankData" />
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

.loading-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen-shell {
  min-height: 100vh;
  padding: 20px 24px 28px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

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
  margin-bottom: 16px;
  padding: 14px 20px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(0, 246, 255, 0.18), rgba(0, 117, 255, 0.12));
  border: 1px solid rgba(0, 246, 255, 0.3);
  color: #9ed8ff;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.eyebrow {
  margin: 0 0 4px;
  color: #7fc7ff;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: 26px;
  color: #ffffff;
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
  gap: 2px;
  padding: 8px 10px;
  border-radius: 10px;
}

.metric-label,
.clock-label {
  font-size: 10px;
  color: #8fcdfd;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

strong {
  font-size: 13px;
  color: #ffffff;
}

.overview-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.overview-card {
  padding: 12px 14px;
  text-align: center;
}

.card-title {
  font-size: 12px;
  color: #8bc7e8;
  margin-bottom: 6px;
}

.card-value {
  font-size: 22px;
  font-weight: 700;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 14px;
  align-items: stretch;
}

.panel {
  padding: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02) inset, 0 12px 32px rgba(0, 0, 0, 0.24);
}

.panel-animated {
  animation: floatIn 0.8s ease both;
}

.panel-wide {
  grid-column: span 1;
}

.panel-title {
  margin: 0 0 10px;
  font-size: 15px;
  color: #00f6ff;
  text-shadow: 0 0 8px rgba(0, 246, 255, 0.3);
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

@media (max-width: 1400px) {
  .overview-row {
    grid-template-columns: repeat(3, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
  .panel-wide {
    grid-column: span 2;
  }
}

@media (max-width: 900px) {
  .screen-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .overview-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .panel-wide {
    grid-column: span 1;
  }
}
</style>
