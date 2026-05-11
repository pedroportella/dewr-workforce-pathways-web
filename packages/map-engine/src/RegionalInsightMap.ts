import {
  Map,
  NavigationControl,
  Popup,
  type GeoJSONSource,
  type MapGeoJSONFeature,
  type MapLayerMouseEvent,
  type StyleSpecification
} from 'maplibre-gl';
import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue';
import type {
  RegionInsightFeature,
  RegionInsightFeatureCollection,
  RegionInsightProperties,
  WorkforceLayerId
} from '@dewr/services-workforce';

type RegionMapProperties = RegionInsightProperties & {
  heatmapWeight: number;
  layerMetric: number;
  layerLabel: string;
  markerColor: string;
  markerRadius: number;
};

type PointGeometry = { type: 'Point'; coordinates: [number, number] };
type PolygonGeometry = { type: 'Polygon'; coordinates: [Array<[number, number]>] };
type LineStringGeometry = { type: 'LineString'; coordinates: Array<[number, number]> };
type RegionMapFeature = { type: 'Feature'; geometry: PointGeometry; properties: RegionMapProperties };
type RegionMapFeatureCollection = { type: 'FeatureCollection'; features: RegionMapFeature[] };
type BrisbaneContextFeature = {
  type: 'Feature';
  geometry: PolygonGeometry | LineStringGeometry;
  properties: {
    name: string;
    kind: 'region' | 'water' | 'river' | 'corridor';
  };
};
type BrisbaneContextFeatureCollection = {
  type: 'FeatureCollection';
  features: BrisbaneContextFeature[];
};

const CONTEXT_SOURCE_ID = 'brisbane-context';
const CONTEXT_WATER_LAYER_ID = 'brisbane-water';
const CONTEXT_REGION_LAYER_ID = 'brisbane-region-fill';
const CONTEXT_CORRIDOR_LAYER_ID = 'brisbane-corridor-fill';
const CONTEXT_REGION_OUTLINE_LAYER_ID = 'brisbane-region-outline';
const CONTEXT_RIVER_LAYER_ID = 'brisbane-river';
const CONTEXT_LABEL_LAYER_ID = 'brisbane-context-labels';
const REGION_SOURCE_ID = 'regional-insights';
const HEATMAP_LAYER_ID = 'regional-heatmap';
const CIRCLE_LAYER_ID = 'regional-circles';
const LABEL_LAYER_ID = 'regional-labels';
const BRISBANE_CONTEXT_BOUNDS: [[number, number], [number, number]] = [
  [152.68, -27.74],
  [153.34, -27.18]
];
const DEFAULT_LAYER: WorkforceLayerId = 'skills';

const layerProfiles: Record<WorkforceLayerId, {
  label: string;
  lowLabel: string;
  highLabel: string;
  lowColor: string;
  midColor: string;
  highColor: string;
  weight: (properties: RegionInsightProperties) => number;
  metric: (properties: RegionInsightProperties) => { value: number; label: string };
}> = {
  employment: {
    label: 'Employment',
    lowLabel: 'Lower employment',
    highLabel: 'Higher employment',
    lowColor: '#9f2f24',
    midColor: '#d69e2e',
    highColor: '#2f855a',
    weight: (properties) => clamp(properties.employmentRatePercent / 100, 0.12, 1),
    metric: (properties) => ({
      value: properties.employmentRatePercent,
      label: `${properties.employmentRatePercent.toFixed(1)}% employment`
    })
  },
  skills: {
    label: 'Skills',
    lowLabel: 'Lower skills gap',
    highLabel: 'Higher skills gap',
    lowColor: '#2f855a',
    midColor: '#d69e2e',
    highColor: '#b53d2a',
    weight: (properties) => clamp(properties.skillsGapIndex / 100, 0.12, 1),
    metric: (properties) => ({
      value: properties.skillsGapIndex,
      label: `Skills gap ${properties.skillsGapIndex}`
    })
  },
  training: {
    label: 'Training',
    lowLabel: 'Lower completions',
    highLabel: 'Higher completions',
    lowColor: '#526171',
    midColor: '#4f9bb8',
    highColor: '#1d5f73',
    weight: (properties) => clamp(properties.trainingCompletions / 2400, 0.12, 1),
    metric: (properties) => ({
      value: properties.trainingCompletions,
      label: `${properties.trainingCompletions.toLocaleString()} completions`
    })
  },
  outcomes: {
    label: 'Participant outcomes',
    lowLabel: 'Lower sustained outcomes',
    highLabel: 'Higher sustained outcomes',
    lowColor: '#744210',
    midColor: '#b7791f',
    highColor: '#6b8e23',
    weight: (properties) => clamp(properties.sustainedOutcomeRatePercent / 100, 0.12, 1),
    metric: (properties) => ({
      value: properties.sustainedOutcomeRatePercent,
      label: `${properties.sustainedOutcomeRatePercent.toFixed(1)}% sustained`
    })
  }
};

