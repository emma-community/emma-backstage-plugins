import { createRouteRef } from '@backstage/core-plugin-api';
import { EMMA_PLUGIN_ID } from '@emma-community/backstage-plugin-emma-common';

export const rootRouteRef = createRouteRef({
  id: EMMA_PLUGIN_ID,
});