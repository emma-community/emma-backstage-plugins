import { EmmaDataCenter, GeoFence } from '../types';

/**
 * @public
 */
export interface EmmaApi {
  getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]>;
}