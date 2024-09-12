import { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { EmmaApi, EmmaDataCenter, GeoFence, EMMA_PLUGIN_ID, EmmaComputeType, EmmaVmConfiguration, EmmaVm, EmmaProvider, EmmaLocation } from '@emma-community/backstage-plugin-emma-common';

/** @public */
export class EmmaClient implements EmmaApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly identityApi: IdentityApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi; identityApi: IdentityApi; }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.identityApi = options.identityApi;
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

    return await this.send<EmmaDataCenter[]>(urlSegment);
  }

  public async getProviders(providerId?: number, providerName?: string): Promise<EmmaProvider[]> {
    const queryString = new URLSearchParams();

    if(providerId)
      queryString.append('providerId', providerId.toString());

    if(providerName)
      queryString.append('providerName', providerName);

    const urlSegment = `providers/?${queryString}`;

    return await this.send<EmmaProvider[]>(urlSegment);
  }

  public async getLocations(locationId?: number, locationName?: string): Promise<EmmaLocation[]> {
    const queryString = new URLSearchParams();

    if(locationId)
      queryString.append('locationId', locationId.toString());

    if(locationName)
      queryString.append('locationName', locationName);

    const urlSegment = `locations/?${queryString}`;

    return await this.send<EmmaLocation[]>(urlSegment);
  }

  public async getComputeConfigs(providerId?: number, locationId?: number, dataCenterId?: string, ...computeType: EmmaComputeType[]): Promise<EmmaVmConfiguration[]> {
    const queryString = new URLSearchParams();

    computeType.forEach(type => queryString.append('computeType', type));

    if(providerId)
      queryString.append('providerId', providerId.toString());

    if(locationId)
      queryString.append('locationId', locationId.toString());

    if(dataCenterId)
      queryString.append('dataCenterId', dataCenterId);

    const urlSegment = `compute/configs/?${queryString}`;

    return await this.send<EmmaVmConfiguration[]>(urlSegment);
  }

  public async getComputeEntities(entityId?: number, ...computeType: EmmaComputeType[]): Promise<EmmaVm[]> {
    const queryString = new URLSearchParams();

    computeType.forEach(type => queryString.append('computeType', type));

    if(entityId)
      queryString.append('entityId', entityId.toString());

    const urlSegment = `compute/entities/?${queryString}`;

    return await this.send<EmmaVm[]>(urlSegment);
  }

  public async deleteComputeEntity(entityId: number, computeType: EmmaComputeType): Promise<void> {
    const queryString = new URLSearchParams();

    queryString.append('computeType', computeType);

    await this.send(`compute/entities/${entityId}/delete/?${queryString}`);
  }

  public async addComputeEntity(entity: EmmaVm): Promise<number> {
    return await this.send<number>(`compute/entities/add/`, entity);
  }

  public async updateComputeEntity(entity: EmmaVm): Promise<void> {
    await this.send(`compute/entities/${entity.id}/update/`, entity);
  }

  private async send<T>(path: string, data?: any): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl(EMMA_PLUGIN_ID)}/`;
    const url = new URL(path, baseUrl);
    let requestInit: RequestInit = {};

    if(data) {
      const { token: idToken } = await this.identityApi.getCredentials();

      requestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
        },
        body: JSON.stringify(data)
      };
    }

    const response = await this.fetchApi.fetch(url.toString(), requestInit);

    if (!response.ok)
      throw await ResponseError.fromResponse(response);
    
    return response.json() as Promise<T>;
  }
}