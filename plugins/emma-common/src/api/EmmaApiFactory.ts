import { Authentication, ComputeInstancesConfigurationsApi, DataCentersApi, LocationsApi, KubernetesClustersApi, OperatingSystemsApi, SecurityGroupsApi, ProvidersApi, SpotInstancesApi, SSHKeysApi, StatisticsApi, SubnetworksApi, VirtualMachinesApi  } from '@zaradarbh/emma-typescript-sdk';

/** @public */
export class EmmaApiFactory {
  private readonly authHandler: Authentication;
  
  constructor(authHandler: Authentication) {
    this.authHandler = authHandler;
  }
  
  create<T>(ctor: new () => T): T {
    const api = new ctor();
    
    if (api instanceof DataCentersApi || api instanceof ComputeInstancesConfigurationsApi || api instanceof LocationsApi || api instanceof KubernetesClustersApi || api instanceof OperatingSystemsApi || api instanceof SecurityGroupsApi || api instanceof ProvidersApi || api instanceof SpotInstancesApi || api instanceof SSHKeysApi || api instanceof StatisticsApi || api instanceof SubnetworksApi || api instanceof VirtualMachinesApi) {
      api.setDefaultAuthentication(this.authHandler);
    }

    return api;
  }

  getAuthHandler(): Authentication {
    return this.authHandler;
  }
}