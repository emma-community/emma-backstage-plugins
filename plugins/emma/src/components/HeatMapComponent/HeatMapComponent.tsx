import React from 'react';
import { Icon, LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useApi } from '@backstage/frontend-plugin-api';
import { EmmaDataCenter } from '@internal/backstage-plugin-emma-common';
import { emmaApiRef } from '../../plugin';

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
    lat: dataCenter.location.latitude,
    lng: dataCenter.location.longitude,
    intensity: dataCenter.intensity,
    radius: dataCenter.radius
  }));

  return (
    // TODO: Add LayerGroup for markers based on provider type.
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
          position={[dataCenter.location.latitude, dataCenter.location.longitude]}
          // TODO: Figure out if a better icon will center the pin closer to the heatmap center on zoom 2 - 8
          icon={heatMapIcon}
        >
          <Popup>
            <strong>{dataCenter.name}</strong><br />
            {dataCenter.address}<br />
            Provider: {dataCenter.providerName}<br />
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
    const dataCenters = await emmaApi.getDataCenters();
    const allComputeConfigs = await emmaApi.getComputeConfigs();

    // TODO: Price are the same currency, but different units. We need to take this into account and convert them to a common unit.
    const filteredPrices = allComputeConfigs.map(config => config.cost?.pricePerUnit).filter(price => price !== undefined) as number[]; 
    const globalMedianPrice = filteredPrices.reduce((acc, price) => acc + price, 0) / (filteredPrices.length > 0 ? filteredPrices.length : 1);
    
    dataCenters.forEach(dataCenter => {
      const computeConfigs = allComputeConfigs.filter(config => config.dataCenterId === dataCenter.id);

      // TODO: There seems to be a very low number of compute resources for some data centers. We need to figure out why.
      console.log(computeConfigs, dataCenter);

      if (computeConfigs.length > 0) {
        computeConfigs.sort((a, b) => {
          const priceA = a.cost?.pricePerUnit;
          const priceB = b.cost?.pricePerUnit;
      
          if (priceA !== undefined && priceB !== undefined) {
              return priceA - priceB;
          } else if (priceA === undefined && priceB === undefined) {
              return 0;
          } else if (priceA === undefined) {
              return 1;
          } else {
              return -1;
          }
        });

        dataCenter.price = computeConfigs[0].cost?.pricePerUnit as number
        dataCenter.intensity = dataCenter.price / globalMedianPrice;
        dataCenter.radius = dataCenter.price * 10 / globalMedianPrice;
      }
    });

    return dataCenters;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <HeatMap width={"1025px"} height={"550px"} center={[0, 0]} zoom={2} minZoom={2} maxZoom={18} scrollWheelZoom={true} entries={value || []} maxBounds={[[-90, -180], [90, 180] ]} />;
};
