import { render, screen } from '@testing-library/react';
import type { CorridorFeature, CorridorFeatureCollection, CorridorLinkProperties } from '@tmr/services-tmr';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MapLibreScenarioMap } from './MapLibreScenarioMap';

type SourceMock = {
  data: CorridorFeatureCollection;
  setData: ReturnType<typeof vi.fn>;
};

const maplibreMock = vi.hoisted(() => {
  class MockNavigationControl {
    options: unknown;

    constructor(options: unknown) {
      this.options = options;
    }
  }

  class MockMap {
    static instances: MockMap[] = [];
    static styleLoaded = true;

    options: unknown;
    sources: Record<string, SourceMock> = {};
    layers = new Set<string>();
    canvas = document.createElement('canvas');
    addControl = vi.fn();
    remove = vi.fn();
    isStyleLoaded = vi.fn(() => MockMap.styleLoaded);
    once = vi.fn((eventName: string, handler: () => void) => {
      this.onceHandlers[eventName] = handler;
    });
    addSource = vi.fn((sourceId: string, source: { data: CorridorFeatureCollection }) => {
      this.sources[sourceId] = {
        data: source.data,
        setData: vi.fn((data: CorridorFeatureCollection) => {
          this.sources[sourceId].data = data;
        }),
      };
    });
    getSource = vi.fn((sourceId: string) => this.sources[sourceId]);
    addLayer = vi.fn((layer: { id: string }) => {
      this.layers.add(layer.id);
    });
    getLayer = vi.fn((layerId: string) => (this.layers.has(layerId) ? { id: layerId } : undefined));
    setLayoutProperty = vi.fn();
    getCanvas = vi.fn(() => this.canvas);
    on = vi.fn((eventName: string, layerIdOrHandler: string | ((event: unknown) => void), maybeHandler?: (event: unknown) => void) => {
      const key = typeof layerIdOrHandler === 'string' ? `${eventName}:${layerIdOrHandler}` : eventName;
      const handler = typeof layerIdOrHandler === 'string' ? maybeHandler : layerIdOrHandler;

      if (handler) {
        this.eventHandlers[key] = handler;
      }
    });
    eventHandlers: Record<string, (event: unknown) => void> = {};
    onceHandlers: Record<string, () => void> = {};

    constructor(options: unknown) {
      this.options = options;
      MockMap.instances.push(this);
    }

    trigger(eventName: string, layerId: string, event: unknown) {
      this.eventHandlers[`${eventName}:${layerId}`]?.(event);
    }

    triggerLoad() {
      this.onceHandlers.load?.();
    }
  }

  return {
    MockMap,
    MockNavigationControl,
  };
});

vi.mock('maplibre-gl', () => ({
  default: {
    Map: maplibreMock.MockMap,
    NavigationControl: maplibreMock.MockNavigationControl,
  },
}));

const createFeature = (
  id: string,
  overrides: Partial<CorridorLinkProperties> = {},
): CorridorFeature => ({
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [153.01, -27.46],
      [153.02, -27.47],
    ],
  },
  properties: {
    id,
    name: `${id} link`,
    corridor: 'Pacific Motorway',
    mode: 'road',
    baseSpeedKph: 80,
    scenarioSpeedKph: 54,
    volume: 1200,
    delayMinutes: 8,
    reliabilityPercent: 82,
    timePeriod: 'AM_PEAK',
    ...overrides,
  },
});

const network: CorridorFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    createFeature('am-road'),
    createFeature('pm-bus', { mode: 'bus', timePeriod: 'PM_PEAK' }),
    createFeature('inter-freight', { mode: 'freight', timePeriod: 'INTER_PEAK' }),
  ],
};

describe('MapLibreScenarioMap', () => {
  beforeEach(() => {
    maplibreMock.MockMap.instances = [];
    maplibreMock.MockMap.styleLoaded = true;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initialises MapLibre with the scenario map container and navigation control', () => {
    render(
      <MapLibreScenarioMap
        activeLayers={['congestion']}
        network={network}
        onLinkSelected={vi.fn()}
        timePeriod="AM_PEAK"
      />,
    );

    const map = maplibreMock.MockMap.instances[0];

    expect(screen.getByLabelText('Transport scenario map').className).toBe('tmr-map');
    expect(map.options).toMatchObject({
      center: [153.025, -27.47],
      zoom: 11,
    });
    expect(map.addControl).toHaveBeenCalledWith(expect.any(maplibreMock.MockNavigationControl), 'top-right');
  });

  it('adds a filtered network source and toggles line visibility from active layers', () => {
    render(
      <MapLibreScenarioMap
        activeLayers={['accessibility']}
        network={network}
        onLinkSelected={vi.fn()}
        timePeriod="AM_PEAK"
      />,
    );

    const map = maplibreMock.MockMap.instances[0];

    expect(map.addSource).toHaveBeenCalledWith('network', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [network.features[0]],
      },
    });
    expect(map.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'network-links',
        type: 'line',
        source: 'network',
      }),
    );
    expect(map.setLayoutProperty).toHaveBeenCalledWith('network-links', 'visibility', 'none');
  });

  it('updates existing source data when the requested time period changes', () => {
    const { rerender } = render(
      <MapLibreScenarioMap
        activeLayers={['congestion']}
        network={network}
        onLinkSelected={vi.fn()}
        timePeriod="AM_PEAK"
      />,
    );

    const map = maplibreMock.MockMap.instances[0];

    rerender(
      <MapLibreScenarioMap
        activeLayers={['congestion']}
        network={network}
        onLinkSelected={vi.fn()}
        timePeriod="INTER_PEAK"
      />,
    );

    expect(map.sources.network.setData).toHaveBeenCalledWith({
      type: 'FeatureCollection',
      features: network.features,
    });
    expect(map.setLayoutProperty).toHaveBeenLastCalledWith('network-links', 'visibility', 'visible');
  });

  it('selects a corridor link from MapLibre click events', () => {
    const onLinkSelected = vi.fn();

    render(
      <MapLibreScenarioMap
        activeLayers={['congestion']}
        network={network}
        onLinkSelected={onLinkSelected}
        timePeriod="AM_PEAK"
      />,
    );

    const map = maplibreMock.MockMap.instances[0];
    map.trigger('click', 'network-links', { features: [network.features[0]] });

    expect(onLinkSelected).toHaveBeenCalledWith(network.features[0].properties);
  });

  it('waits for the map load event before applying layers when style is not loaded', () => {
    maplibreMock.MockMap.styleLoaded = false;

    render(
      <MapLibreScenarioMap
        activeLayers={['freight']}
        network={network}
        onLinkSelected={vi.fn()}
        timePeriod="PM_PEAK"
      />,
    );

    const map = maplibreMock.MockMap.instances[0];

    expect(map.addSource).not.toHaveBeenCalled();
    expect(map.once).toHaveBeenCalledWith('load', expect.any(Function));

    map.triggerLoad();

    expect(map.addSource).toHaveBeenCalledWith(
      'network',
      expect.objectContaining({
        data: {
          type: 'FeatureCollection',
          features: [network.features[1]],
        },
      }),
    );
  });

  it('removes the MapLibre instance on unmount', () => {
    const { unmount } = render(
      <MapLibreScenarioMap
        activeLayers={['congestion']}
        network={network}
        onLinkSelected={vi.fn()}
        timePeriod="AM_PEAK"
      />,
    );

    const map = maplibreMock.MockMap.instances[0];
    unmount();

    expect(map.remove).toHaveBeenCalledTimes(1);
  });
});
