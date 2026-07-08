<script setup lang="ts">
import { computed } from 'vue';
import type { TableRowData } from '@/types/ChartTypes';

const props = withDefaults(
  defineProps<{
    rows: TableRowData[];
    headers?: string[];
  }>(),
  {
    headers: () => ['名称', '数值', '占比', '状态'],
  },
);

const normalizedHeaders = computed(() =>
  props.headers?.length === 4 ? props.headers : ['名称', '数值', '占比', '状态'],
);

const maxValue = computed(() => Math.max(...props.rows.map((r) => r.value), 1));

function statusClass(status: string) {
  const map: Record<string, string> = {
    领跑: 'status-lead',
    增长: 'status-growth',
    稳定: 'status-stable',
    跟进: 'status-follow',
  };
  return map[status] || 'status-default';
}

function rowAnimationDelay(index: number) {
  return `${index * 0.1}s`;
}
</script>

<template>
  <div class="table-card">
    <table>
      <thead>
        <tr>
          <th v-for="(h, i) in normalizedHeaders" :key="i">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in props.rows"
          :key="row.name"
          class="data-row"
          :style="{ animationDelay: rowAnimationDelay(index) }"
        >
          <td class="col-name">
            <span class="rank-badge">{{ index + 1 }}</span>
            {{ row.name }}
          </td>
          <td class="col-value">
            <div class="value-bar-track">
              <div
                class="value-bar-fill"
                :style="{
                  width: `${(row.value / maxValue) * 100}%`,
                  transitionDelay: `${index * 0.1 + 0.2}s`,
                }"
              />
              <span class="value-text">{{ row.value.toLocaleString() }}</span>
            </div>
          </td>
          <td class="col-rate">
            <span class="rate-value">{{ row.rate }}%</span>
          </td>
          <td class="col-status">
            <span class="status-tag" :class="statusClass(row.status)">{{ row.status }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-card {
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(25, 50, 100, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 246, 255, 0.15);
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #eaf8ff;
}

th,
td {
  padding: 10px 8px;
  border-bottom: 1px solid rgba(0, 246, 255, 0.08);
  text-align: left;
}

th {
  color: #00f6ff;
  font-size: 13px;
  letter-spacing: 0.05em;
  text-shadow: 0 0 8px rgba(0, 246, 255, 0.3);
}

tbody tr {
  opacity: 0;
  transform: translateX(-12px);
  animation: slideIn 0.5s ease forwards;
}

tbody tr:hover {
  background: rgba(0, 246, 255, 0.06);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.col-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: rgba(0, 246, 255, 0.12);
  border: 1px solid rgba(0, 246, 255, 0.25);
  color: #00f6ff;
  font-size: 11px;
  font-weight: bold;
}

.value-bar-track {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.value-bar-fill {
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(0, 246, 255, 0.25), rgba(0, 186, 255, 0.08));
  width: 0;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.value-text {
  position: relative;
  z-index: 1;
  font-size: 13px;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}

.rate-value {
  color: #8fd8ff;
  font-size: 13px;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.status-lead {
  background: rgba(255, 222, 0, 0.12);
  color: #ffde00;
  border: 1px solid rgba(255, 222, 0, 0.3);
}

.status-growth {
  background: rgba(0, 246, 255, 0.12);
  color: #00f6ff;
  border: 1px solid rgba(0, 246, 255, 0.3);
}

.status-stable {
  background: rgba(0, 186, 255, 0.12);
  color: #00baff;
  border: 1px solid rgba(0, 186, 255, 0.3);
}

.status-follow {
  background: rgba(141, 189, 255, 0.12);
  color: #8dbdff;
  border: 1px solid rgba(141, 189, 255, 0.3);
}

.status-default {
  background: rgba(255, 255, 255, 0.08);
  color: #c8e4ff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
</style>
