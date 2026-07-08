<script setup lang="ts">
withDefaults(
  defineProps<{
    name?: string;
    size?: number;
    color?: string;
  }>(),
  {
    name: 'circle',
    size: 16,
    color: '#38bdf8',
  },
);
</script>

<template>
  <span class="icon" :style="{ fontSize: `${size}px`, color }">{{ name }}</span>
</template>

<style scoped lang="scss">
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
