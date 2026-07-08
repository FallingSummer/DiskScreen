import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { DashboardOverview, ServerStatusSnapshot, ServerPerformanceHourly, DiskPerformanceHourly, NetworkTrafficHourly } from '@/types/DataTypes';
import { DataService } from '@/services/DataService';

export const useGlobalStore = defineStore('GlobalStore', () => {
  const appName = ref('DataScreenPractice');
  const isLoading = ref(false);
  const currentTime = ref('');

  const overview = ref<DashboardOverview | null>(null);
  const statusList = ref<ServerStatusSnapshot[]>([]);
  const performanceList = ref<ServerPerformanceHourly[]>([]);
  const diskList = ref<DiskPerformanceHourly[]>([]);
  const networkList = ref<NetworkTrafficHourly[]>([]);

  const dataService = new DataService();

  const title = computed(() => `${appName.value}`);

  const alertStats = computed(() => {
    const total = statusList.value.length;
    const critical = statusList.value.filter((s) => s.AlertLevel === 'Critical').length;
    const warning = statusList.value.filter((s) => s.AlertLevel === 'Warning').length;
    return { total, critical, warning };
  });

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [ov, st, perf, disk, net] = await Promise.all([
        dataService.getDashboardOverview(),
        dataService.getStatusSnapshot(),
        dataService.getPerformanceData(),
        dataService.getDiskData(),
        dataService.getNetworkData(),
      ]);
      overview.value = ov;
      statusList.value = st;
      performanceList.value = perf;
      diskList.value = disk;
      networkList.value = net;
    } finally {
      setLoading(false);
    }
  }

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

  return {
    appName,
    isLoading,
    currentTime,
    title,
    overview,
    statusList,
    performanceList,
    diskList,
    networkList,
    alertStats,
    setLoading,
    loadDashboardData,
    updateClock,
  };
});
