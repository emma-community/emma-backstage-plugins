import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/frontend-plugin-api';
import {
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { EmmaDataCenter, EmmaComputeUnit } from '@emma-community/backstage-plugin-emma-common';
import { emmaApiRef } from '../../plugin';
import { Icon, LatLngTuple } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

// @ts-ignore
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3'

const { Overlay } = LayersControl;

export type HeatMapEntity = EmmaDataCenter & {
  price: number;
  intensity: number;
  radius: number;
}

export type HeatMapProps = {
  width: string;
  height: string;
  center: LatLngTuple;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  scrollWheelZoom: boolean;
  data: HeatMapEntity[];
  maxBounds?: [number, number][];
};

const heatMapIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41]
});

export const HeatMap = ({width, height, center, zoom, minZoom, maxZoom, scrollWheelZoom, data, maxBounds }: HeatMapProps) => {
  const points = data.map((entity) => ({
    lat: entity.location.latitude,
    lng: entity.location.longitude,
    intensity: entity.intensity,
    radius: entity.radius,
    providerName: entity.providerName
  }));

  const providers = [...new Set(data.map(entity => entity.providerName))];
  const preselectedProviders: (string | undefined)[] = providers.filter(provider => provider === 'Amazon EC2' || provider === 'Azure' || provider === 'GCP');

  return (
    <MapContainer style={{height: height, width: width}} center={center} zoom={zoom} minZoom={minZoom} maxZoom={maxZoom} maxBoundsViscosity={1.0} maxBounds={maxBounds} scrollWheelZoom={scrollWheelZoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        {providers.map(provider => (
          <Overlay key={provider} name={provider!} checked={preselectedProviders?.includes(provider)}>
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
              {data.filter(entity => entity.providerName === provider).map(dataCenter => (
                <Marker
                  key={dataCenter.id}
                  position={[dataCenter.location.latitude, dataCenter.location.longitude]}
                  icon={heatMapIcon}
                >
                  <Popup>
                    <strong>{dataCenter.id}</strong><br />
                    {dataCenter.price !== undefined && dataCenter.price > 0 && (
                      <a href="https://www.emma.ms/pricing" target="_blank">
                        <strong>{dataCenter.price} EUR</strong>
                      </a>
                    )}
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

  const { value, loading, error } = useAsync(async (): Promise<HeatMapEntity[]> => {
    let dataCenters = (await emmaApi.getDataCenters())
                        .filter(dataCenter => dataCenter.location !== undefined && dataCenter.location.latitude !== 0 && dataCenter.location.longitude !== 0)
    
    // Map datacenter zones so we only get one entity pr. physical data center
    dataCenters = Array.from(
      new Map(dataCenters.map((dc) => [dc.id!.replace(/-[a-z]$/, ''), dc])).values(),
    );

    const allComputeConfigs = await emmaApi.getComputeConfigs();

    allComputeConfigs.forEach(config => {
      const unit = config.cost?.unit;
      let price = config.cost?.pricePerUnit;

      if (price !== undefined) {
        switch (unit) {
          case EmmaComputeUnit.Hours:
            price = price * 24 * 30;            
            break;
          case EmmaComputeUnit.Days:
            price = price * 30            
            break
          case EmmaComputeUnit.Months:
          default:
            break;
        }
      }

      config.cost!.pricePerUnit = price;
      config.cost!.unit = EmmaComputeUnit.Months;
    });

    const filteredPrices = allComputeConfigs.map(config => config.cost?.pricePerUnit).filter(price => price !== undefined) as number[];
    const globalMedianPrice = filteredPrices.reduce((acc, price) => acc + price, 0) / (filteredPrices.length > 0 ? filteredPrices.length : 1);

    const heatMapEntities = dataCenters.map(dataCenter => {
      const computeConfigs = allComputeConfigs.filter(config => config.locationId === dataCenter.locationId);
      let price = 0;
      let intensity = 0;
      let radius = 0;

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
          } 
          
          return -1;
        });

        price = computeConfigs[0].cost?.pricePerUnit as number
        intensity = price / globalMedianPrice;
        radius = price / globalMedianPrice;
      }
      
      return {...dataCenter, price, intensity, radius};
    }) as HeatMapEntity[];

    return heatMapEntities;
  }, []);

  if (loading) {
    return (<Progress />);
  } else if (error) {
    return (<ResponseErrorPanel error={error} />);
  }

  // eslint-disable-next-line
  return (<HeatMap width="1025px" height="550px" center={[0, 0]} zoom={2} minZoom={2} maxZoom={18} scrollWheelZoom={true} data={value || []} maxBounds={[[-90, -180], [90, 180] ]} />);
};
