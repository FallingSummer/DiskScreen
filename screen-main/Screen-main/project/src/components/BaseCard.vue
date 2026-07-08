<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    padding?: string;
  }>(),
  {
    title: '',
    subtitle: '',
    padding: '16px',
  },
);
</script>

<template>
  <section class="base-card">
    <header v-if="title || subtitle" class="header">
      <div>
        <h3 v-if="title" class="title">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
    </header>
    <div class="body" :style="{ padding }">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.base-card {
  border-radius: 12px;
  background: rgba(8, 28, 44, 0.9);
  border: 1px solid rgba(88, 199, 255, 0.2);
  overflow: hidden;
}

.header {
  padding: 14px 16px 0;
}

.title {
  margin: 0;
  font-size: 15px;
  color: #e6f7ff;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7dbfe0;
}

.body {
  box-sizing: border-box;
}
</style>
