<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
  }>(),
  {
    prefix: '',
    suffix: '',
    duration: 600,
  },
);

const displayValue = computed(() => `${props.prefix}${props.value}${props.suffix}`);
</script>

<template>
  <span class="number-roll">{{ displayValue }}</span>
</template>

<style scoped lang="scss">
.number-roll {
  display: inline-block;
  font-variant-numeric: tabular-nums;
}
</style>
