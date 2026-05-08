import { defineComponent, h, type PropType } from 'vue';
import type {
  RegionInsightFeatureCollection,
  RegionInsightProperties,
  WorkforceLayerId
} from '@dewr/services-workforce';

export const RegionalInsightMap = defineComponent({
  name: 'RegionalInsightMap',
  props: {
    regions: { type: Object as PropType<RegionInsightFeatureCollection>, required: true },
    activeLayers: { type: Array as PropType<WorkforceLayerId[]>, required: true }
  },
  emits: {
    regionSelected: (_region: RegionInsightProperties) => true
  },
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'dewr-map', role: 'list', 'aria-label': 'Regional workforce intelligence map' },
        props.regions.features.map((feature) => {
          const risk = Math.min(100, Math.max(10, feature.properties.skillsGapIndex));
          return h(
            'button',
            {
              key: feature.properties.id,
              class: 'dewr-map__region',
              style: {
                left: `${((feature.geometry.coordinates[0] - 112) / 42) * 100}%`,
                top: `${((feature.geometry.coordinates[1] + 44) / 34) * 100}%`,
                '--risk': `${risk}%`
              },
              type: 'button',
              onClick: () => emit('regionSelected', feature.properties)
            },
            [
              h('span', { class: 'dewr-map__dot' }),
              h('span', { class: 'dewr-map__label' }, feature.properties.name),
              h('span', { class: 'dewr-map__metric' }, [
                props.activeLayers.includes('skills')
                  ? `Skills gap ${feature.properties.skillsGapIndex}`
                  : `${feature.properties.vacancies.toLocaleString()} vacancies`
              ])
            ]
          );
        })
      );
  }
});