const brisbaneContext: BrisbaneContextFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Moreton Bay', kind: 'water' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [153.13, -27.08],
          [153.36, -27.08],
          [153.36, -27.76],
          [153.18, -27.76],
          [153.16, -27.62],
          [153.23, -27.48],
          [153.19, -27.35],
          [153.13, -27.08]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Brisbane region', kind: 'region' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [152.78, -27.32],
          [152.91, -27.21],
          [153.08, -27.22],
          [153.18, -27.32],
          [153.20, -27.47],
          [153.12, -27.61],
          [152.94, -27.67],
          [152.78, -27.58],
          [152.72, -27.44],
          [152.78, -27.32]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Logan growth corridor', kind: 'corridor' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [152.95, -27.56],
          [153.16, -27.55],
          [153.25, -27.71],
          [153.10, -27.80],
          [152.88, -27.72],
          [152.95, -27.56]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Brisbane River', kind: 'river' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [152.74, -27.55],
          [152.86, -27.53],
          [152.96, -27.49],
          [153.02, -27.47],
          [153.08, -27.44],
          [153.15, -27.39],
          [153.22, -27.36]
        ]
      }
    }
  ]
};

const blankWorkforceStyle: StyleSpecification = {
  version: 8,
  name: 'DEWR regional intelligence',
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#e9f1f4'
      }
    }
  ]
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function primaryLayer(activeLayers: WorkforceLayerId[]) {
  return activeLayers.at(-1) ?? DEFAULT_LAYER;
}

function heatmapWeight(feature: RegionInsightFeature, activeLayers: WorkforceLayerId[]) {
  const layers = activeLayers.length ? activeLayers : [DEFAULT_LAYER];
  const total = layers.reduce((sum, layer) => sum + layerProfiles[layer].weight(feature.properties), 0);
  return clamp(total / layers.length, 0.12, 1);
}

function primaryMetric(feature: RegionInsightFeature, activeLayers: WorkforceLayerId[]) {
  const layer = primaryLayer(activeLayers);
  const profile = layerProfiles[layer];
  const metric = profile.metric(feature.properties);
  const weight = heatmapWeight(feature, activeLayers);

  return {
    layerMetric: metric.value,
    layerLabel: metric.label,
    markerColor: profile.highColor,
    markerRadius: Math.round(14 + weight * 18 + activeLayers.length * 2)
  };
}

function selectedLayerSummary(activeLayers: WorkforceLayerId[]) {
  if (!activeLayers.length) return 'No evidence layers selected';
  return activeLayers.map((layer) => layerProfiles[layer].label).join(' + ');
}

function toMapGeoJson(
  regions: RegionInsightFeatureCollection,
  activeLayers: WorkforceLayerId[]
): RegionMapFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: regions.features.map((feature) => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        ...feature.properties,
        ...primaryMetric(feature, activeLayers),
        heatmapWeight: heatmapWeight(feature, activeLayers)
      }
    }))
  };
}

function featureBounds(features: RegionMapFeature[]) {
  if (!features.length) return undefined;

  return features.reduce(
    (bounds, feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return [
        [Math.min(bounds[0][0], lng), Math.min(bounds[0][1], lat)],
        [Math.max(bounds[1][0], lng), Math.max(bounds[1][1], lat)]
      ] as [[number, number], [number, number]];
    },
    [
      [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
      [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]]
    ] as [[number, number], [number, number]]
  );
}

