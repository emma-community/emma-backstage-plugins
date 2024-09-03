import { VmConfiguration } from '@zaradarbh/emma-typescript-sdk';
import { EmmaDataCenter, GeoFence, EmmaComputeType } from '../types';

/**
 * @public
 */
export interface EmmaApi {
  getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]>;
  getComputeConfigs(...computeType: EmmaComputeType[]): Promise<VmConfiguration[]>;
}