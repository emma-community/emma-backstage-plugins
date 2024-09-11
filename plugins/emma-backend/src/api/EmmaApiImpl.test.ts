import fs from 'fs';
import path from 'path';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { HttpBearerAuth, DataCentersApi, AuthenticationApi, ComputeInstancesConfigurationsApi, VirtualMachinesApi, SpotInstancesApi, KubernetesClustersApi, LocationsApi, ProvidersApi, Vm } from '@emma-community/emma-typescript-sdk';
import { EmmaApiFactory, EmmaComputeType, EmmaVolumeType, EmmaCPUType } from '@emma-community/backstage-plugin-emma-common';
import { EmmaApiImpl } from './EmmaApiImpl';

jest.mock('fs');
jest.mock('path');
jest.mock('@emma-community/emma-typescript-sdk');
jest.mock('@emma-community/backstage-plugin-emma-common');

describe('EmmaApiImpl', () => {
  let mockConfig: Config;
  let mockLogger: LoggerService;
  let mockAuthHandler: HttpBearerAuth;
  let mockAuthApi: AuthenticationApi;
  let mockDataCentersApi: DataCentersApi;
  let mockLocationsApi: LocationsApi;
  let mockProvidersApi: ProvidersApi;
  let mockComputeApi: any;
  let mockSpotInstancesApi: SpotInstancesApi;
  let mockVirtualMachinesapi: VirtualMachinesApi;
  let mockKubernetesClustersApi: KubernetesClustersApi;
  let mockApiFactory: any;

  beforeEach(() => {
    mockConfig = {
      getString: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
      get: jest.fn(),
      getConfig: jest.fn(),
      getOptionalConfig: jest.fn(),
      getOptional: jest.fn(),
      getConfigArray: jest.fn(),
      getNumber: jest.fn(),
      getBoolean: jest.fn(),
      getOptionalConfigArray: jest.fn(),
      getOptionalNumber: jest.fn(),
      getOptionalBoolean: jest.fn(),
      getOptionalString: jest.fn(),
      getStringArray: jest.fn(),
      getOptionalStringArray: jest.fn()
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      child: jest.fn()
    };

    // Mock the fs and path operations
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify([{ region_code: 'us-west', location: { latitude: 37.7749, longitude: -122.4194 } }]));
    path.resolve = jest.fn().mockReturnValue('knownGeoLocations.json');

    // Instantiate and mock HttpBearerAuth
    mockAuthHandler = new HttpBearerAuth();
    mockAuthHandler.accessToken = 'dummy-token';

    // Instantiate and mock API instances
    mockAuthApi = new AuthenticationApi();
    mockAuthApi.issueToken = jest.fn().mockResolvedValue({
      body: { accessToken: 'dummy-token' },
    });

    mockDataCentersApi = new DataCentersApi();
    mockDataCentersApi.getDataCenters = jest.fn().mockResolvedValue({
      body: [
        { id: 'us-west-1', region_code: 'us-west' },
      ],
    });
    
    mockLocationsApi = new LocationsApi();
    mockLocationsApi.getLocation = jest.fn().mockResolvedValue({
      body: [
        { id: 'location-1' },
      ],
    });
    mockLocationsApi.getLocations = jest.fn().mockResolvedValue({
      body: [
        { id: 'location-1' },
        { id: 'location-2' },
      ],
    });
    
    mockProvidersApi = new ProvidersApi();
    mockProvidersApi.getProvider = jest.fn().mockResolvedValue({
      body: [
        { id: 'provider-1' },
      ],
    });
    mockProvidersApi.getProviders = jest.fn().mockResolvedValue({
      body: [
        { id: 'provider-1' },
        { id: 'provider-2' }
      ],
    });

    mockComputeApi = new ComputeInstancesConfigurationsApi();
    mockComputeApi.getVmConfigs = jest.fn().mockResolvedValue({
      body: { content: [{ id: 'vm-1' }, { id: 'vm-2' }] },
    });
    mockComputeApi.getSpotConfigs = jest.fn().mockResolvedValue({
      body: { content: [{ id: 'spot-1' }] },
    });
    mockComputeApi.getKuberNodesConfigs = jest.fn().mockResolvedValue({
      body: { content: [{ id: 'k8s-1' }] },
    });
    
    mockVirtualMachinesapi = new VirtualMachinesApi();
    mockVirtualMachinesapi.getVm = jest.fn().mockResolvedValue({
      body: { id: 'vm-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared },
    });
    mockVirtualMachinesapi.getVms = jest.fn().mockResolvedValue({
      body: [{ id: 'vm-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: Vm.VCpuTypeEnum.Shared}, { id: 'vm-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared }],
    });
    mockVirtualMachinesapi.vmCreate = jest.fn().mockResolvedValue({});
    mockVirtualMachinesapi.vmDelete = jest.fn().mockResolvedValue({});
    
    mockSpotInstancesApi = new SpotInstancesApi();
    mockSpotInstancesApi.getSpot = jest.fn().mockResolvedValue({
      body: { id: 'spot-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared },
    });
    mockSpotInstancesApi.getSpots = jest.fn().mockResolvedValue({
      body: [{ id: 'spot-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared }, { id: 'spot-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared }],
    });
    mockSpotInstancesApi.spotCreate = jest.fn().mockResolvedValue({});
    mockSpotInstancesApi.spotDelete = jest.fn().mockResolvedValue({});
    
    mockKubernetesClustersApi = new KubernetesClustersApi();
    mockKubernetesClustersApi.getKubernetesCluster = jest.fn().mockResolvedValue({
      body: { id: 'k8s-1', nodeGroups: [{ id: 'nodeGroup-1', nodes: [ { id: 'k8s-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared }, { id: 'k8s-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared } ] }] },
    });
    mockKubernetesClustersApi.getKubernetesClusters = jest.fn().mockResolvedValue({
      body: [{ id: 'k8s-1', nodeGroups: [{ id: 'nodeGroup-1', nodes: [ { id: 'k8s-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared }, { id: 'k8s-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared } ] }] }, { id: 'k8s-2', nodeGroups: [{ id: 'nodeGroup-2', nodes: [ { id: 'k8s-3', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared }, { id: 'k8s-4', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared } ] }] }],
    });
    mockKubernetesClustersApi.createKubernetesCluster = jest.fn().mockResolvedValue({});
    mockKubernetesClustersApi.editKubernetesCluster = jest.fn().mockResolvedValue({});
    mockKubernetesClustersApi.deleteKubernetesCluster = jest.fn().mockResolvedValue({});

    // Mock the EmmaApiFactory to return our mock API instances
    mockApiFactory = {
      create: jest.fn((apiClass) => {
        if (apiClass === AuthenticationApi) return mockAuthApi;
        if (apiClass === DataCentersApi) return mockDataCentersApi;
        if (apiClass === LocationsApi) return mockLocationsApi;
        if (apiClass === ProvidersApi) return mockProvidersApi;
        if (apiClass === ComputeInstancesConfigurationsApi) return mockComputeApi;
        if (apiClass === VirtualMachinesApi) return mockVirtualMachinesapi;
        if (apiClass === SpotInstancesApi) return mockSpotInstancesApi;
        if (apiClass === KubernetesClustersApi) return mockKubernetesClustersApi;
        return null;
      }),
    };

    // @ts-ignore
    EmmaApiFactory.mockImplementation(() => mockApiFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load known geo locations from file', () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    expect(fs.readFileSync).toHaveBeenCalledWith('knownGeoLocations.json', 'utf-8');
    // eslint-disable-next-line
    expect(emmaApi['knownGeoLocations']).toEqual([{ region_code: 'us-west', location: { latitude: 37.7749, longitude: -122.4194 } }]);
  });

  test('should issue token and set access token', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });

    // Wait for the token to be issued and set
    // eslint-disable-next-line
    await emmaApi['issueToken']();

    expect(mockAuthApi.issueToken).toHaveBeenCalledWith({
      clientId: undefined,
      clientSecret: undefined
    });
    expect(mockAuthHandler.accessToken).toEqual('dummy-token');
  });

  test('should fetch and filter data centers', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const dataCenters = await emmaApi.getDataCenters();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching data centers');
    expect(dataCenters).toEqual([{ id: 'us-west-1', region_code: 'us-west', location: { latitude: 37.7749, longitude: -122.4194 } }]);
  });

  test('should fetch and filter providers', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const providers = await emmaApi.getProviders();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching providers');
    expect(providers).toEqual([{ id: 'provider-1' }, { id: 'provider-2' }]);
  });

  test('should fetch and filter locations', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const locations = await emmaApi.getLocations();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching locations');
    expect(locations).toEqual([{ id: 'location-1' }, { id: 'location-2' }]);
  });

  test('should fetch compute configurations', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const vmConfigs = await emmaApi.getComputeConfigs();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching compute configs');
    expect(vmConfigs).toEqual([{ id: 'vm-1', type: 'VirtualMachine' }, { id: 'vm-2', type: 'VirtualMachine' }, { id: 'spot-1', type: 'SpotInstance' }, { id: 'k8s-1', type: 'KubernetesNode' }]);
  });

  test('should fetch compute entitites', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const vms = await emmaApi.getComputeEntities();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching compute entities');
    expect(vms).toEqual([
      { id: 'vm-1', type: 'VirtualMachine', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}, 
      { id: 'vm-2', type: 'VirtualMachine', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}, 
      { id: 'spot-1', type: 'SpotInstance', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}, 
      { id: 'spot-2', type: 'SpotInstance', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}, 
      { id: 'k8s-1', label: 'k8s-1', type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}, 
      { id: 'k8s-2', label: 'k8s-1', type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}, 
      { id: 'k8s-3', label: 'k8s-2', type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}, 
      { id: 'k8s-4', label: 'k8s-2', type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 }, region_code: 'unknown' }}
    ]);
  });

  test('should delete compute entity', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const entityId = 1;
    const computeType = EmmaComputeType.VirtualMachine;
    
    await emmaApi.deleteComputeEntity(entityId, computeType);

    expect(mockLogger.info).toHaveBeenCalledWith(`Deleting compute entity with id: ${entityId} and type: ${computeType}`);
  });

  test('should add compute entity', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const entityId = 1;
    const computeType = EmmaComputeType.VirtualMachine;
    const disks = [{type: EmmaVolumeType.SSD, sizeGb: 100}];
    const vCpuType = EmmaCPUType.Shared;
    
    await emmaApi.addComputeEntity({ id: entityId, type: computeType, disks: disks, vCpuType: vCpuType });

    expect(mockLogger.info).toHaveBeenCalledWith(`Adding compute entity with id: ${entityId} and type: ${computeType}`);
    expect(mockLogger.info).toHaveBeenCalledWith('Added compute entity');    
  });

  test('should update compute entity', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const entityId = 1;
    const computeType = EmmaComputeType.KubernetesNode;
    const disks = [{type: EmmaVolumeType.SSD, sizeGb: 100}];
    const vCpuType = EmmaCPUType.Shared;
    
    await emmaApi.updateComputeEntity({ id: entityId, type: computeType, disks: disks, vCpuType: vCpuType });

    expect(mockLogger.info).toHaveBeenCalledWith(`Updating compute entity with id: ${entityId} and type: ${computeType}`);
    expect(mockLogger.info).toHaveBeenCalledWith('Updated compute entity');    
  });

  test('should throw error when update with unsupported compute entity type', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const entityId = 1;
    const computeType = EmmaComputeType.VirtualMachine;
    const disks = [{type: EmmaVolumeType.SSD, sizeGb: 100}];
    const vCpuType = EmmaCPUType.Shared;
    
    await expect(emmaApi.updateComputeEntity({ id: entityId, type: computeType, disks: disks, vCpuType: vCpuType })).rejects.toThrow(`Unsupported compute type: ${computeType}`);
  });
});
