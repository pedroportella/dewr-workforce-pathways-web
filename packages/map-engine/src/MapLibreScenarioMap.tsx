import maplibregl, { type GeoJSONSource, type Map, type StyleSpecification } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import type { CorridorFeatureCollection, CorridorLinkProperties, TimePeriod, TransportLayerId } from '@tmr/services-tmr';

export interface MapLibreScenarioMapProps {
  network: CorridorFeatureCollection;
  activeLayers: TransportLayerId[];
  timePeriod: TimePeriod;
  onLinkSelected: (link: CorridorLinkProperties) => void;
}

const mapStyle = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
} satisfies StyleSpecification;

function linkColour(mode: string): string {
  if (mode === 'bus') return '#0277bd';
  if (mode === 'freight') return '#6a1b9a';
  return '#ef6c00';
}

export function MapLibreScenarioMap({ network, activeLayers, timePeriod, onLinkSelected }: MapLibreScenarioMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: [153.025, -27.47],
      zoom: 11
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const filteredFeatures = network.features.filter((feature) => feature.properties.timePeriod === timePeriod || timePeriod === 'INTER_PEAK');
    const filteredNetwork: CorridorFeatureCollection = { type: 'FeatureCollection', features: filteredFeatures };

    const applyLayers = () => {
      if (!map.getSource('network')) {
        map.addSource('network', { type: 'geojson', data: filteredNetwork });
        map.addLayer({
          id: 'network-links',
          type: 'line',
          source: 'network',
          paint: {
            'line-width': ['interpolate', ['linear'], ['get', 'delayMinutes'], 0, 3, 15, 9],
            'line-color': ['case', ['==', ['get', 'mode'], 'bus'], linkColour('bus'), ['==', ['get', 'mode'], 'freight'], linkColour('freight'), linkColour('road')],
            'line-opacity': 0.86
          }
        });
        map.on('click', 'network-links', (event) => {
          const feature = event.features?.[0];
          if (feature?.properties) {
            onLinkSelected(feature.properties as CorridorLinkProperties);
          }
        });
        map.on('mouseenter', 'network-links', () => { map.getCanvas().classList.add('tmr-map-canvas--interactive'); });
        map.on('mouseleave', 'network-links', () => { map.getCanvas().classList.remove('tmr-map-canvas--interactive'); });
      } else {
        const source = map.getSource('network') as GeoJSONSource;
        source.setData(filteredNetwork);
      }

      const showNetwork = activeLayers.some((layer) => ['congestion', 'publicTransport', 'freight'].includes(layer));
      if (map.getLayer('network-links')) {
        map.setLayoutProperty('network-links', 'visibility', showNetwork ? 'visible' : 'none');
      }
    };

    if (map.isStyleLoaded()) {
      applyLayers();
    } else {
      map.once('load', applyLayers);
    }
  }, [activeLayers, network, onLinkSelected, timePeriod]);

  return <div className="tmr-map" ref={containerRef} aria-label="Transport scenario map" />;
}