function selectedRegionFromFeature(feature: MapGeoJSONFeature): RegionInsightProperties {
  const properties = feature.properties as RegionMapProperties;
  return {
    id: properties.id,
    name: properties.name,
    state: properties.state,
    primaryIndustry: properties.primaryIndustry,
    employmentRatePercent: Number(properties.employmentRatePercent),
    vacancies: Number(properties.vacancies),
    skillsGapIndex: Number(properties.skillsGapIndex),
    trainingCompletions: Number(properties.trainingCompletions),
    sustainedOutcomeRatePercent: Number(properties.sustainedOutcomeRatePercent),
    participantCount: Number(properties.participantCount),
    cohort: properties.cohort
  };
}

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
    const mapElement = ref<HTMLElement | null>(null);
    let map: Map | undefined;
    let popup: Popup | undefined;

    const mapData = () => toMapGeoJson(props.regions, props.activeLayers);
    const activeProfile = () => layerProfiles[primaryLayer(props.activeLayers)];

    const syncSource = () => {
      const data = mapData();
      const source = map?.getSource(REGION_SOURCE_ID) as GeoJSONSource | undefined;
      source?.setData(data as Parameters<GeoJSONSource['setData']>[0]);
    };

    const syncEvidencePaint = () => {
      if (!map?.getLayer(HEATMAP_LAYER_ID) || !map.getLayer(CIRCLE_LAYER_ID)) return;

      const profile = activeProfile();

      map.setPaintProperty(HEATMAP_LAYER_ID, 'heatmap-intensity', props.activeLayers.length ? 1.9 : 0.35);
      map.setPaintProperty(HEATMAP_LAYER_ID, 'heatmap-radius', [
        'interpolate',
        ['linear'],
        ['zoom'],
        7,
        props.activeLayers.length ? 54 : 28,
        11,
        props.activeLayers.length ? 118 : 44
      ]);
      map.setPaintProperty(HEATMAP_LAYER_ID, 'heatmap-opacity', props.activeLayers.length ? 0.66 : 0.18);
      map.setPaintProperty(CIRCLE_LAYER_ID, 'circle-opacity', props.activeLayers.length ? 0.94 : 0.42);
      map.setPaintProperty(HEATMAP_LAYER_ID, 'heatmap-color', [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(255, 255, 255, 0)',
        0.22,
        profile.lowColor,
        0.55,
        profile.midColor,
        1,
        profile.highColor
      ]);
    };

    const fitToRegions = () => {
      if (!map) return;

      const data = mapData();
      const bounds = featureBounds(data.features);

      if (!bounds) return;

      const isSinglePoint = bounds[0][0] === bounds[1][0] && bounds[0][1] === bounds[1][1];

      if (isSinglePoint) {
        map.fitBounds(BRISBANE_CONTEXT_BOUNDS, { padding: 54, maxZoom: 10.2, duration: 0 });
        return;
      }

      map.fitBounds(bounds, { padding: 84, maxZoom: 7.5, duration: 0 });
    };

    const selectFeature = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const selectedRegion = selectedRegionFromFeature(feature);
      const coordinates = (feature.geometry as PointGeometry).coordinates.slice() as [number, number];
      const label = String(feature.properties?.layerLabel ?? '');

      popup
        ?.setLngLat(coordinates)
        .setHTML(
          `<strong>${selectedRegion.name}</strong><span>${selectedRegion.primaryIndustry}</span><span>${label}</span>`
        )
        .addTo(map as Map);

      emit('regionSelected', selectedRegion);
    };

    onMounted(() => {
      if (!mapElement.value) return;

      popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'dewr-map__popup'
      });

      map = new Map({
        container: mapElement.value,
        style: blankWorkforceStyle,
        center: [145.3, -25.7],
        zoom: 4.2,
        attributionControl: false,
        cooperativeGestures: true
      });

      map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

      map.on('load', () => {
        map?.addSource(CONTEXT_SOURCE_ID, {
          type: 'geojson',
          data: brisbaneContext as Parameters<GeoJSONSource['setData']>[0]
        });

        map?.addLayer({
          id: CONTEXT_WATER_LAYER_ID,
          type: 'fill',
          source: CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'water'],
          paint: {
            'fill-color': '#c7e0eb',
            'fill-opacity': 0.92
          }
        });

        map?.addLayer({
          id: CONTEXT_CORRIDOR_LAYER_ID,
          type: 'fill',
          source: CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'corridor'],
          paint: {
            'fill-color': '#d8e7d2',
            'fill-opacity': 0.56
          }
        });

        map?.addLayer({
          id: CONTEXT_REGION_LAYER_ID,
          type: 'fill',
          source: CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'region'],
          paint: {
            'fill-color': '#f5f0dc',
            'fill-opacity': 0.76
          }
        });

        map?.addLayer({
          id: CONTEXT_REGION_OUTLINE_LAYER_ID,
          type: 'line',
          source: CONTEXT_SOURCE_ID,
          filter: ['in', ['get', 'kind'], ['literal', ['region', 'corridor']]],
          paint: {
            'line-color': '#547083',
            'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1.2, 11, 2.4],
            'line-dasharray': [2, 1.5],
            'line-opacity': 0.82
          }
        });

        map?.addLayer({
          id: CONTEXT_RIVER_LAYER_ID,
          type: 'line',
          source: CONTEXT_SOURCE_ID,
          filter: ['==', ['get', 'kind'], 'river'],
          paint: {
            'line-color': '#4f9bb8',
            'line-width': ['interpolate', ['linear'], ['zoom'], 7, 3, 11, 7],
            'line-opacity': 0.9
          }
        });

        map?.addLayer({
          id: CONTEXT_LABEL_LAYER_ID,
          type: 'symbol',
          source: CONTEXT_SOURCE_ID,
          filter: ['in', ['get', 'kind'], ['literal', ['region', 'water', 'river']]],
          layout: {
            'text-field': ['get', 'name'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 7, 11, 11, 14],
            'text-anchor': 'center',
            'symbol-placement': 'point'
          },
          paint: {
            'text-color': '#405367',
            'text-halo-color': '#f7fbfc',
            'text-halo-width': 1.2
          }
        });

        map?.addSource(REGION_SOURCE_ID, {
          type: 'geojson',
          data: mapData() as Parameters<GeoJSONSource['setData']>[0]
        });

        map?.addLayer({
          id: HEATMAP_LAYER_ID,
          type: 'heatmap',
          source: REGION_SOURCE_ID,
          paint: {
            'heatmap-weight': ['get', 'heatmapWeight'],
            'heatmap-intensity': 1.9,
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 7, 54, 11, 118],
            'heatmap-opacity': 0.66,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(255, 255, 255, 0)',
              0.22,
              activeProfile().lowColor,
              0.55,
              activeProfile().midColor,
              1,
              activeProfile().highColor
            ]
          }
        });

        map?.addLayer({
          id: CIRCLE_LAYER_ID,
          type: 'circle',
          source: REGION_SOURCE_ID,
          paint: {
            'circle-radius': ['get', 'markerRadius'],
            'circle-color': ['get', 'markerColor'],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 3,
            'circle-opacity': props.activeLayers.length ? 0.94 : 0.42
          }
        });

        map?.addLayer({
          id: LABEL_LAYER_ID,
          type: 'symbol',
          source: REGION_SOURCE_ID,
          layout: {
            'text-field': ['concat', ['get', 'name'], '\n', ['get', 'layerLabel']],
            'text-size': 13,
            'text-offset': [0, 1.8],
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#152238',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.4
          }
        });

        fitToRegions();
        syncEvidencePaint();
      });

      map.on('click', CIRCLE_LAYER_ID, selectFeature);
      map.on('mouseenter', CIRCLE_LAYER_ID, () => {
        if (map) map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', CIRCLE_LAYER_ID, () => {
        if (map) map.getCanvas().style.cursor = '';
      });
    });

    watch(() => props.regions, () => {
      syncSource();
      fitToRegions();
    });

    watch(() => props.activeLayers, () => {
      syncSource();
      syncEvidencePaint();
    });

    onBeforeUnmount(() => {
      popup?.remove();
      map?.remove();
    });

    return () =>
      h('div', { class: 'dewr-map', role: 'region', 'aria-label': 'Regional workforce intelligence map' }, [
        h('div', { ref: mapElement, class: 'dewr-map__canvas' }),
        h(
          'div',
          { class: 'dewr-map__legend' },
          [
            h('span', { class: 'dewr-map__legend-title' }, selectedLayerSummary(props.activeLayers)),
            h('span', { class: 'dewr-map__legend-label' }, activeProfile().lowLabel),
            h('span', {
              class: 'dewr-map__legend-ramp',
              style: {
                background: `linear-gradient(90deg, ${activeProfile().lowColor}, ${activeProfile().midColor}, ${activeProfile().highColor})`
              }
            }),
            h('span', { class: 'dewr-map__legend-label' }, activeProfile().highLabel)
          ]
        ),
        h(
          'div',
          { class: 'dewr-map__evidence', 'aria-label': 'Active evidence layer metrics' },
          (props.activeLayers.length ? props.activeLayers : [DEFAULT_LAYER]).map((layer) => {
            const profile = layerProfiles[layer];
            const firstRegion = props.regions.features[0]?.properties;
            const metric = firstRegion ? profile.metric(firstRegion).label : profile.label;

            return h(
              'span',
              {
                key: layer,
                class: 'dewr-map__evidence-chip',
                style: { '--layer-color': profile.highColor }
              },
              [h('strong', profile.label), h('span', metric)]
            );
          })
        )
      ]);
  }
});
