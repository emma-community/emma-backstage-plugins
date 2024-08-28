import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { EmmaClient } from './api/EmmaClient';
import { emmaApiRef } from '@internal/backstage-plugin-emma-react';

export const emmaHeatmapPlugin = createPlugin({
  id: 'emma',
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
