import fs from 'fs';
import path from 'path';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { EmmaApi, EmmaApiFactory, EmmaDataCenter, EmmaVmConfiguration, EmmaVm, EmmaSshKeyType, EmmaProvider, EmmaLocation, GeoFence, GeoLocation, EmmaComputeType, EMMA_CLIENT_ID_KEY, EMMA_CLIENT_SECRET_KEY, EmmaCPUType, EmmaSshKey } from '@emma-community/backstage-plugin-emma-common';
import { HttpBearerAuth, Token, DataCentersApi, AuthenticationApi, SSHKeysApi, SshKeysCreateImportRequest, ComputeInstancesConfigurationsApi, LocationsApi, VmConfiguration, Vm, SpotInstancesApi, KubernetesClustersApi, VirtualMachinesApi, ProvidersApi, VmCreate, KubernetesCreate } from '@emma-community/emma-typescript-sdk';

/** @public */
export class EmmaApiImpl implements EmmaApi {
  private readonly logger: LoggerService;
  private readonly config: Config;
  private readonly authHandler: HttpBearerAuth = new HttpBearerAuth();
  private readonly apiFactory: EmmaApiFactory;   
  // TODO: Remove synthetic data once External API is updated to return geo locations.
  private readonly knownGeoLocations: EmmaDataCenter[];

