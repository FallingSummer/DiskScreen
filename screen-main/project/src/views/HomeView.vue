<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '@/stores/GlobalStore';
import { DataService } from '@/services/DataService';
import ScreenLayout from '@/layouts/ScreenLayout.vue';
import { UseLogger } from '@/modules/LogModule/UseLogger';
import type { OverviewData } from '@/types/DataTypes';

const globalStore = useGlobalStore();
const dataService = new DataService();
const overviewData = ref<OverviewData | null>(null);
const logger = UseLogger('HomeView');

onMounted(async () => {
  logger.info('页面已加载', { title: globalStore.title });
  overviewData.value = await dataService.getOverviewData();
  logger.info('概览数据已获取', { value: overviewData.value?.value });
});
</script>

<template>
  <main class="home-view">
    <div class="title-bar">
      <h1>{{ globalStore.title }}</h1>
      <p>数据大屏演示页面</p>
    </div>
    <ScreenLayout />
  </main>
</template>

<style scoped lang="scss">
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #07131f, #0d2b3a);
  color: #e6f7ff;
}

.title-bar {
  padding: 20px 24px 0;
}
</style>
