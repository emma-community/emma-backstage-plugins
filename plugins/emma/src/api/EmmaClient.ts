import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { EmmaApi, EmmaDataCenter, GeoFence, EMMA_PLUGIN_ID, EmmaComputeType } from '@internal/backstage-plugin-emma-common';
import { VmConfiguration } from '@zaradarbh/emma-typescript-sdk';
import { ResponseError } from '@backstage/errors';

/** @public */
export class EmmaClient implements EmmaApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi; }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }
  
  public async getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]> {
    const queryString = new URLSearchParams();

    if (geoFence) {
      queryString.append('latMax', geoFence.topRight.latitude.toString());
      queryString.append('lonMax', geoFence.topRight.longitude.toString());
      queryString.append('latMin', geoFence.bottomLeft.latitude.toString());
      queryString.append('lonMin', geoFence.bottomLeft.longitude.toString());
    }
    
    const urlSegment = `datacenters/?${queryString}`;

    return await this.get<EmmaDataCenter[]>(urlSegment);
  }

  public async getComputeConfigs(...computeType: EmmaComputeType[]): Promise<VmConfiguration[]> {
    const queryString = new URLSearchParams();

    computeType.forEach(type => queryString.append('computeType', type));

    const urlSegment = `computeconfigs/?${queryString}`;

    return await this.get<VmConfiguration[]>(urlSegment);

  }

  private async get<T>(path: string): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl(EMMA_PLUGIN_ID)}/`;
    const url = new URL(path, baseUrl);

    const response = await this.fetchApi.fetch(url.toString());

    if (!response.ok)
      throw await ResponseError.fromResponse(response);
    
    return response.json() as Promise<T>;
  }
}