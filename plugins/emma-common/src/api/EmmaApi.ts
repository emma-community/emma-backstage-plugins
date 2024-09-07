import { VmConfiguration } from '@emma-community/emma-typescript-sdk';
import { EmmaDataCenter, GeoFence, EmmaComputeType } from '../types';

/** @public */
export interface EmmaApi {
  getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]>;
  getComputeConfigs(providerId?: number, locationId?: number, dataCenterId?: string, ...computeType: EmmaComputeType[]): Promise<VmConfiguration[]>;
}