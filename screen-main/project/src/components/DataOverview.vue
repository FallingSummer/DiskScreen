<script setup lang="ts">
import type { OverviewCardData } from '@/types/ChartTypes';

const props = defineProps<{
  cards: OverviewCardData[];
}>();
</script>

<template>
  <section class="overview-grid">
    <article v-for="card in props.cards" :key="card.title" class="card">
      <div class="title">{{ card.title }}</div>
      <div class="value" :style="{ color: card.color }">{{ card.value }}{{ card.unit }}</div>
      <div class="trend">环比 {{ card.trend }}%</div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border-radius: 8px;
  background: rgba(25, 50, 100, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 246, 255, 0.2);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2), 0 0 12px rgba(0, 246, 255, 0.05);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 246, 255, 0.12);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, v-bind('cards[0]?.color || "#00f6ff"'), transparent);
  opacity: 0.6;
}

.title {
  font-size: 14px;
  color: #8bc7e8;
}

.value {
  font-size: 26px;
  font-weight: 700;
  margin: 8px 0 4px;
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
}

.trend {
  color: #00f6ff;
  font-size: 13px;
}
</style>
