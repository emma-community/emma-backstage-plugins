import { EmmaDataCenter, GeoBounds } from '../types';

/**
 * The API interface for the Emma-backend plugin.
 * @public
 */
export interface EmmaApi {
  getDataCenters(maxBounds?: GeoBounds): Promise<EmmaDataCenter[]>;
}