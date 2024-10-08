import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { EmmaApi, EmmaApiFactory, EmmaDataCenter, EmmaNetworkType, EmmaVmConfiguration, EmmaVm, EmmaSshKeyType, EmmaVmOs, EmmaProvider, EmmaLocation, GeoFence, GeoLocation, EmmaComputeType, EMMA_CLIENT_ID_KEY, EMMA_CLIENT_SECRET_KEY, EmmaCPUType, EmmaSshKey } from '@emma-community/backstage-plugin-emma-common';
import { HttpBearerAuth, Token, DataCentersApi, AuthenticationApi, SSHKeysApi, SshKeysCreateImportRequest, OperatingSystemsApi, ComputeInstancesConfigurationsApi, LocationsApi, VmConfiguration, Vm, SpotInstancesApi, KubernetesClustersApi, VirtualMachinesApi, ProvidersApi, VmCreate, KubernetesCreate } from '@emma-community/emma-typescript-sdk';

/** @public */
export class EmmaApiImpl implements EmmaApi {
  private readonly logger: LoggerService;
  private readonly config: Config;
  private readonly authHandler: HttpBearerAuth = new HttpBearerAuth();
  private readonly apiFactory: EmmaApiFactory;

  private constructor(
    config: Config,
    logger: LoggerService
  ) {
    this.logger = logger;
    this.config = config;
    this.apiFactory = new EmmaApiFactory(this.authHandler);

    this.refreshToken();
  }

  static fromConfig(
    config: Config,
    options: { logger: LoggerService },
  ) {
    return new EmmaApiImpl(
      config,
      options.logger
    );
  }

  private async issueToken(): Promise<Token> {
    const api = this.apiFactory.create(AuthenticationApi);
    const token = await api.issueToken({ clientId: this.config.getString(EMMA_CLIENT_ID_KEY), clientSecret: this.config.getString(EMMA_CLIENT_SECRET_KEY) });

    return token.body;
  }

  private refreshToken(){
    this.issueToken().then((token) => {      
      if(token.accessToken !== undefined) 
        this.authHandler.accessToken = token.accessToken;

      setTimeout(() => { this.refreshToken(); }, (token.expiresIn! - 25) * 1000);
    });
  }

