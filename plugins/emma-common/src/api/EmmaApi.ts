import { createApiRef } from '@backstage/core-plugin-api';
import { EmmaDataCenter } from '../types';

/**
 * The API interface for the Emma-backend plugin.
 * @public
 */
export interface EmmaApi {
  getDataCenters(): Promise<EmmaDataCenter[]>;
}

/**
 * API Reference for {@link EmmaApi}.
 * @public
 */
export const emmaApiRef = createApiRef<EmmaApi>({
  id: 'plugin.emma.api',
});