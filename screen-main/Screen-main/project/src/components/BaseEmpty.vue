<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string;
  }>(),
  {
    text: '暂无数据',
  },
);
</script>

<template>
  <div class="empty-state">
    <p>{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #8bc7e8;
}
</style>
