import { defineComponent, h, type PropType } from 'vue';

export interface SelectOption {
  label: string;
  value: string;
}

export const DewrButton = defineComponent({
  name: 'DewrButton',
  props: {
    href: String,
    variant: { type: String as PropType<'primary' | 'secondary'>, default: 'primary' }
  },
  setup(props, { slots }) {
    return () =>
      props.href
        ? h('a', { class: ['dewr-button', `dewr-button--${props.variant}`], href: props.href }, slots.default?.())
        : h('button', { class: ['dewr-button', `dewr-button--${props.variant}`], type: 'button' }, slots.default?.());
  }
});

export const DewrShell = defineComponent({
  name: 'DewrShell',
  props: {
    title: { type: String, required: true }
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'dewr-shell' }, [
        h('header', { class: 'dewr-shell__header' }, [
          h('div', { class: 'dewr-shell__brand' }, props.title),
          h('nav', { class: 'dewr-shell__nav', 'aria-label': 'Prototype navigation' }, [
            h('a', { href: '#regional-insights' }, 'Regional insights'),
            h('a', { href: '#pathway-controls' }, 'Pathways'),
            h('a', { href: '#delivery-evidence' }, 'Delivery')
          ])
        ]),
        h('main', { class: 'dewr-shell__main' }, slots.default?.())
      ]);
  }
});

export const DewrKpiCard = defineComponent({
  name: 'DewrKpiCard',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    trend: { type: String, default: '' }
  },
  setup(props) {
    return () =>
      h('article', { class: 'dewr-kpi-card' }, [
        h('span', { class: 'dewr-kpi-card__label' }, props.label),
        h('strong', { class: 'dewr-kpi-card__value' }, props.value),
        props.trend ? h('span', { class: 'dewr-kpi-card__trend' }, props.trend) : null
      ]);
  }
});

export const DewrPanel = defineComponent({
  name: 'DewrPanel',
  props: {
    title: { type: String, required: true }
  },
  setup(props, { slots }) {
    return () =>
      h('section', { class: 'dewr-panel' }, [
        h('h2', { class: 'dewr-panel__title' }, props.title),
        h('div', { class: 'dewr-panel__body' }, slots.default?.())
      ]);
  }
});
