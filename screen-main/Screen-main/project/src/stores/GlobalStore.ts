import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useGlobalStore = defineStore('GlobalStore', () => {
  const appName = ref('DataScreenPractice');
  const isLoading = ref(false);
  const theme = ref<'dark' | 'light'>('dark');

  const title = computed(() => `${appName.value}`);

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  function setTheme(value: 'dark' | 'light') {
    theme.value = value;
  }

  return {
    appName,
    isLoading,
    theme,
    title,
    setLoading,
    setTheme,
  };
});
