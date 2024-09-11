import { EmmaDataCenter, EmmaVmConfiguration, EmmaVm, GeoFence, EmmaComputeType, EmmaProvider } from '../types';

/** @public */
export interface EmmaApi {
  getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]>;
  getProviders(providerId?: number, providerName?: string): Promise<EmmaProvider[]>;
  getComputeConfigs(providerId?: number, locationId?: number, dataCenterId?: string, ...computeType: EmmaComputeType[]): Promise<EmmaVmConfiguration[]>;
  getComputeEntities(entityId?: number, ...computeType: EmmaComputeType[]): Promise<EmmaVm[]>;
  deleteComputeEntity(entityId: number, computeType: EmmaComputeType): Promise<void>;
}