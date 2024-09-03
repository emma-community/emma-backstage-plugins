import { createPermission } from '@backstage/plugin-permission-common';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';
import { EMMA_PLUGIN_ID } from './constants';

// TODO: Migrate this to new permission architecture @ https://backstage.io/docs/permissions/getting-started/
/** @public */
export const emmaDataCenterReadPermission = createPermission({
  name: EMMA_PLUGIN_ID + '.api.datacenter.read',
  attributes: { action: 'read' },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/** @public */
export const emmaPermissions = [
    emmaDataCenterReadPermission
];