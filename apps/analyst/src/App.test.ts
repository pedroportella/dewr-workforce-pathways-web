import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from './App.vue';

vi.mock('@dewr/map-engine', async () => {
  const { defineComponent, h } = await import('vue');

  return {
    RegionalInsightMap: defineComponent({
      name: 'RegionalInsightMap',
      setup: () => () => h('div', { role: 'region', 'aria-label': 'Regional workforce intelligence map' })
    })
  };
});

describe('App', () => {
  it('renders the loading state first', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Loading workforce pathways dataset...');
  });
});
