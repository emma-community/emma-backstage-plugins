import React from 'react';
import { Icon, LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, LayersControl } from 'react-leaflet'
import { useApi } from '@backstage/frontend-plugin-api';
import { EmmaDataCenter } from '@internal/backstage-plugin-emma-common';
import { emmaApiRef } from '../../plugin';

const { Overlay } = LayersControl;

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
    radius: dataCenter.radius,
    providerName: dataCenter.providerName
  }));

  const providers = [...new Set(entries.map(entry => entry.providerName))];

  return (
    <MapContainer style={{height: height, width: width}} center={center} zoom={zoom} minZoom={minZoom} maxZoom={maxZoom} maxBoundsViscosity={1.0} maxBounds={maxBounds} scrollWheelZoom={scrollWheelZoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        {providers.map(provider => (
          <Overlay key={provider} name={provider + ''}>
            <LayerGroup>              
              <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={points.filter(point => point.providerName === provider)}
                longitudeExtractor={(point: any) => point.lng}
                latitudeExtractor={(point: any) => point.lat}
                intensityExtractor={(point: any) => point.intensity}
                radiusExtractor={(point: any) => point.radius}
              />
              {entries.filter(entry => entry.providerName === provider).map(dataCenter => (
                <Marker
                  key={dataCenter.region_code}
                  position={[dataCenter.location.latitude, dataCenter.location.longitude]}
                  icon={heatMapIcon}
                >
                  <Popup>
                    <strong>{dataCenter.name}</strong><br />
                    {dataCenter.address} (<i>{dataCenter.providerName}</i>)<br />
                    Best deal: <a href="https://www.emma.ms/pricing"><b>{dataCenter.price} EUR</b></a><br />
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
};

export const HeatMapComponent = () => {
  const emmaApi = useApi(emmaApiRef);

  const { value, loading, error } = useAsync(async (): Promise<EmmaDataCenter[]> => {
    const dataCenters = await emmaApi.getDataCenters();
    const allComputeConfigs = await emmaApi.getComputeConfigs();

    // Convert all prices to monthly prices
    allComputeConfigs.forEach(config => {
      const unit = config.cost?.unit;
      let price = config.cost?.pricePerUnit;

      if (price !== undefined) {
        switch (unit) {
          case 'HOURS':
            price = price * 24 * 30;            
            break;
          case 'DAYS':
            price = price * 30            
            break
          case 'MONTHS':
          default:
            break;
        }
      }

      config.cost!.pricePerUnit = price;
      config.cost!.unit = 'MONTHS';
    });

    const filteredPrices = allComputeConfigs.map(config => config.cost?.pricePerUnit).filter(price => price !== undefined) as number[];
    const globalMedianPrice = filteredPrices.reduce((acc, price) => acc + price, 0) / (filteredPrices.length > 0 ? filteredPrices.length : 1);
   
    // TODO: There is be a very low number of compute resources for some data centers. We need to figure out why and decide if we filter out the onces we dont have prices for.
    dataCenters.forEach(dataCenter => {
      const computeConfigs = allComputeConfigs.filter(config => config.dataCenterId === dataCenter.id);

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
      } else {
        dataCenter.price = 0;
        dataCenter.intensity = 0;
        dataCenter.radius = 0;
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