  private constructor(
    config: Config,
    logger: LoggerService
  ) {
    this.logger = logger;
    this.config = config;
    this.apiFactory = new EmmaApiFactory(this.authHandler);
    this.knownGeoLocations = this.loadKnownGeoLocations();

    this.issueToken().then((token) => {
      if(token.accessToken !== undefined) 
        this.authHandler.accessToken = token.accessToken;
    });
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
  
  private loadKnownGeoLocations(): EmmaDataCenter[] {
    // eslint-disable-next-line
    const filePath = path.resolve(__dirname, 'knownGeoLocations.json');
    const data = fs.readFileSync(filePath, 'utf-8');

    return JSON.parse(data);
  }

  private async issueToken(): Promise<Token> {
    const api = this.apiFactory.create(AuthenticationApi);
    const token = await api.issueToken({ clientId: this.config.getString(EMMA_CLIENT_ID_KEY), clientSecret: this.config.getString(EMMA_CLIENT_SECRET_KEY) });

    return token.body;
  }

  public async getDataCenters(geoFence?: GeoFence): Promise<EmmaDataCenter[]> 
  {
    const api = this.apiFactory.create(DataCentersApi);
          
    this.logger.info('Fetching data centers');

    let dataCenters = (await api.getDataCenters()).body as EmmaDataCenter[];

    dataCenters.forEach(dataCenter => {
        const matchedGeoLocation = this.knownGeoLocations.find(emmaDC => dataCenter.id?.indexOf(emmaDC.region_code) !== -1);

        if(matchedGeoLocation) {
          dataCenter.location = matchedGeoLocation.location;
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

  public async addSshKey(name: string, keyOrkeyType: EmmaSshKey | EmmaSshKeyType): Promise<number>
  {
    const api = this.apiFactory.create(SSHKeysApi);
    let sshKeyType: SshKeysCreateImportRequest.KeyTypeEnum;
    let sshKeyValue: string;

    this.logger.info('Adding ssh key');

    if((keyOrkeyType as EmmaSshKey).key !== undefined) {
      sshKeyValue = (keyOrkeyType as EmmaSshKey).key!;
      sshKeyType = this.parseEnum(SshKeysCreateImportRequest.KeyTypeEnum, (keyOrkeyType as EmmaSshKey).keyType!)!;
    } else {
      sshKeyValue = "";
      sshKeyType = this.parseEnum(SshKeysCreateImportRequest.KeyTypeEnum, keyOrkeyType as EmmaSshKeyType)!;
    }

    // TODO: Talk with George about possibility of ignoring an empty key input field in the SDK request body due to the fact that the choice element seems to confuse openapi-generator
    const sshKeyResult = (await api.sshKeysCreateImport({ name: name, key: sshKeyValue, keyType: sshKeyType })).body;

    this.logger.info('Returning ssh key id');

    return sshKeyResult.id!;
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
          
    this.logger.info('Fetching compute entities');

    if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.VirtualMachine) > -1) {
      const api = this.apiFactory.create(VirtualMachinesApi);
      const vmsResponse = entityId ? [(await api.getVm(entityId)).body] : (await api.getVms()).body ?? [];
      
      const emmaVms = vmsResponse.map((vm: Vm) => {        
        return {
          ...vm,
          type: EmmaComputeType.VirtualMachine,
          vCpuType: this.parseEnum(EmmaCPUType, vm.vCpuType!.toString())!,
          dataCenter: { ...vm.dataCenter, location: { latitude: 0, longitude: 0 }, region_code: vm.location?.region ?? 'unknown' }
        };
      });

      vms = vms.concat(emmaVms);
    }

    if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.SpotInstance) > -1) {
      const api = this.apiFactory.create(SpotInstancesApi);
      const vmsResponse = entityId ? [(await api.getSpot(entityId)).body] : (await api.getSpots()).body ?? [];
      
      const emmaVms = vmsResponse.map((vm: Vm) => {
        return {
          ...vm,
          type: EmmaComputeType.SpotInstance,
          vCpuType: this.parseEnum(EmmaCPUType, vm.vCpuType!.toString())!,
          dataCenter: { ...vm.dataCenter, location: { latitude: 0, longitude: 0 }, region_code: vm.location?.region ?? 'unknown' }
        };
      });

      vms = vms.concat(emmaVms);
    }

    if (computeType.length === 0 || computeType.indexOf(EmmaComputeType.KubernetesNode) > -1) {
      const api = this.apiFactory.create(KubernetesClustersApi);
      const vmsResponse = entityId ? [(await api.getKubernetesCluster(entityId)).body] : (await api.getKubernetesClusters()).body || [];

      const emmaVms = vmsResponse.flatMap(k8s =>
        k8s.nodeGroups?.flatMap(nodeGroup =>
          nodeGroup.nodes!.map(node => ({
            ...node,
            label: k8s.id!.toString(),
            type: EmmaComputeType.KubernetesNode,
            vCpuType: this.parseEnum(EmmaCPUType, node.vCpuType!.toString())!,
            dataCenter: { ...node.dataCenter, location: { latitude: 0, longitude: 0 }, region_code: node.location?.region ?? 'unknown' }
          }))
        ) || []
      );
  
      vms = vms.concat(emmaVms);
    }  

    this.logger.info('Returning compute entities');

    return vms;
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
 
  public async addComputeEntity(entity: EmmaVm): Promise<number> {
    this.logger.info(`Adding compute entity with id: ${entity.id} and type: ${entity.type}`);
    let input: any;

    switch(entity.type) {
      case EmmaComputeType.VirtualMachine:
          input = { 
          name: entity.name! ?? entity.label! ?? "unknown",
          cloudNetworkType: entity.cloudNetworkType?.toString() ?? "multi-cloud",
          dataCenterId: entity.dataCenter?.id!, 
          osId: entity.os?.id ?? 5,
          ramGb: entity.ramGb!,
          vCpu: entity.vCpu!,
          vCpuType: this.parseEnum(VmCreate.VCpuTypeEnum, entity.vCpuType!.toString())!,
          volumeGb: entity.disks![0].sizeGb!,
          volumeType: this.parseEnum(VmCreate.VolumeTypeEnum, entity.disks![0].type!)!,
          sshKeyId: entity.sshKeyId! };

          this.logger.info(`entity: ${JSON.stringify(entity)}`);
          this.logger.info(`vmCreate: ${JSON.stringify(input)}`);

        // TODO: Debug 422. Most likely the combination of ids are illigal
        await this.apiFactory.create(VirtualMachinesApi).vmCreate(input);
        break;
      case EmmaComputeType.SpotInstance:
        await this.apiFactory.create(SpotInstancesApi).spotCreate({ 
          name: entity.name!,
          cloudNetworkType: entity.cloudNetworkType?.toString(),
          dataCenterId: entity.dataCenter?.id!, 
          osId: entity.os?.id, 
          ramGb: entity.ramGb!,
          vCpu: entity.vCpu!,
          vCpuType: this.parseEnum(VmCreate.VCpuTypeEnum, entity.vCpuType!.toString())!,
          volumeGb: entity.disks![0].sizeGb!, 
          volumeType: this.parseEnum(VmCreate.VolumeTypeEnum, entity.disks![0].type!)!,
          price: entity.cost!.price!,
          sshKeyId: entity.sshKeyId! });
        break;
      case EmmaComputeType.KubernetesNode:
        await this.apiFactory.create(KubernetesClustersApi).createKubernetesCluster({ 
          name: entity.name!,
          deploymentLocation: KubernetesCreate.DeploymentLocationEnum.Eu,
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