import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const emmaHeatmapPlugin = createPlugin({
  id: 'emma-heatmap',
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
