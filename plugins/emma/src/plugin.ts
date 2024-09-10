import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  fetchApiRef
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { EmmaClient } from './api/EmmaClient';
import { EmmaApi, EMMA_PLUGIN_ID, EMMA_API_REF_ID } from '@emma-community/backstage-plugin-emma-common';

export const emmaApiRef = createApiRef<EmmaApi>({
  id: EMMA_API_REF_ID,
});

export const emmaHeatmapPlugin = createPlugin({
  id: EMMA_PLUGIN_ID,
  apis: [
    createApiFactory({
      api: emmaApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) => {
        return new EmmaClient({ discoveryApi, fetchApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const EmmaHeatmapPage = emmaHeatmapPlugin.provide(
  createRoutableExtension({
    name: 'EmmaHeatmapPage',
    component: () =>
      import('./components/HeatMapPageComponent').then(m => m.HeatMapPageComponent),
    mountPoint: rootRouteRef,
  }),
);

export const EmmaVmConfigurationManagementPage = emmaHeatmapPlugin.provide(
  createRoutableExtension({
    name: 'VmConfigurationManagementPage',
    component: () =>
      import('./components/VmConfigurationManagementPageComponent').then(m => m.VmConfigurationManagementPageComponent),
    mountPoint: rootRouteRef,
  }),
);