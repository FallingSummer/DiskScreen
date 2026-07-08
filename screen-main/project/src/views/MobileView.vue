<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useGlobalStore } from '@/stores/GlobalStore';
import BaseLoading from '@/components/BaseLoading.vue';
import CpuMemoryTrendChart from '@/components/CpuMemoryTrendChart.vue';
import NetworkTrendChart from '@/components/NetworkTrendChart.vue';
import AlertPieChart from '@/components/AlertPieChart.vue';

const store = useGlobalStore();

const overviewCards = computed(() => {
  const ov = store.overview;
  if (!ov) return [];
  return [
    { title: '主机总数', value: ov.TotalHosts, unit: '台', color: '#00f6ff' },
    { title: '正常', value: ov.NormalHosts, unit: '台', color: '#33D1C9' },
    { title: '告警', value: ov.WarningHosts, unit: '台', color: '#ffde00' },
    { title: '严重', value: ov.CriticalHosts, unit: '台', color: '#ff4d4f' },
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

const alertPieData = computed(() => {
  const stats = store.alertStats;
  return [
    { name: '正常', value: stats.total - stats.warning - stats.critical },
    { name: '告警', value: stats.warning },
    { name: '严重', value: stats.critical },
  ].filter((d) => d.value > 0);
});

const statusCards = computed(() => store.statusList.slice(0, 6));

onMounted(async () => {
  await store.loadDashboardData();
});
</script>

<template>
  <main class="mobile-view">
    <header class="mobile-header">
      <h1>服务器监控</h1>
      <p>{{ store.currentTime || new Date().toLocaleString('zh-CN') }}</p>
    </header>

    <section v-if="store.isLoading" class="loading-shell">
      <BaseLoading text="加载中..." />
    </section>

    <section v-else class="mobile-content">
      <div class="overview-grid">
        <div v-for="card in overviewCards" :key="card.title" class="m-card glass-panel">
          <div class="m-card-title">{{ card.title }}</div>
          <div class="m-card-value" :style="{ color: card.color }">{{ card.value }}{{ card.unit }}</div>
        </div>
      </div>

      <div class="m-section glass-panel">
        <h3>主机状态</h3>
        <div class="host-list">
          <div v-for="host in statusCards" :key="host.HostId" class="host-item">
            <div class="host-info">
              <strong>{{ host.HostId }}</strong>
              <span :class="['level-badge', host.AlertLevel.toLowerCase()]">{{ host.AlertLevel }}</span>
            </div>
            <div class="host-metrics">
              <span>CPU {{ host.CpuUsage.toFixed(1) }}%</span>
              <span>负载 {{ host.Load1.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="m-section glass-panel">
        <h3>告警分布</h3>
        <AlertPieChart :data="alertPieData" />
      </div>

      <div class="m-section glass-panel">
        <h3>CPU / 内存趋势</h3>
        <CpuMemoryTrendChart :data="performanceByHour" />
      </div>

      <div class="m-section glass-panel">
        <h3>网络流量趋势</h3>
        <NetworkTrendChart :data="networkByHour" />
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.mobile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #040d18 0%, #061526 100%);
  color: #eaf7ff;
  padding: 16px;
}

.mobile-header {
  margin-bottom: 16px;
  h1 {
    margin: 0 0 4px;
    font-size: 20px;
    color: #ffffff;
  }
  p {
    margin: 0;
    font-size: 12px;
    color: #8bc7e8;
  }
}

.loading-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.m-card {
  padding: 12px;
  text-align: center;
}

.m-card-title {
  font-size: 12px;
  color: #8bc7e8;
  margin-bottom: 6px;
}

.m-card-value {
  font-size: 20px;
  font-weight: 700;
}

.m-section {
  padding: 14px;
  margin-bottom: 14px;
  h3 {
    margin: 0 0 10px;
    font-size: 14px;
    color: #00f6ff;
  }
}

.host-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.host-item {
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 246, 255, 0.08);
}

.host-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  strong {
    font-size: 14px;
    color: #ffffff;
  }
}

.level-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
}

.level-badge.normal {
  background: rgba(51, 209, 201, 0.15);
  color: #33D1C9;
  border: 1px solid rgba(51, 209, 201, 0.3);
}

.level-badge.warning {
  background: rgba(255, 222, 0, 0.15);
  color: #ffde00;
  border: 1px solid rgba(255, 222, 0, 0.3);
}

.level-badge.critical {
  background: rgba(255, 77, 79, 0.15);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.3);
}

.host-metrics {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #8fcdfd;
}

.glass-panel {
  background: rgba(25, 50, 100, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 246, 255, 0.2);
  border-radius: 8px;
}
</style>
