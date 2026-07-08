<script setup lang="ts">
import { computed } from 'vue';
import { formatDate } from '@/utils/DateUtil';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
  }>(),
  {
    modelValue: '',
    label: '日期',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const currentValue = computed({
  get: () => props.modelValue || formatDate(new Date(), 'yyyy-MM-dd'),
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <label class="date-picker">
    <span v-if="label" class="label">{{ label }}</span>
    <input v-model="currentValue" type="date" />
  </label>
</template>

<style scoped lang="scss">
.date-picker {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #e6f7ff;
}

.label {
  font-size: 12px;
  color: #8bc7e8;
}

input {
  border: 1px solid rgba(88, 199, 255, 0.2);
  border-radius: 8px;
  padding: 8px 10px;
  background: rgba(2, 10, 18, 0.7);
  color: #e6f7ff;
}
</style>
