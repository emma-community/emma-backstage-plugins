import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { EmmaApi, EmmaDataCenter, GeoFence, EMMA_PLUGIN_ID, EmmaComputeType, EmmaVmConfiguration, EmmaVm, EmmaProvider, EmmaLocation } from '@emma-community/backstage-plugin-emma-common';

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

  public async getProviders(providerId?: number, providerName?: string): Promise<EmmaProvider[]> {
    const queryString = new URLSearchParams();

    if(providerId)
      queryString.append('providerId', providerId.toString());

    if(providerName)
      queryString.append('providerName', providerName);

    const urlSegment = `providers/?${queryString}`;

    return await this.get<EmmaProvider[]>(urlSegment);
  }

  public async getLocations(locationId?: number, locationName?: string): Promise<EmmaLocation[]> {
    const queryString = new URLSearchParams();

    if(locationId)
      queryString.append('locationId', locationId.toString());

    if(locationName)
      queryString.append('locationName', locationName);

    const urlSegment = `locations/?${queryString}`;

    return await this.get<EmmaLocation[]>(urlSegment);
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

    return await this.get<EmmaVmConfiguration[]>(urlSegment);
  }

  public async getComputeEntities(entityId?: number, ...computeType: EmmaComputeType[]): Promise<EmmaVm[]> {
    const queryString = new URLSearchParams();

    computeType.forEach(type => queryString.append('computeType', type));

    if(entityId)
      queryString.append('entityId', entityId.toString());

    const urlSegment = `compute/entities/?${queryString}`;

    return await this.get<EmmaVm[]>(urlSegment);
  }

  public async deleteComputeEntity(entityId: number, computeType: EmmaComputeType): Promise<void> {
    await this.get(`compute/entities/${entityId}/delete/?computeType=${computeType}`);
  }

  public async addComputeEntity(entity: EmmaVm): Promise<void> {
    // TODO: Debug JSON serialization
    await this.get(`compute/entities/add/?entity=${JSON.stringify(entity)}`);
  }

  public async updateComputeEntity(entity: EmmaVm): Promise<void> {
    // TODO: Debug JSON serialization
    await this.get(`compute/entities/update/?entity=${JSON.stringify(entity)}`);
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