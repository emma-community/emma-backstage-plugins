import { EmmaDataCenter, EmmaVmConfiguration, EmmaVm, GeoFence, EmmaComputeType, EmmaProvider, EmmaLocation, EmmaSshKey, EmmaSshKeyType, EmmaVmOs } from '../types';

/** @public */
export interface EmmaApi {
  getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]>;
  getProviders(providerId?: number, providerName?: string): Promise<EmmaProvider[]>;
  getLocations(locationId?: number, locationName?: string): Promise<EmmaLocation[]>;
  getComputeConfigs(providerId?: number, locationId?: number, dataCenterId?: string, ...computeType: EmmaComputeType[]): Promise<EmmaVmConfiguration[]>;
  getComputeEntities(entityId?: number, ...computeType: EmmaComputeType[]): Promise<EmmaVm[]>;
  getOperatingSystems(type?: string, architecture?: string, version?: string): Promise<EmmaVmOs[]>;
  getSshKeys(sshKeyId?: number): Promise<EmmaSshKey[]>;
  addSshKey(name: string, keyOrkeyType: EmmaSshKey | EmmaSshKeyType): Promise<EmmaSshKey>;
  deleteComputeEntity(entityId: number, computeType: EmmaComputeType): Promise<void>;
  addComputeEntity(entity: EmmaVm): Promise<number>;
  updateComputeEntity(entity: EmmaVm): Promise<void>;
}