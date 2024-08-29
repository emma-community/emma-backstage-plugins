import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { EmmaApi, EmmaDataCenter, GeoBounds, EMMA_PLUGIN_ID } from '@internal/backstage-plugin-emma-common';
import { ResponseError } from '@backstage/errors';

/** @public */
export class EmmaClient implements EmmaApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi; }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }
  
  async getDataCenters(maxBounds?: GeoBounds): Promise<EmmaDataCenter[]> {
    const queryString = new URLSearchParams();

    if (maxBounds) {
      queryString.append('latMax', maxBounds.topRight.latitude.toString());
      queryString.append('lonMax', maxBounds.topRight.longitude.toString());
      queryString.append('latMin', maxBounds.bottomLeft.latitude.toString());
      queryString.append('lonMin', maxBounds.bottomLeft.longitude.toString());
    }
    
    const urlSegment = `datacenters/?${queryString}`;

    return await this.get<EmmaDataCenter[]>(urlSegment);
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