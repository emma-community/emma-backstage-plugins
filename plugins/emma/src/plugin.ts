import {
  createPlugin,
  createRoutableExtension,
  createApiFactory,
  configApiRef,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { EmmaApiImpl } from './api/EmmaApiImpl';
import { emmaApiRef } from '@internal/backstage-plugin-emma-react';

export const emmaHeatmapPlugin = createPlugin({
  id: 'emma',
  apis: [
    createApiFactory({
      api: emmaApiRef,
      deps: { configApi: configApiRef },
      factory: ({configApi}) => {
        console.log(configApi)
        console.log(configApi.getOptionalString('emma.baseUrl'));
        console.log(configApi.getOptionalString('emma.apiKey'));

        return new EmmaApiImpl({ apiKey: '1234' });
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
