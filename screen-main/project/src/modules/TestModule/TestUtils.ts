import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type { VueWrapper } from '@vue/test-utils';
import type { Component } from 'vue';

export function renderWithPinia(component: Component, props?: Record<string, unknown>): VueWrapper {
  setActivePinia(createPinia());
  return mount(component, {
    props,
    global: {
      stubs: ['router-link', 'router-view'],
    },
  });
}