  public async getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]> 
  {
    const api = this.apiFactory.create(DataCentersApi);
          
    this.logger.info('Fetching data centers');

    let dataCenters = (await api.getDataCenters()).body as EmmaDataCenter[];
    const locations = await this.getLocations();

    dataCenters.forEach(dataCenter => {
        const matchedGeoLocation = locations.find(location => dataCenter.locationId === location.id);

        if(matchedGeoLocation) {
          dataCenter.location = { latitude: matchedGeoLocation.latitude!, longitude: matchedGeoLocation.longitude! };
        } else {
          dataCenter.location = { latitude: 0, longitude: 0 };
        }
    });

    if(geoFence) {        
      this.logger.info('Filtering data centers based on bounds', geoFence);

      dataCenters = dataCenters.filter(dataCenter => this.isWithinBounds(dataCenter.location, geoFence));
    }

    this.logger.info('Returning data centers');

    return dataCenters;
  }
  
  public async getProviders(providerId?: number, providerName?: string): Promise<EmmaProvider[]>
  {
    const api = this.apiFactory.create(ProvidersApi);
          
    this.logger.info('Fetching providers');

    let providers: EmmaProvider[] = [];

    if(providerId) {
      providers.push((await api.getProvider(providerId)).body);
    } 
    
    if(providerName || !providerId) {
      providers = providers.concat((await api.getProviders(providerName)).body);
    }

    this.logger.info('Returning providers');

    return providers;
  }

  public async getLocations(locationId?: number, locationName?: string): Promise<EmmaLocation[]>
  {
    const api = this.apiFactory.create(LocationsApi);
          
    this.logger.info('Fetching locations');

    let locations: EmmaLocation[] = [];

    if(locationId) {
      locations.push((await api.getLocation(locationId)).body);
    } 
    
    if(locationName || !locationId) {
      locations = locations.concat((await api.getLocations(locationName)).body);
    }

    this.logger.info('Returning locations');

    return locations;
  }

  public async getOperatingSystems(type?: string, architecture?: string, version?: string): Promise<EmmaVmOs[]>
  {
    const api = this.apiFactory.create(OperatingSystemsApi);
          
    this.logger.info('Fetching operating systems');

    let operatingSystems: EmmaVmOs[] = [];

    operatingSystems = (await api.getOperatingSystems(type, architecture, version)).body.map(os => { return os });

    this.logger.info('Returning operating systems');

    return operatingSystems;
  }

  public async getSshKeys(sshKeyId?: number): Promise<EmmaSshKey[]>
  {
    const api = this.apiFactory.create(SSHKeysApi);
          
    this.logger.info('Fetching ssh keys');

    const keys = (sshKeyId) ? [(await api.getSshKey(sshKeyId)).body] : (await api.sshKeys()).body;
    const result = keys.map(key => {
      return {
        ...key,
        type: this.parseEnum(EmmaSshKeyType, key.keyType!)!
      }
    });

    this.logger.info('Returning ssh keys');

    return result;
  }

  public async addSshKey(name: string, keyOrkeyType: EmmaSshKey | EmmaSshKeyType): Promise<EmmaSshKey>
  {
    const api = this.apiFactory.create(SSHKeysApi);
    let sshKeyType: EmmaSshKeyType;
    let sshKeyValue: string;

    this.logger.info('Adding ssh key');

    if((keyOrkeyType as EmmaSshKey)?.key !== undefined) {
      sshKeyValue = (keyOrkeyType as EmmaSshKey).key!;
      sshKeyType = this.parseEnum(EmmaSshKeyType, (keyOrkeyType as EmmaSshKey).keyType!)!;
    } else {
      sshKeyValue = "";
      sshKeyType = this.parseEnum(EmmaSshKeyType, (keyOrkeyType as EmmaSshKeyType))!;
    }   

    const sshKeyResult = {...(await api.sshKeysCreateImport({ name: name, key: sshKeyValue, keyType: this.parseEnum(SshKeysCreateImportRequest.KeyTypeEnum, sshKeyType.toString().toUpperCase())! })).body, type: sshKeyType };

    this.logger.info('Added ssh key');

    return sshKeyResult;
  }
  
  public async getComputeConfigs(providerId?: number, locationId?: number, dataCenterId?: string, ...computeType: EmmaComputeType[]): Promise<EmmaVmConfiguration[]> {
      const api = this.apiFactory.create(ComputeInstancesConfigurationsApi);
      let vmConfigs: EmmaVmConfiguration[] = [];
          
      this.logger.info('Fetching compute configs');
      
      if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.VirtualMachine) > -1) {
        const vmConfigsResponse = (await api.getVmConfigs(providerId, locationId, dataCenterId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 10000)).body.content ?? [];
        
        const emmaVmConfigs = vmConfigsResponse.map((vmConfig: VmConfiguration) => {
            const emmaVmConfig: EmmaVmConfiguration = {
                ...vmConfig,
                type: EmmaComputeType.VirtualMachine
            };

            return emmaVmConfig;
        });
    
        vmConfigs = vmConfigs.concat(emmaVmConfigs);
      }
    
      if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.SpotInstance) > -1) {
        const vmConfigsResponse = (await api.getSpotConfigs(providerId, locationId, dataCenterId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 10000)).body.content ?? [];
        
        const emmaVmConfigs = vmConfigsResponse.map((vmConfig: VmConfiguration) => {
            const emmaVmConfig: EmmaVmConfiguration = {
                ...vmConfig,
                type: EmmaComputeType.SpotInstance
            };

            return emmaVmConfig;
        });
    
        vmConfigs = vmConfigs.concat(emmaVmConfigs);
      }
    
      if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.KubernetesNode) > -1) {
        const vmConfigsResponse = (await api.getKuberNodesConfigs(providerId, locationId, dataCenterId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 10000)).body.content ?? [];
        
        const emmaVmConfigs = vmConfigsResponse.map((vmConfig: VmConfiguration) => {
            const emmaVmConfig: EmmaVmConfiguration = {
                ...vmConfig,
                type: EmmaComputeType.KubernetesNode
            };

            return emmaVmConfig;
        });
    
        vmConfigs = vmConfigs.concat(emmaVmConfigs);
      }
      
      this.logger.info('Returning compute configs');

      return vmConfigs;
  }
  
  public async getComputeEntities(entityId?: number, ...computeType: EmmaComputeType[]): Promise<EmmaVm[]> {
    let vms: EmmaVm[] = [];
    const locations = await this.getLocations();
          
    this.logger.info('Fetching compute entities');

    if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.VirtualMachine) > -1) {
      const api = this.apiFactory.create(VirtualMachinesApi);
      const vmsResponse = entityId ? [(await api.getVm(entityId)).body] : (await api.getVms()).body ?? [];
      
      const emmaVms = vmsResponse.map((vm: Vm) => {      
        const location = locations.find(loc => vm.dataCenter?.locationId === loc.id);

        return {
          ...vm,
          type: EmmaComputeType.VirtualMachine,
          label: vm.name,
          vCpuType: this.parseEnum(EmmaCPUType, vm.vCpuType!.toString())!,
          dataCenter: { ...vm.dataCenter, location: { latitude: location?.latitude! ?? 0, longitude: location?.longitude! ?? 0 } },
          cloudNetworkType: this.parseEnum(EmmaNetworkType, vm.cloudNetworkType!.toString())!,
          status: vm.status?.toString()
        };
      });

      vms = vms.concat(emmaVms);
    }

    if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.SpotInstance) > -1) {
      const api = this.apiFactory.create(SpotInstancesApi);
      const vmsResponse = entityId ? [(await api.getSpot(entityId)).body] : (await api.getSpots()).body ?? [];
      
      const emmaVms = vmsResponse.map((vm: Vm) => {
        const location = locations.find(loc => vm.dataCenter?.locationId === loc.id);

        return {
          ...vm,
          type: EmmaComputeType.SpotInstance,
          label: vm.name,
          vCpuType: this.parseEnum(EmmaCPUType, vm.vCpuType!.toString())!,
          dataCenter: { ...vm.dataCenter, location: { latitude: location?.latitude! ?? 0, longitude: location?.longitude! ?? 0 } },
          cloudNetworkType: this.parseEnum(EmmaNetworkType, vm.cloudNetworkType!.toString())!,
          status: vm.status?.toString()
        };
      });

      vms = vms.concat(emmaVms);
    }

    if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.KubernetesNode) > -1) {
      const api = this.apiFactory.create(KubernetesClustersApi);
      const vmsResponse = entityId ? [(await api.getKubernetesCluster(entityId)).body] : (await api.getKubernetesClusters()).body || [];

      const emmaVms = vmsResponse.flatMap(k8s =>
        k8s.nodeGroups?.flatMap(nodeGroup =>
          nodeGroup.nodes!.map(node => {
            const location = locations.find(loc => node.dataCenter?.locationId === loc.id);
            
            return ({
              ...node,
              label: node.name,
              type: EmmaComputeType.KubernetesNode,
              status: node.status?.toString(),
              vCpuType: this.parseEnum(EmmaCPUType, node.vCpuType!.toString())!,
              dataCenter: { ...node.dataCenter, location: { latitude: location?.latitude! ?? 0, longitude: location?.longitude! ?? 0 } },            
              cloudNetworkType: this.parseEnum(EmmaNetworkType, node.cloudNetworkType!.toString())!,
              clusterId: k8s.id,
              clusterStatus: k8s.status,
            })
          })
        ) || []
      );
  
      vms = vms.concat(emmaVms);
    }  

    this.logger.info('Returning compute entities');

    return vms;
  }
 
  public async addComputeEntity(entity: EmmaVm): Promise<number> {
    this.logger.info(`Adding compute entity with type: ${entity.type}`);
    
    switch(entity.type) {
      case EmmaComputeType.VirtualMachine:
        await this.apiFactory.create(VirtualMachinesApi).vmCreate({ 
          name: entity.name! ?? entity.label! ?? "default-vm-1",
          cloudNetworkType: this.parseEnum(VmCreate.CloudNetworkTypeEnum, entity.cloudNetworkType?.toString()!)!,
          dataCenterId: entity.dataCenter?.id!, 
          osId: entity.os?.id!,
          ramGb: entity.ramGb!,
          vCpu: entity.vCpu!,
          vCpuType: this.parseEnum(VmCreate.VCpuTypeEnum, entity.vCpuType!.toString())!,
          volumeGb: entity.disks![0].sizeGb!,
          volumeType: this.parseEnum(VmCreate.VolumeTypeEnum, entity.disks![0].type!)!,
          sshKeyId: entity.sshKeyId! });
        break;
      case EmmaComputeType.SpotInstance:
        await this.apiFactory.create(SpotInstancesApi).spotCreate({ 
          name: entity.name! ?? entity.label! ?? "default-spot-1",
          cloudNetworkType: this.parseEnum(VmCreate.CloudNetworkTypeEnum, entity.cloudNetworkType?.toString()!)!,
          dataCenterId: entity.dataCenter?.id!, 
          osId: entity.os?.id!, 
          ramGb: entity.ramGb!,
          vCpu: entity.vCpu!,
          vCpuType: this.parseEnum(VmCreate.VCpuTypeEnum, entity.vCpuType!.toString())!,
          volumeGb: entity.disks![0].sizeGb!, 
          volumeType: this.parseEnum(VmCreate.VolumeTypeEnum, entity.disks![0].type!)!,
          price: entity.cost?.price! ?? 0.002635,
          sshKeyId: entity.sshKeyId! });
        break;
      case EmmaComputeType.KubernetesNode:
        await this.apiFactory.create(KubernetesClustersApi).createKubernetesCluster({ 
          name: entity.name! ?? entity.label! ?? "default-k8s-managed-cluster-name",
          deploymentLocation: KubernetesCreate.DeploymentLocationEnum.Eu,
          workerNodes: [{ 
            name: entity.name! ?? entity.label! ?? "default-node-1",
            dataCenterId: entity.dataCenter?.id!,
            ramGb: entity.ramGb!,
            vCpu: entity.vCpu!,
            vCpuType: this.parseEnum(VmCreate.VCpuTypeEnum, entity.vCpuType!.toString())!,
            volumeGb: entity.disks![0].sizeGb!, 
            volumeType: this.parseEnum(VmCreate.VolumeTypeEnum, entity.disks![0].type!)!
          }]
        });

        break;
      default:
        throw new Error(`Unsupported compute type: ${entity.type}`);
    }
    
    this.logger.info('Added compute entity');

    return entity.id!;
  }

  public async updateComputeEntity(entity: EmmaVm): Promise<void> {
    this.logger.info(`Updating compute entity with id: ${entity.id} and type: ${entity.type}`);

    switch(entity.type) {
      case EmmaComputeType.KubernetesNode:
        await this.apiFactory.create(KubernetesClustersApi).editKubernetesCluster(Number(entity.label!), { 
          workerNodes: [
            { 
              name: entity.name!,
              dataCenterId: entity.dataCenter?.id!, 
              ramGb: entity.ramGb!,
              vCpu: entity.vCpu!,
              vCpuType: this.parseEnum(VmCreate.VCpuTypeEnum, entity.vCpuType!.toString())!,
              volumeGb: entity.disks![0].sizeGb!, 
              volumeType: this.parseEnum(VmCreate.VolumeTypeEnum, entity.disks![0].type!)!
            }
          ]});
        break;
      default:
        throw new Error(`Unsupported compute type: ${entity.type}`);
    }

    this.logger.info('Updated compute entity');
  }
 
  public async deleteComputeEntity(entityId: number, computeType: EmmaComputeType): Promise<void> {
    this.logger.info(`Deleting compute entity with id: ${entityId} and type: ${computeType}`);

    switch(computeType) {
      case EmmaComputeType.VirtualMachine:
        await this.apiFactory.create(VirtualMachinesApi).vmDelete(entityId);
        break;
      case EmmaComputeType.SpotInstance:
        await this.apiFactory.create(SpotInstancesApi).spotDelete(entityId);
        break;
      case EmmaComputeType.KubernetesNode:
        await this.apiFactory.create(KubernetesClustersApi).deleteKubernetesCluster(entityId);
        break;
      default:
        throw new Error(`Unsupported compute type: ${computeType}`);
    }

    this.logger.info('Deleted compute entity');
  }

  private isWithinBounds(location: GeoLocation, geoFence: GeoFence): boolean {
      return geoFence.bottomLeft.latitude <= location.latitude && 
              location.latitude <= geoFence.topRight.latitude && 
              geoFence.bottomLeft.longitude <= location.longitude && 
              location.longitude <= geoFence.topRight.longitude;
  } 

  private parseEnum<T>(enumObj: T, value: string): T[keyof T] | undefined {
    if (enumObj && Object.values(enumObj).includes(value as T[keyof T])) {
      return value as T[keyof T];
    }

    return undefined;
  }
}