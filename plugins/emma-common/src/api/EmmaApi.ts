import { createApiRef } from '@backstage/core-plugin-api';

/**
 * The API interface for the Emma-backend plugin.
 * @public
 */
export interface EmmaApi {
  getDataCenters(): Promise<any>;
}

/**
 * API Reference for {@link EmmaApi}.
 * @public
 */
export const emmaApiRef = createApiRef<EmmaApi>({
  id: 'plugin.emma.api',
});