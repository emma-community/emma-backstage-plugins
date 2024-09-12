import { EmmaDataCenter, EmmaVmConfiguration, EmmaVm, GeoFence, EmmaComputeType, EmmaProvider, EmmaLocation } from '../types';

/** @public */
export interface EmmaApi {
  getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]>;
  getProviders(providerId?: number, providerName?: string): Promise<EmmaProvider[]>;
  getLocations(locationId?: number, locationName?: string): Promise<EmmaLocation[]>;
  getComputeConfigs(providerId?: number, locationId?: number, dataCenterId?: string, ...computeType: EmmaComputeType[]): Promise<EmmaVmConfiguration[]>;
  getComputeEntities(entityId?: number, ...computeType: EmmaComputeType[]): Promise<EmmaVm[]>;
  deleteComputeEntity(entityId: number, computeType: EmmaComputeType): Promise<void>;
  addComputeEntity(entity: EmmaVm): Promise<number>;
  updateComputeEntity(entity: EmmaVm): Promise<void>;
}