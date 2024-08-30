import { Config } from '@backstage/config';
import { LoggerService  } from '@backstage/backend-plugin-api';
import { EmmaApi, EmmaDataCenter, GeoBounds, GeoLocation } from '@internal/backstage-plugin-emma-common';

/** @public */
export class EmmaApiImpl implements EmmaApi {
    private readonly logger: LoggerService;
    private readonly config: Config;
  
    private constructor(
      config: Config,
      logger: LoggerService
    ) {
      this.logger = logger;
      this.config = config;

      this.logger.info(this.config.get('emma'));
    }

    static fromConfig(
      config: Config,
      options: { logger: LoggerService },
    ) {
      return new EmmaApiImpl(
        config,
        options.logger
      );
    }

    public async getDataCenters(maxBounds?: GeoBounds): Promise<EmmaDataCenter[]> 
    {
        let results = [
            {
              "name": "East US",
              "address": "Virginia, USA",
              "country_code": "US",
              "region_code": "eastus",
              "location": {
                "longitude": -79.4209,
                "latitude": 37.4316,
                
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "East US 2",
              "address": "Virginia, USA",
              "country_code": "US",
              "region_code": "eastus2",
              "location": {
                "longitude": -78.6569,
                "latitude": 36.8529
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Central US",
              "address": "Iowa, USA",
              "country_code": "US",
              "region_code": "centralus",
              "location": {
                "longitude": -93.6091,
                "latitude": 41.5868
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "North Central US",
              "address": "Illinois, USA",
              "country_code": "US",
              "region_code": "northcentralus",
              "location": {
                "longitude": -89.3985,
                "latitude": 40.6331
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "South Central US",
              "address": "Texas, USA",
              "country_code": "US",
              "region_code": "southcentralus",
              "location": {
                "longitude": -98.4936,
                "latitude": 29.4241
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "West US",
              "address": "California, USA",
              "country_code": "US",
              "region_code": "westus",
              "location": {
                "longitude": -121.8947,
                "latitude": 37.3382
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "West US 2",
              "address": "Washington, USA",
              "country_code": "US",
              "region_code": "westus2",
              "location": {
                "longitude": -122.3321,
                "latitude": 47.6062
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Canada Central",
              "address": "Toronto, Ontario, Canada",
              "country_code": "CA",
              "region_code": "canadacentral",
              "location": {
                "longitude": -79.3832,
                "latitude": 43.6532
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Canada East",
              "address": "Quebec City, Quebec, Canada",
              "country_code": "CA",
              "region_code": "canadaeast",
              "location": {
                "longitude": -71.2074,
                "latitude": 46.8139
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Brazil South",
              "address": "São Paulo, Brazil",
              "country_code": "BR",
              "region_code": "brazilsouth",
              "location": {
                "longitude": -46.6333,
                "latitude": -23.5505
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "North Europe",
              "address": "Dublin, Ireland",
              "country_code": "IE",
              "region_code": "northeurope",
              "location": {
                "longitude": -6.2603,
                "latitude": 53.3498
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "West Europe",
              "address": "Amsterdam, Netherlands",
              "country_code": "NL",
              "region_code": "westeurope",
              "location": {
                "longitude": 4.9041,
                "latitude": 52.3676
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "UK South",
              "address": "London, England, UK",
              "country_code": "GB",
              "region_code": "uksouth",
              "location": {
                "longitude": -0.1276,
                "latitude": 51.5074
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "UK West",
              "address": "Cardiff, Wales, UK",
              "country_code": "GB",
              "region_code": "ukwest",
              "location": {
                "longitude": -3.1791,
                "latitude": 51.4816
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "France Central",
              "address": "Paris, France",
              "country_code": "FR",
              "region_code": "francecentral",
              "location": {
                "longitude": 2.3522,
                "latitude": 48.8566
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "France South",
              "address": "Marseille, France",
              "country_code": "FR",
              "region_code": "francesouth",
              "location": {
                "longitude": 5.3698,
                "latitude": 43.2965
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Germany Central",
              "address": "Frankfurt, Germany",
              "country_code": "DE",
              "region_code": "germanycentral",
              "location": {
                "longitude": 8.6821,
                "latitude": 50.1109
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Germany Northeast",
              "address": "Berlin, Germany",
              "country_code": "DE",
              "region_code": "germanynortheast",
              "location": {
                "longitude": 13.405,
                "latitude": 52.5200
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Norway East",
              "address": "Oslo, Norway",
              "country_code": "NO",
              "region_code": "norwayeast",
              "location": {
                "longitude": 10.7522,
                "latitude": 59.9139
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Norway West",
              "address": "Stavanger, Norway",
              "country_code": "NO",
              "region_code": "norwaywest",
              "location": {
                "longitude": 5.7331,
                "latitude": 58.969975
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Switzerland North",
              "address": "Zurich, Switzerland",
              "country_code": "CH",
              "region_code": "switzerlandnorth",
              "location": {
                "longitude": 8.5417,
                "latitude": 47.3769
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Switzerland West",
              "address": "Geneva, Switzerland",
              "country_code": "CH",
              "region_code": "switzerlandwest",
              "location": {
                "longitude": 6.1432,
                "latitude": 46.2044
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "UAE North",
              "address": "Dubai, United Arab Emirates",
              "country_code": "AE",
              "region_code": "uaenorth",
              "location": {
                "longitude": 55.2708,
                "latitude": 25.2048
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "UAE Central",
              "address": "Abu Dhabi, United Arab Emirates",
              "country_code": "AE",
              "region_code": "uaecentral",
              "location": {
                "longitude": 54.3773,
                "latitude": 24.4539
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "South Africa North",
              "address": "Johannesburg, South Africa",
              "country_code": "ZA",
              "region_code": "southafricanorth",
              "location": {
                "longitude": 28.0473,
                "latitude": -26.2041
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "South Africa West",
              "address": "Cape Town, South Africa",
              "country_code": "ZA",
              "region_code": "southafricawest",
              "location": {
                "longitude": 18.4241,
                "latitude": -33.9249
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "East Asia",
              "address": "Hong Kong",
              "country_code": "HK",
              "region_code": "eastasia",
              "location": {
                "longitude": 114.1694,
                "latitude": 22.3193
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Southeast Asia",
              "address": "Singapore",
              "country_code": "SG",
              "region_code": "southeastasia",
              "location": {
                "longitude": 103.8198,
                "latitude": 1.3521
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Japan East",
              "address": "Tokyo, Japan",
              "country_code": "JP",
              "region_code": "japaneast",
              "location": {
                "longitude": 139.6917,
                "latitude": 35.6895
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Japan West",
              "address": "Osaka, Japan",
              "country_code": "JP",
              "region_code": "japanwest",
              "location": {
                "longitude": 135.5022,
                "latitude": 34.6937
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Korea Central",
              "address": "Seoul, South Korea",
              "country_code": "KR",
              "region_code": "koreacentral",
              "location": {
                "longitude": 126.978,
                "latitude": 37.5665
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Korea South",
              "address": "Busan, South Korea",
              "country_code": "KR",
              "region_code": "koreasouth",
              "location": {
                "longitude": 129.0756,
                "latitude": 35.1796
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Australia East",
              "address": "Sydney, Australia",
              "country_code": "AU",
              "region_code": "australiaeast",
              "location": {
                "longitude": 151.2093,
                "latitude": -33.8688
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Australia Southeast",
              "address": "Melbourne, Australia",
              "country_code": "AU",
              "region_code": "australiasoutheast",
              "location": {
                "longitude": 144.9631,
                "latitude": -37.8136
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "Australia Central",
              "address": "Canberra, Australia",
              "country_code": "AU",
              "region_code": "australiacentral",
              "location": {
                "longitude": 149.1300,
                "latitude": -35.2809
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "India Central",
              "address": "Pune, India",
              "country_code": "IN",
              "region_code": "centralindia",
              "location": {
                "longitude": 73.8567,
                "latitude": 18.5204
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "India South",
              "address": "Chennai, India",
              "country_code": "IN",
              "region_code": "southindia",
              "location": {
                "longitude": 80.2707,
                "latitude": 13.0827
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "India West",
              "address": "Mumbai, India",
              "country_code": "IN",
              "region_code": "westindia",
              "location": {
                "longitude": 72.8777,
                "latitude": 19.076
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "China East",
              "address": "Shanghai, China",
              "country_code": "CN",
              "region_code": "chinaeast",
              "location": {
                "longitude": 121.4737,
                "latitude": 31.2304
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "China North",
              "address": "Beijing, China",
              "country_code": "CN",
              "region_code": "chinanorth",
              "location": {
                "longitude": 116.4074,
                "latitude": 39.9042
              },
              "provider": "AZURE",
              "price": 123*Math.random(),
              "intensity": 0.5,
              "radius": 0.5
            },
            {
              "name": "us-central1",
              "address": "Council Bluffs, Iowa, USA",
              "country_code": "US",
              "region_code": "us-central1",
              "location": {
                "longitude": -95.8608,
                "latitude": 41.2619
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "us-west1",
              "address": "The Dalles, Oregon, USA",
              "country_code": "US",
              "region_code": "us-west1",
              "location": {
                "longitude": -121.1796,
                "latitude": 45.5946
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "us-west2",
              "address": "Los Angeles, California, USA",
              "country_code": "US",
              "region_code": "us-west2",
              "location": {
                "longitude": -118.2437,
                "latitude": 34.0522
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "us-west3",
              "address": "Salt Lake City, Utah, USA",
              "country_code": "US",
              "region_code": "us-west3",
              "location": {
                "longitude": -111.8910,
                "latitude": 40.7608
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "us-west4",
              "address": "Las Vegas, Nevada, USA",
              "country_code": "US",
              "region_code": "us-west4",
              "location": {
                "longitude": -115.1398,
                "latitude": 36.1699
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "us-east1",
              "address": "Moncks Corner, South Carolina, USA",
              "country_code": "US",
              "region_code": "us-east1",
              "location": {
                "longitude": -79.9987,
                "latitude": 33.199
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "us-east4",
              "address": "Ashburn, Virginia, USA",
              "country_code": "US",
              "region_code": "us-east4",
              "location": {
                "longitude": -77.4875,
                "latitude": 39.0438
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "northamerica-northeast1",
              "address": "Montréal, Quebec, Canada",
              "country_code": "CA",
              "region_code": "northamerica-northeast1",
              "location": {
                "longitude": -73.5673,
                "latitude": 45.5017
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "southamerica-east1",
              "address": "São Paulo, Brazil",
              "country_code": "BR",
              "region_code": "southamerica-east1",
              "location": {
                "longitude": -46.6333,
                "latitude": -23.5505
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "europe-west1",
              "address": "St. Ghislain, Belgium",
              "country_code": "BE",
              "region_code": "europe-west1",
              "location": {
                "longitude": 3.8192,
                "latitude": 50.4543
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "europe-west2",
              "address": "London, England, UK",
              "country_code": "GB",
              "region_code": "europe-west2",
              "location": {
                "longitude": -0.1276,
                "latitude": 51.5074
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "europe-west3",
              "address": "Frankfurt, Germany",
              "country_code": "DE",
              "region_code": "europe-west3",
              "location": {
                "longitude": 8.6821,
                "latitude": 50.1109
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "europe-west4",
              "address": "Eemshaven, Netherlands",
              "country_code": "NL",
              "region_code": "europe-west4",
              "location": {
                "longitude": 6.8317,
                "latitude": 53.4273
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "europe-west6",
              "address": "Zurich, Switzerland",
              "country_code": "CH",
              "region_code": "europe-west6",
              "location": {
                "longitude": 8.5417,
                "latitude": 47.3769
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "europe-north1",
              "address": "Hamina, Finland",
              "country_code": "FI",
              "region_code": "europe-north1",
              "location": {
                "longitude": 27.1976,
                "latitude": 60.5693
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "europe-central2",
              "address": "Warsaw, Poland",
              "country_code": "PL",
              "region_code": "europe-central2",
              "location": {
                "longitude": 21.0122,
                "latitude": 52.2297
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-east1",
              "address": "Changhua County, Taiwan",
              "country_code": "TW",
              "region_code": "asia-east1",
              "location": {
                "longitude": 120.5327,
                "latitude": 23.9924
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-east2",
              "address": "Hong Kong",
              "country_code": "HK",
              "region_code": "asia-east2",
              "location": {
                "longitude": 114.1694,
                "latitude": 22.3193
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-northeast1",
              "address": "Tokyo, Japan",
              "country_code": "JP",
              "region_code": "asia-northeast1",
              "location": {
                "longitude": 139.6917,
                "latitude": 35.6895
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-northeast2",
              "address": "Osaka, Japan",
              "country_code": "JP",
              "region_code": "asia-northeast2",
              "location": {
                "longitude": 135.5022,
                "latitude": 34.6937
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-northeast3",
              "address": "Seoul, South Korea",
              "country_code": "KR",
              "region_code": "asia-northeast3",
              "location": {
                "longitude": 126.978,
                "latitude": 37.5665
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-south1",
              "address": "Mumbai, India",
              "country_code": "IN",
              "region_code": "asia-south1",
              "location": {
                "longitude": 72.8777,
                "latitude": 19.076
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-south2",
              "address": "Delhi, India",
              "country_code": "IN",
              "region_code": "asia-south2",
              "location": {
                "longitude": 77.1025,
                "latitude": 28.7041
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-southeast1",
              "address": "Jurong West, Singapore",
              "country_code": "SG",
              "region_code": "asia-southeast1",
              "location": {
                "longitude": 103.6959,
                "latitude": 1.3409
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "asia-southeast2",
              "address": "Jakarta, Indonesia",
              "country_code": "ID",
              "region_code": "asia-southeast2",
              "location": {
                "longitude": 106.8456,
                "latitude": -6.2088
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "australia-southeast1",
              "address": "Sydney, Australia",
              "country_code": "AU",
              "region_code": "australia-southeast1",
              "location": {
                "longitude": 151.2093,
                "latitude": -33.8688
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "australia-southeast2",
              "address": "Melbourne, Australia",
              "country_code": "AU",
              "region_code": "australia-southeast2",
              "location": {
                "longitude": 144.9631,
                "latitude": -37.8136
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "newzealand-north1",
              "address": "Auckland, New Zealand",
              "country_code": "NZ",
              "region_code": "newzealand-north1",
              "location": {
                "longitude": 174.7633,
                "latitude": -36.8485
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "me-west1",
              "address": "Tel Aviv, Israel",
              "country_code": "IL",
              "region_code": "me-west1",
              "location": {
                "longitude": 34.7818,
                "latitude": 32.0853
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "me-central1",
              "address": "Doha, Qatar",
              "country_code": "QA",
              "region_code": "me-central1",
              "location": {
                "longitude": 51.5310,
                "latitude": 25.2861
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "africa-south1",
              "address": "Johannesburg, South Africa",
              "country_code": "ZA",
              "region_code": "africa-south1",
              "location": {
                "longitude": 28.0473,
                "latitude": -26.2041
              },
              "provider": "GCP",
              "price": 321*Math.random(),
              "intensity": 1,
              "radius": 1
            },
            {
              "name": "US East (N. Virginia)",
              "address": "Ashburn, Virginia, USA",
              "country_code": "US",
              "region_code": "us-east-1",
              "location": {
                "longitude": -77.4875,
                "latitude": 39.0438
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "US East (Ohio)",
              "address": "Columbus, Ohio, USA",
              "country_code": "US",
              "region_code": "us-east-2",
              "location": {
                "longitude": -82.9988,
                "latitude": 39.9612
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "US West (N. California)",
              "address": "San Francisco, California, USA",
              "country_code": "US",
              "region_code": "us-west-1",
              "location": {
                "longitude": -122.4194,
                "latitude": 37.7749
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "US West (Oregon)",
              "address": "Boardman, Oregon, USA",
              "country_code": "US",
              "region_code": "us-west-2",
              "location": {
                "longitude": -119.692,
                "latitude": 45.8399
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Canada (Central)",
              "address": "Montreal, Quebec, Canada",
              "country_code": "CA",
              "region_code": "ca-central-1",
              "location": {
                "longitude": -73.5673,
                "latitude": 45.5017
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "South America (São Paulo)",
              "address": "São Paulo, Brazil",
              "country_code": "BR",
              "region_code": "sa-east-1",
              "location": {
                "longitude": -46.6333,
                "latitude": -23.5505
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Europe (Ireland)",
              "address": "Dublin, Ireland",
              "country_code": "IE",
              "region_code": "eu-west-1",
              "location": {
                "longitude": -6.2603,
                "latitude": 53.3498
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Europe (London)",
              "address": "London, England, UK",
              "country_code": "GB",
              "region_code": "eu-west-2",
              "location": {
                "longitude": -0.1276,
                "latitude": 51.5074
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Europe (Paris)",
              "address": "Paris, France",
              "country_code": "FR",
              "region_code": "eu-west-3",
              "location": {
                "longitude": 2.3522,
                "latitude": 48.8566
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Europe (Frankfurt)",
              "address": "Frankfurt, Germany",
              "country_code": "DE",
              "region_code": "eu-central-1",
              "location": {
                "longitude": 8.6821,
                "latitude": 50.1109
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Europe (Milan)",
              "address": "Milan, Italy",
              "country_code": "IT",
              "region_code": "eu-south-1",
              "location": {
                "longitude": 9.1895,
                "latitude": 45.4642
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Europe (Stockholm)",
              "address": "Stockholm, Sweden",
              "country_code": "SE",
              "region_code": "eu-north-1",
              "location": {
                "longitude": 18.0686,
                "latitude": 59.3293
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Middle East (Bahrain)",
              "address": "Manama, Bahrain",
              "country_code": "BH",
              "region_code": "me-south-1",
              "location": {
                "longitude": 50.5832,
                "latitude": 26.2285
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Africa (Cape Town)",
              "address": "Cape Town, South Africa",
              "country_code": "ZA",
              "region_code": "af-south-1",
              "location": {
                "longitude": 18.4241,
                "latitude": -33.9249
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Asia Pacific (Mumbai)",
              "address": "Mumbai, India",
              "country_code": "IN",
              "region_code": "ap-south-1",
              "location": {
                "longitude": 72.8777,
                "latitude": 19.076
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Asia Pacific (Hong Kong)",
              "address": "Hong Kong",
              "country_code": "HK",
              "region_code": "ap-east-1",
              "location": {
                "longitude": 114.1694,
                "latitude": 22.3193
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Asia Pacific (Osaka)",
              "address": "Osaka, Japan",
              "country_code": "JP",
              "region_code": "ap-northeast-3",
              "location": {
                "longitude": 135.5022,
                "latitude": 34.6937
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Asia Pacific (Seoul)",
              "address": "Seoul, South Korea",
              "country_code": "KR",
              "region_code": "ap-northeast-2",
              "location": {
                "longitude": 126.978,
                "latitude": 37.5665
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Asia Pacific (Singapore)",
              "address": "Singapore",
              "country_code": "SG",
              "region_code": "ap-southeast-1",
              "location": {
                "longitude": 103.8198,
                "latitude": 1.3521
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Asia Pacific (Sydney)",
              "address": "Sydney, Australia",
              "country_code": "AU",
              "region_code": "ap-southeast-2",
              "location": {
                "longitude": 151.2093,
                "latitude": -33.8688
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "Asia Pacific (Tokyo)",
              "address": "Tokyo, Japan",
              "country_code": "JP",
              "region_code": "ap-northeast-1",
              "location": {
                "longitude": 139.6917,
                "latitude": 35.6895
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "China (Beijing)",
              "address": "Beijing, China",
              "country_code": "CN",
              "region_code": "cn-north-1",
              "location": {
                "longitude": 116.4074,
                "latitude": 39.9042
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            },
            {
              "name": "China (Ningxia)",
              "address": "Ningxia, China",
              "country_code": "CN",
              "region_code": "cn-northwest-1",
              "location": {
                "longitude": 106.2587,
                "latitude": 37.5097
              },
              "provider": "AWS",
              "price": 222*Math.random(),
              "intensity": 2,
              "radius": 2
            }];

        if(maxBounds)
            results = results.filter(result => this.isWithinBounds(result.location, maxBounds));

        return results;
    }

    private isWithinBounds(location: GeoLocation, bounds: GeoBounds): boolean {
        return bounds.bottomLeft.latitude <= location.latitude && 
                location.latitude <= bounds.topRight.latitude && 
                bounds.bottomLeft.longitude <= location.longitude && 
                location.longitude <= bounds.topRight.longitude;
    }
}