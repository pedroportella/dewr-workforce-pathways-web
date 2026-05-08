import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from './App.vue';

describe('App', () => {
  it('renders the loading state first', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Loading workforce pathways dataset...');
  });
});
