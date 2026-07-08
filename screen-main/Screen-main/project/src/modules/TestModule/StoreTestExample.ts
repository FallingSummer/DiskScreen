import { describe, expect, it } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGlobalStore } from '@/stores/GlobalStore';

describe('GlobalStore', () => {
  it('updates loading state', () => {
    setActivePinia(createPinia());
    const store = useGlobalStore();
    store.setLoading(true);

    expect(store.isLoading).toBe(true);
  });
});
