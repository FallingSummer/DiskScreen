import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export function useElementSize(target: Ref<HTMLElement | null>) {
  const width = ref(0);
  const height = ref(0);
  let observer: ResizeObserver | null = null;

  const update = () => {
    if (!target.value) {
      return;
    }

    const rect = target.value.getBoundingClientRect();
    width.value = rect.width;
    height.value = rect.height;
  };

  onMounted(() => {
    update();
    observer = new ResizeObserver(() => update());
    if (target.value) {
      observer.observe(target.value);
    }
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });

  return { width, height };
}
