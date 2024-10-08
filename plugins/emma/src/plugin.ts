import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  identityApiRef,
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
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, fetchApi, identityApi }) => {
        return new EmmaClient({ discoveryApi, fetchApi, identityApi });
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

export const EmmaComputePage = emmaHeatmapPlugin.provide(
  createRoutableExtension({
    name: 'EmmaComputePage',
    component: () =>
      import('./components/ComputePageComponent').then(m => m.ComputePageComponent),
    mountPoint: rootRouteRef,
  }),
);