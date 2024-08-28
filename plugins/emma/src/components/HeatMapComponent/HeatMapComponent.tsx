import React from 'react';
import { Icon, LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useApi } from '@backstage/frontend-plugin-api';
import { emmaApiRef, EmmaDataCenter } from '@internal/backstage-plugin-emma-common';

//@ts-ignore
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3'

import {
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import 'leaflet/dist/leaflet.css';
import useAsync from 'react-use/lib/useAsync';

export type HeatMapProps = {
  width: string;
  height: string;
  center: LatLngTuple;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  scrollWheelZoom: boolean;
  entries: EmmaDataCenter[];
  maxBounds?: [number, number][];
};

const heatMapIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png'
});

export const HeatMap = ({width, height, center, zoom, minZoom, maxZoom, scrollWheelZoom, entries, maxBounds }: HeatMapProps) => {
  const points = entries.map((dataCenter) => ({
    lat: dataCenter.latitude,
    lng: dataCenter.longitude,
    intensity: dataCenter.intensity,
    radius: dataCenter.radius
  }));

  return (
    <MapContainer style={{height: height, width: width}} center={center} zoom={zoom} minZoom={minZoom} maxZoom={maxZoom} maxBoundsViscosity={1.0} maxBounds={maxBounds} scrollWheelZoom={scrollWheelZoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer
        fitBoundsOnLoad
        fitBoundsOnUpdate
        points={points}
        longitudeExtractor={(point: any) => point.lng}
        latitudeExtractor={(point: any) => point.lat}
        intensityExtractor={(point: any) => point.intensity}
        radiusExtractor={(point: any) => point.radius}
      />
      {entries.map((dataCenter) => (
        <Marker
          key={dataCenter.region_code}
          position={[dataCenter.latitude, dataCenter.longitude]}
          icon={heatMapIcon}
        >
          <Popup>
            <strong>{dataCenter.name}</strong><br />
            {dataCenter.address}<br />
            Provider: {dataCenter.provider}<br />
            Price: {dataCenter.price}<br />
            Intensity: {dataCenter.intensity}<br />
            Radius: {dataCenter.radius}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export const HeatMapComponent = () => {
  const emmaApi = useApi(emmaApiRef);

  const { value, loading, error } = useAsync(async (): Promise<EmmaDataCenter[]> => {
    return await emmaApi.getDataCenters();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <HeatMap width={"1025px"} height={"550px"} center={[0, 0]} zoom={2} minZoom={2} maxZoom={18} scrollWheelZoom={true} entries={value || []} maxBounds={[[-90, -180], [90, 180] ]} />;
};
