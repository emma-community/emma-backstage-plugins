import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { EmmaApiImpl } from './apis/EmmaApiImpl';
import { emmaApiRef } from '@internal/backstage-plugin-emma-react';

export const emmaHeatmapPlugin = createPlugin({
  id: 'emma-heatmap',
  apis: [
    createApiFactory({
      api: emmaApiRef,
      deps: {},
      factory: () =>
        new EmmaApiImpl({apiKey: '1234'}),
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
