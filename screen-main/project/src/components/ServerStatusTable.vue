<script setup lang="ts">
import type { ServerStatusSnapshot } from '@/types/DataTypes';

const props = defineProps<{
  data: ServerStatusSnapshot[];
}>();

function alertClass(level: string): string {
  const map: Record<string, string> = {
    Normal: 'level-normal',
    Warning: 'level-warning',
    Critical: 'level-critical',
  };
  return map[level] || 'level-normal';
}

function memPercent(row: ServerStatusSnapshot): string {
  if (!row.MemTotal) return '0.0';
  return ((row.MemUsed / row.MemTotal) * 100).toFixed(1);
}
</script>

<template>
  <div class="status-table-wrap">
    <table>
      <thead>
        <tr>
          <th>主机</th>
          <th>CPU</th>
          <th>内存</th>
          <th>负载</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in props.data" :key="row.HostId" class="data-row">
          <td class="col-host">
            <div class="host-name">{{ row.HostId }}</div>
            <div class="host-model">{{ row.Model }}</div>
          </td>
          <td class="col-metric">{{ row.CpuUsage.toFixed(1) }}%</td>
          <td class="col-metric">{{ memPercent(row) }}%</td>
          <td class="col-metric">{{ row.Load1.toFixed(1) }}</td>
          <td>
            <span class="level-tag" :class="alertClass(row.AlertLevel)">{{ row.AlertLevel }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.status-table-wrap {
  max-height: 520px;
  overflow-y: auto;
  padding-right: 4px;
}

.status-table-wrap::-webkit-scrollbar {
  width: 4px;
}

.status-table-wrap::-webkit-scrollbar-thumb {
  background: rgba(0, 246, 255, 0.2);
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #eaf8ff;
}

th,
td {
  padding: 8px 6px;
  border-bottom: 1px solid rgba(0, 246, 255, 0.08);
  text-align: left;
  font-size: 12px;
}

th {
  color: #00f6ff;
  font-size: 11px;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  background: rgba(4, 13, 24, 0.8);
  text-shadow: 0 0 6px rgba(0, 246, 255, 0.3);
}

.data-row {
  opacity: 0;
  transform: translateX(-8px);
  animation: slideIn 0.4s ease forwards;
}

.data-row:nth-child(1) { animation-delay: 0s; }
.data-row:nth-child(2) { animation-delay: 0.06s; }
.data-row:nth-child(3) { animation-delay: 0.12s; }
.data-row:nth-child(4) { animation-delay: 0.18s; }
.data-row:nth-child(5) { animation-delay: 0.24s; }
.data-row:nth-child(6) { animation-delay: 0.30s; }
.data-row:nth-child(7) { animation-delay: 0.36s; }
.data-row:nth-child(8) { animation-delay: 0.42s; }

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.col-host {
  .host-name {
    font-weight: 500;
    color: #ffffff;
  }
  .host-model {
    font-size: 11px;
    color: #8bc7e8;
    margin-top: 2px;
  }
}

.col-metric {
  color: #c8e4ff;
  font-weight: 500;
}

.level-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
}

.level-normal {
  background: rgba(51, 209, 201, 0.12);
  color: #33D1C9;
  border: 1px solid rgba(51, 209, 201, 0.25);
}

.level-warning {
  background: rgba(255, 222, 0, 0.12);
  color: #ffde00;
  border: 1px solid rgba(255, 222, 0, 0.25);
}

.level-critical {
  background: rgba(255, 77, 79, 0.12);
  color: #ff4d4f;
  border: 1px solid rgba(255, 77, 79, 0.25);
}
</style>
