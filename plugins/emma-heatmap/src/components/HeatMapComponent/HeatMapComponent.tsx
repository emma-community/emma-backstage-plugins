import React from 'react';
import { Icon } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import {
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import 'leaflet/dist/leaflet.css';
import useAsync from 'react-use/lib/useAsync';

export const dataCenters = {
  results: [    
  {
    "name": "East US",
    "address": "Virginia, USA",
    "country_code": "US",
    "region_code": "eastus",
    "longitude": -79.4209,
    "latitude": 37.4316,
    "provider": "AZURE"
  },
  {
    "name": "East US 2",
    "address": "Virginia, USA",
    "country_code": "US",
    "region_code": "eastus2",
    "longitude": -78.6569,
    "latitude": 36.8529,
    "provider": "AZURE"
  },
  {
    "name": "Central US",
    "address": "Iowa, USA",
    "country_code": "US",
    "region_code": "centralus",
    "longitude": -93.6091,
    "latitude": 41.5868,
    "provider": "AZURE"
  },
  {
    "name": "North Central US",
    "address": "Illinois, USA",
    "country_code": "US",
    "region_code": "northcentralus",
    "longitude": -89.3985,
    "latitude": 40.6331,
    "provider": "AZURE"
  },
  {
    "name": "South Central US",
    "address": "Texas, USA",
    "country_code": "US",
    "region_code": "southcentralus",
    "longitude": -98.4936,
    "latitude": 29.4241,
    "provider": "AZURE"
  },
  {
    "name": "West US",
    "address": "California, USA",
    "country_code": "US",
    "region_code": "westus",
    "longitude": -121.8947,
    "latitude": 37.3382,
    "provider": "AZURE"
  },
  {
    "name": "West US 2",
    "address": "Washington, USA",
    "country_code": "US",
    "region_code": "westus2",
    "longitude": -122.3321,
    "latitude": 47.6062,
    "provider": "AZURE"
  },
  {
    "name": "Canada Central",
    "address": "Toronto, Ontario, Canada",
    "country_code": "CA",
    "region_code": "canadacentral",
    "longitude": -79.3832,
    "latitude": 43.6532,
    "provider": "AZURE"
  },
  {
    "name": "Canada East",
    "address": "Quebec City, Quebec, Canada",
    "country_code": "CA",
    "region_code": "canadaeast",
    "longitude": -71.2074,
    "latitude": 46.8139,
    "provider": "AZURE"
  },
  {
    "name": "Brazil South",
    "address": "São Paulo, Brazil",
    "country_code": "BR",
    "region_code": "brazilsouth",
    "longitude": -46.6333,
    "latitude": -23.5505,
    "provider": "AZURE"
  },
  {
    "name": "North Europe",
    "address": "Dublin, Ireland",
    "country_code": "IE",
    "region_code": "northeurope",
    "longitude": -6.2603,
    "latitude": 53.3498,
    "provider": "AZURE"
  },
  {
    "name": "West Europe",
    "address": "Amsterdam, Netherlands",
    "country_code": "NL",
    "region_code": "westeurope",
    "longitude": 4.9041,
    "latitude": 52.3676,
    "provider": "AZURE"
  },
  {
    "name": "UK South",
    "address": "London, England, UK",
    "country_code": "GB",
    "region_code": "uksouth",
    "longitude": -0.1276,
    "latitude": 51.5074,
    "provider": "AZURE"
  },
  {
    "name": "UK West",
    "address": "Cardiff, Wales, UK",
    "country_code": "GB",
    "region_code": "ukwest",
    "longitude": -3.1791,
    "latitude": 51.4816,
    "provider": "AZURE"
  },
  {
    "name": "France Central",
    "address": "Paris, France",
    "country_code": "FR",
    "region_code": "francecentral",
    "longitude": 2.3522,
    "latitude": 48.8566,
    "provider": "AZURE"
  },
  {
    "name": "France South",
    "address": "Marseille, France",
    "country_code": "FR",
    "region_code": "francesouth",
    "longitude": 5.3698,
    "latitude": 43.2965,
    "provider": "AZURE"
  },
  {
    "name": "Germany Central",
    "address": "Frankfurt, Germany",
    "country_code": "DE",
    "region_code": "germanycentral",
    "longitude": 8.6821,
    "latitude": 50.1109,
    "provider": "AZURE"
  },
  {
    "name": "Germany Northeast",
    "address": "Berlin, Germany",
    "country_code": "DE",
    "region_code": "germanynortheast",
    "longitude": 13.405,
    "latitude": 52.5200,
    "provider": "AZURE"
  },
  {
    "name": "Norway East",
    "address": "Oslo, Norway",
    "country_code": "NO",
    "region_code": "norwayeast",
    "longitude": 10.7522,
    "latitude": 59.9139,
    "provider": "AZURE"
  },
  {
    "name": "Norway West",
    "address": "Stavanger, Norway",
    "country_code": "NO",
    "region_code": "norwaywest",
    "longitude": 5.7331,
    "latitude": 58.969975,
    "provider": "AZURE"
  },
  {
    "name": "Switzerland North",
    "address": "Zurich, Switzerland",
    "country_code": "CH",
    "region_code": "switzerlandnorth",
    "longitude": 8.5417,
    "latitude": 47.3769,
    "provider": "AZURE"
  },
  {
    "name": "Switzerland West",
    "address": "Geneva, Switzerland",
    "country_code": "CH",
    "region_code": "switzerlandwest",
    "longitude": 6.1432,
    "latitude": 46.2044,
    "provider": "AZURE"
  },
  {
    "name": "UAE North",
    "address": "Dubai, United Arab Emirates",
    "country_code": "AE",
    "region_code": "uaenorth",
    "longitude": 55.2708,
    "latitude": 25.2048,
    "provider": "AZURE"
  },
  {
    "name": "UAE Central",
    "address": "Abu Dhabi, United Arab Emirates",
    "country_code": "AE",
    "region_code": "uaecentral",
    "longitude": 54.3773,
    "latitude": 24.4539,
    "provider": "AZURE"
  },
  {
    "name": "South Africa North",
    "address": "Johannesburg, South Africa",
    "country_code": "ZA",
    "region_code": "southafricanorth",
    "longitude": 28.0473,
    "latitude": -26.2041,
    "provider": "AZURE"
  },
  {
    "name": "South Africa West",
    "address": "Cape Town, South Africa",
    "country_code": "ZA",
    "region_code": "southafricawest",
    "longitude": 18.4241,
    "latitude": -33.9249,
    "provider": "AZURE"
  },
  {
    "name": "East Asia",
    "address": "Hong Kong",
    "country_code": "HK",
    "region_code": "eastasia",
    "longitude": 114.1694,
    "latitude": 22.3193,
    "provider": "AZURE"
  },
  {
    "name": "Southeast Asia",
    "address": "Singapore",
    "country_code": "SG",
    "region_code": "southeastasia",
    "longitude": 103.8198,
    "latitude": 1.3521,
    "provider": "AZURE"
  },
  {
    "name": "Japan East",
    "address": "Tokyo, Japan",
    "country_code": "JP",
    "region_code": "japaneast",
    "longitude": 139.6917,
    "latitude": 35.6895,
    "provider": "AZURE"
  },
  {
    "name": "Japan West",
    "address": "Osaka, Japan",
    "country_code": "JP",
    "region_code": "japanwest",
    "longitude": 135.5022,
    "latitude": 34.6937,
    "provider": "AZURE"
  },
  {
    "name": "Korea Central",
    "address": "Seoul, South Korea",
    "country_code": "KR",
    "region_code": "koreacentral",
    "longitude": 126.978,
    "latitude": 37.5665,
    "provider": "AZURE"
  },
  {
    "name": "Korea South",
    "address": "Busan, South Korea",
    "country_code": "KR",
    "region_code": "koreasouth",
    "longitude": 129.0756,
    "latitude": 35.1796,
    "provider": "AZURE"
  },
  {
    "name": "Australia East",
    "address": "Sydney, Australia",
    "country_code": "AU",
    "region_code": "australiaeast",
    "longitude": 151.2093,
    "latitude": -33.8688,
    "provider": "AZURE"
  },
  {
    "name": "Australia Southeast",
    "address": "Melbourne, Australia",
    "country_code": "AU",
    "region_code": "australiasoutheast",
    "longitude": 144.9631,
    "latitude": -37.8136,
    "provider": "AZURE"
  },
  {
    "name": "Australia Central",
    "address": "Canberra, Australia",
    "country_code": "AU",
    "region_code": "australiacentral",
    "longitude": 149.1300,
    "latitude": -35.2809,
    "provider": "AZURE"
  },
  {
    "name": "India Central",
    "address": "Pune, India",
    "country_code": "IN",
    "region_code": "centralindia",
    "longitude": 73.8567,
    "latitude": 18.5204,
    "provider": "AZURE"
  },
  {
    "name": "India South",
    "address": "Chennai, India",
    "country_code": "IN",
    "region_code": "southindia",
    "longitude": 80.2707,
    "latitude": 13.0827,
    "provider": "AZURE"
  },
  {
    "name": "India West",
    "address": "Mumbai, India",
    "country_code": "IN",
    "region_code": "westindia",
    "longitude": 72.8777,
    "latitude": 19.076,
    "provider": "AZURE"
  },
  {
    "name": "China East",
    "address": "Shanghai, China",
    "country_code": "CN",
    "region_code": "chinaeast",
    "longitude": 121.4737,
    "latitude": 31.2304,
    "provider": "AZURE"
  },
  {
    "name": "China North",
    "address": "Beijing, China",
    "country_code": "CN",
    "region_code": "chinanorth",
    "longitude": 116.4074,
    "latitude": 39.9042,
    "provider": "AZURE"
  },
  {
    "name": "us-central1",
    "address": "Council Bluffs, Iowa, USA",
    "country_code": "US",
    "region_code": "us-central1",
    "longitude": -95.8608,
    "latitude": 41.2619,
    "provider": "GCP"
  },
  {
    "name": "us-west1",
    "address": "The Dalles, Oregon, USA",
    "country_code": "US",
    "region_code": "us-west1",
    "longitude": -121.1796,
    "latitude": 45.5946,
    "provider": "GCP"
  },
  {
    "name": "us-west2",
    "address": "Los Angeles, California, USA",
    "country_code": "US",
    "region_code": "us-west2",
    "longitude": -118.2437,
    "latitude": 34.0522,
    "provider": "GCP"
  },
  {
    "name": "us-west3",
    "address": "Salt Lake City, Utah, USA",
    "country_code": "US",
    "region_code": "us-west3",
    "longitude": -111.8910,
    "latitude": 40.7608,
    "provider": "GCP"
  },
  {
    "name": "us-west4",
    "address": "Las Vegas, Nevada, USA",
    "country_code": "US",
    "region_code": "us-west4",
    "longitude": -115.1398,
    "latitude": 36.1699,
    "provider": "GCP"
  },
  {
    "name": "us-east1",
    "address": "Moncks Corner, South Carolina, USA",
    "country_code": "US",
    "region_code": "us-east1",
    "longitude": -79.9987,
    "latitude": 33.199,
    "provider": "GCP"
  },
  {
    "name": "us-east4",
    "address": "Ashburn, Virginia, USA",
    "country_code": "US",
    "region_code": "us-east4",
    "longitude": -77.4875,
    "latitude": 39.0438,
    "provider": "GCP"
  },
  {
    "name": "northamerica-northeast1",
    "address": "Montréal, Quebec, Canada",
    "country_code": "CA",
    "region_code": "northamerica-northeast1",
    "longitude": -73.5673,
    "latitude": 45.5017,
    "provider": "GCP"
  },
  {
    "name": "southamerica-east1",
    "address": "São Paulo, Brazil",
    "country_code": "BR",
    "region_code": "southamerica-east1",
    "longitude": -46.6333,
    "latitude": -23.5505,
    "provider": "GCP"
  },
  {
    "name": "europe-west1",
    "address": "St. Ghislain, Belgium",
    "country_code": "BE",
    "region_code": "europe-west1",
    "longitude": 3.8192,
    "latitude": 50.4543,
    "provider": "GCP"
  },
  {
    "name": "europe-west2",
    "address": "London, England, UK",
    "country_code": "GB",
    "region_code": "europe-west2",
    "longitude": -0.1276,
    "latitude": 51.5074,
    "provider": "GCP"
  },
  {
    "name": "europe-west3",
    "address": "Frankfurt, Germany",
    "country_code": "DE",
    "region_code": "europe-west3",
    "longitude": 8.6821,
    "latitude": 50.1109,
    "provider": "GCP"
  },
  {
    "name": "europe-west4",
    "address": "Eemshaven, Netherlands",
    "country_code": "NL",
    "region_code": "europe-west4",
    "longitude": 6.8317,
    "latitude": 53.4273,
    "provider": "GCP"
  },
  {
    "name": "europe-west6",
    "address": "Zurich, Switzerland",
    "country_code": "CH",
    "region_code": "europe-west6",
    "longitude": 8.5417,
    "latitude": 47.3769,
    "provider": "GCP"
  },
  {
    "name": "europe-north1",
    "address": "Hamina, Finland",
    "country_code": "FI",
    "region_code": "europe-north1",
    "longitude": 27.1976,
    "latitude": 60.5693,
    "provider": "GCP"
  },
  {
    "name": "europe-central2",
    "address": "Warsaw, Poland",
    "country_code": "PL",
    "region_code": "europe-central2",
    "longitude": 21.0122,
    "latitude": 52.2297,
    "provider": "GCP"
  },
  {
    "name": "asia-east1",
    "address": "Changhua County, Taiwan",
    "country_code": "TW",
    "region_code": "asia-east1",
    "longitude": 120.5327,
    "latitude": 23.9924,
    "provider": "GCP"
  },
  {
    "name": "asia-east2",
    "address": "Hong Kong",
    "country_code": "HK",
    "region_code": "asia-east2",
    "longitude": 114.1694,
    "latitude": 22.3193,
    "provider": "GCP"
  },
  {
    "name": "asia-northeast1",
    "address": "Tokyo, Japan",
    "country_code": "JP",
    "region_code": "asia-northeast1",
    "longitude": 139.6917,
    "latitude": 35.6895,
    "provider": "GCP"
  },
  {
    "name": "asia-northeast2",
    "address": "Osaka, Japan",
    "country_code": "JP",
    "region_code": "asia-northeast2",
    "longitude": 135.5022,
    "latitude": 34.6937,
    "provider": "GCP"
  },
  {
    "name": "asia-northeast3",
    "address": "Seoul, South Korea",
    "country_code": "KR",
    "region_code": "asia-northeast3",
    "longitude": 126.978,
    "latitude": 37.5665,
    "provider": "GCP"
  },
  {
    "name": "asia-south1",
    "address": "Mumbai, India",
    "country_code": "IN",
    "region_code": "asia-south1",
    "longitude": 72.8777,
    "latitude": 19.076,
    "provider": "GCP"
  },
  {
    "name": "asia-south2",
    "address": "Delhi, India",
    "country_code": "IN",
    "region_code": "asia-south2",
    "longitude": 77.1025,
    "latitude": 28.7041,
    "provider": "GCP"
  },
  {
    "name": "asia-southeast1",
    "address": "Jurong West, Singapore",
    "country_code": "SG",
    "region_code": "asia-southeast1",
    "longitude": 103.6959,
    "latitude": 1.3409,
    "provider": "GCP"
  },
  {
    "name": "asia-southeast2",
    "address": "Jakarta, Indonesia",
    "country_code": "ID",
    "region_code": "asia-southeast2",
    "longitude": 106.8456,
    "latitude": -6.2088,
    "provider": "GCP"
  },
  {
    "name": "australia-southeast1",
    "address": "Sydney, Australia",
    "country_code": "AU",
    "region_code": "australia-southeast1",
    "longitude": 151.2093,
    "latitude": -33.8688,
    "provider": "GCP"
  },
  {
    "name": "australia-southeast2",
    "address": "Melbourne, Australia",
    "country_code": "AU",
    "region_code": "australia-southeast2",
    "longitude": 144.9631,
    "latitude": -37.8136,
    "provider": "GCP"
  },
  {
    "name": "newzealand-north1",
    "address": "Auckland, New Zealand",
    "country_code": "NZ",
    "region_code": "newzealand-north1",
    "longitude": 174.7633,
    "latitude": -36.8485,
    "provider": "GCP"
  },
  {
    "name": "me-west1",
    "address": "Tel Aviv, Israel",
    "country_code": "IL",
    "region_code": "me-west1",
    "longitude": 34.7818,
    "latitude": 32.0853,
    "provider": "GCP"
  },
  {
    "name": "me-central1",
    "address": "Doha, Qatar",
    "country_code": "QA",
    "region_code": "me-central1",
    "longitude": 51.5310,
    "latitude": 25.2861,
    "provider": "GCP"
  },
  {
    "name": "africa-south1",
    "address": "Johannesburg, South Africa",
    "country_code": "ZA",
    "region_code": "africa-south1",
    "longitude": 28.0473,
    "latitude": -26.2041,
    "provider": "GCP"
  },
  {
    "name": "US East (N. Virginia)",
    "address": "Ashburn, Virginia, USA",
    "country_code": "US",
    "region_code": "us-east-1",
    "longitude": -77.4875,
    "latitude": 39.0438,
    "provider": "AWS"
  },
  {
    "name": "US East (Ohio)",
    "address": "Columbus, Ohio, USA",
    "country_code": "US",
    "region_code": "us-east-2",
    "longitude": -82.9988,
    "latitude": 39.9612,
    "provider": "AWS"
  },
  {
    "name": "US West (N. California)",
    "address": "San Francisco, California, USA",
    "country_code": "US",
    "region_code": "us-west-1",
    "longitude": -122.4194,
    "latitude": 37.7749,
    "provider": "AWS"
  },
  {
    "name": "US West (Oregon)",
    "address": "Boardman, Oregon, USA",
    "country_code": "US",
    "region_code": "us-west-2",
    "longitude": -119.692,
    "latitude": 45.8399,
    "provider": "AWS"
  },
  {
    "name": "Canada (Central)",
    "address": "Montreal, Quebec, Canada",
    "country_code": "CA",
    "region_code": "ca-central-1",
    "longitude": -73.5673,
    "latitude": 45.5017,
    "provider": "AWS"
  },
  {
    "name": "South America (São Paulo)",
    "address": "São Paulo, Brazil",
    "country_code": "BR",
    "region_code": "sa-east-1",
    "longitude": -46.6333,
    "latitude": -23.5505,
    "provider": "AWS"
  },
  {
    "name": "Europe (Ireland)",
    "address": "Dublin, Ireland",
    "country_code": "IE",
    "region_code": "eu-west-1",
    "longitude": -6.2603,
    "latitude": 53.3498,
    "provider": "AWS"
  },
  {
    "name": "Europe (London)",
    "address": "London, England, UK",
    "country_code": "GB",
    "region_code": "eu-west-2",
    "longitude": -0.1276,
    "latitude": 51.5074,
    "provider": "AWS"
  },
  {
    "name": "Europe (Paris)",
    "address": "Paris, France",
    "country_code": "FR",
    "region_code": "eu-west-3",
    "longitude": 2.3522,
    "latitude": 48.8566,
    "provider": "AWS"
  },
  {
    "name": "Europe (Frankfurt)",
    "address": "Frankfurt, Germany",
    "country_code": "DE",
    "region_code": "eu-central-1",
    "longitude": 8.6821,
    "latitude": 50.1109,
    "provider": "AWS"
  },
  {
    "name": "Europe (Milan)",
    "address": "Milan, Italy",
    "country_code": "IT",
    "region_code": "eu-south-1",
    "longitude": 9.1895,
    "latitude": 45.4642,
    "provider": "AWS"
  },
  {
    "name": "Europe (Stockholm)",
    "address": "Stockholm, Sweden",
    "country_code": "SE",
    "region_code": "eu-north-1",
    "longitude": 18.0686,
    "latitude": 59.3293,
    "provider": "AWS"
  },
  {
    "name": "Middle East (Bahrain)",
    "address": "Manama, Bahrain",
    "country_code": "BH",
    "region_code": "me-south-1",
    "longitude": 50.5832,
    "latitude": 26.2285,
    "provider": "AWS"
  },
  {
    "name": "Africa (Cape Town)",
    "address": "Cape Town, South Africa",
    "country_code": "ZA",
    "region_code": "af-south-1",
    "longitude": 18.4241,
    "latitude": -33.9249,
    "provider": "AWS"
  },
  {
    "name": "Asia Pacific (Mumbai)",
    "address": "Mumbai, India",
    "country_code": "IN",
    "region_code": "ap-south-1",
    "longitude": 72.8777,
    "latitude": 19.076,
    "provider": "AWS"
  },
  {
    "name": "Asia Pacific (Hong Kong)",
    "address": "Hong Kong",
    "country_code": "HK",
    "region_code": "ap-east-1",
    "longitude": 114.1694,
    "latitude": 22.3193,
    "provider": "AWS"
  },
  {
    "name": "Asia Pacific (Osaka)",
    "address": "Osaka, Japan",
    "country_code": "JP",
    "region_code": "ap-northeast-3",
    "longitude": 135.5022,
    "latitude": 34.6937,
    "provider": "AWS"
  },
  {
    "name": "Asia Pacific (Seoul)",
    "address": "Seoul, South Korea",
    "country_code": "KR",
    "region_code": "ap-northeast-2",
    "longitude": 126.978,
    "latitude": 37.5665,
    "provider": "AWS"
  },
  {
    "name": "Asia Pacific (Singapore)",
    "address": "Singapore",
    "country_code": "SG",
    "region_code": "ap-southeast-1",
    "longitude": 103.8198,
    "latitude": 1.3521,
    "provider": "AWS"
  },
  {
    "name": "Asia Pacific (Sydney)",
    "address": "Sydney, Australia",
    "country_code": "AU",
    "region_code": "ap-southeast-2",
    "longitude": 151.2093,
    "latitude": -33.8688,
    "provider": "AWS"
  },
  {
    "name": "Asia Pacific (Tokyo)",
    "address": "Tokyo, Japan",
    "country_code": "JP",
    "region_code": "ap-northeast-1",
    "longitude": 139.6917,
    "latitude": 35.6895,
    "provider": "AWS"
  },
  {
    "name": "China (Beijing)",
    "address": "Beijing, China",
    "country_code": "CN",
    "region_code": "cn-north-1",
    "longitude": 116.4074,
    "latitude": 39.9042,
    "provider": "AWS"
  },
  {
    "name": "China (Ningxia)",
    "address": "Ningxia, China",
    "country_code": "CN",
    "region_code": "cn-northwest-1",
    "longitude": 106.2587,
    "latitude": 37.5097,
    "provider": "AWS"
  }
  ],
};

type DataCenter = {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  country_code: string;
  region_code: string;
  provider: string;
}

export type HeatMapProps = {
  width: string;
  height: string;
  entries: DataCenter[];
};

const heatMapIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png'
});

export const HeatMap = ({width, height, entries }: HeatMapProps) => {
  return (
    <MapContainer style={{height: height, width: width}} center={[20, 0]} zoom={2} maxZoom={18} maxBoundsViscosity={1.0} maxBounds={[[-90, -180], [90, 180] ]} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            Provider: {dataCenter.provider}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export const HeatMapComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<DataCenter[]> => {
    // Would use fetch in a real world example
    return dataCenters.results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <HeatMap width={"80vw"} height={"50vw"} entries={value || []} />;
};
