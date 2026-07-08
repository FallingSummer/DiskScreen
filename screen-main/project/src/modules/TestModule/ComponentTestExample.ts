import { describe, expect, it } from 'vitest';
import { renderWithPinia } from './TestUtils';
import HomeView from '@/views/HomeView.vue';

describe('HomeView', () => {
  it('renders title', () => {
    const wrapper = renderWithPinia(HomeView);
    expect(wrapper.text()).toContain('DataScreenPractice');
  });
});
