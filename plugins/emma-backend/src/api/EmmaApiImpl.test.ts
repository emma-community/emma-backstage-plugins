import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { HttpBearerAuth, DataCentersApi, SSHKeysApi, AuthenticationApi, ComputeInstancesConfigurationsApi, OperatingSystemsApi, VirtualMachinesApi, SpotInstancesApi, KubernetesClustersApi, LocationsApi, ProvidersApi, Vm } from '@emma-community/emma-typescript-sdk';
import { EmmaApiFactory, EmmaComputeType, EmmaVolumeType, EmmaCPUType, EmmaSshKeyType, EmmaNetworkType } from '@emma-community/backstage-plugin-emma-common';
import { EmmaApiImpl } from './EmmaApiImpl';

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
  let mockSshKeysApi: SSHKeysApi;
  let mockOperatingSystemsApi: OperatingSystemsApi;
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
        { id: 'us-west-1' },
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

    mockOperatingSystemsApi = new OperatingSystemsApi();
    mockOperatingSystemsApi.getOperatingSystems = jest.fn().mockResolvedValue({
      body: [
        { id: 'os-1' },
      ],
    });

    mockSshKeysApi = new SSHKeysApi();
    mockSshKeysApi.getSshKey = jest.fn().mockResolvedValue({
      body: [
        { id: 'key-1' },
      ],
    });
    mockSshKeysApi.sshKeys = jest.fn().mockResolvedValue({
      body: [
        { id: 'key-1' }, { id: 'key-2' },
      ],
    });
    mockSshKeysApi.sshKeysCreateImport = jest.fn().mockResolvedValue({body: {id: 1}});
    
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
      body: { id: 'vm-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default },
    });
    mockVirtualMachinesapi.getVms = jest.fn().mockResolvedValue({
      body: [{ id: 'vm-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: Vm.VCpuTypeEnum.Shared, cloudNetworkType: EmmaNetworkType.Default }, { id: 'vm-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default }],
    });
    mockVirtualMachinesapi.vmCreate = jest.fn().mockResolvedValue({});
    mockVirtualMachinesapi.vmDelete = jest.fn().mockResolvedValue({});
    
    mockSpotInstancesApi = new SpotInstancesApi();
    mockSpotInstancesApi.getSpot = jest.fn().mockResolvedValue({
      body: { id: 'spot-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default },
    });
    mockSpotInstancesApi.getSpots = jest.fn().mockResolvedValue({
      body: [{ id: 'spot-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default }, { id: 'spot-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default }],
    });
    mockSpotInstancesApi.spotCreate = jest.fn().mockResolvedValue({});
    mockSpotInstancesApi.spotDelete = jest.fn().mockResolvedValue({});
    
    mockKubernetesClustersApi = new KubernetesClustersApi();
    mockKubernetesClustersApi.getKubernetesCluster = jest.fn().mockResolvedValue({
      body: { id: 'k8s-1', nodeGroups: [{ id: 'nodeGroup-1', nodes: [ { id: 'k8s-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default }, { id: 'k8s-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default } ] }] },
    });
    mockKubernetesClustersApi.getKubernetesClusters = jest.fn().mockResolvedValue({
      body: [{ id: 'k8s-1', nodeGroups: [{ id: 'nodeGroup-1', nodes: [ { id: 'k8s-1', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default }, { id: 'k8s-2', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default } ] }] }, { id: 'k8s-2', nodeGroups: [{ id: 'nodeGroup-2', nodes: [ { id: 'k8s-3', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default }, { id: 'k8s-4', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, cloudNetworkType: EmmaNetworkType.Default } ] }] }],
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
        if (apiClass === OperatingSystemsApi) return mockOperatingSystemsApi;
        if (apiClass === SSHKeysApi) return mockSshKeysApi;
        return null;
      }),
    };

    // @ts-ignore
    EmmaApiFactory.mockImplementation(() => mockApiFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(dataCenters).toEqual([{ id: 'us-west-1', location: { latitude: 0, longitude: 0 } }]);
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

  test('should fetch and filter operating systems', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const operatingSystems = await emmaApi.getOperatingSystems();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching operating systems');
    expect(operatingSystems).toEqual([{ id: 'os-1' }]);
  });

  test('should fetch and filter ssh keys', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const keys = await emmaApi.getSshKeys();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching ssh keys');
    expect(keys).toEqual([{ id: 'key-1' }, { id: 'key-2' }]);
  });

  test('should add ssh key', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const sshKeyId = await emmaApi.addSshKey('key-1', EmmaSshKeyType.Rsa);

    expect(mockLogger.info).toHaveBeenCalledWith('Adding ssh key');
    expect(sshKeyId).toEqual({"id": 1, "type": "Rsa"});
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
      { id: 'vm-1', type: 'VirtualMachine', label: undefined, disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default}, 
      { id: 'vm-2', type: 'VirtualMachine', label: undefined, disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default}, 
      { id: 'spot-1', type: 'SpotInstance', label: undefined, disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default}, 
      { id: 'spot-2', type: 'SpotInstance', label: undefined, disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default}, 
      { id: 'k8s-1', label: undefined, type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default, clusterId: 'k8s-1', clusterStatus: undefined}, 
      { id: 'k8s-2', label: undefined, type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default, clusterId: 'k8s-1', clusterStatus: undefined}, 
      { id: 'k8s-3', label: undefined, type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default, clusterId: 'k8s-2', clusterStatus: undefined}, 
      { id: 'k8s-4', label: undefined, type: 'KubernetesNode', disks: [{type: EmmaVolumeType.SSD, sizeGb: 100}], vCpuType: EmmaCPUType.Shared, dataCenter: { location: { latitude: 0, longitude: 0 } }, cloudNetworkType: EmmaNetworkType.Default, clusterId: 'k8s-2', clusterStatus: undefined}
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
    
    await emmaApi.addComputeEntity({ id: entityId, type: computeType, disks: disks, vCpuType: vCpuType, sshKeyId: 1 });

    expect(mockLogger.info).toHaveBeenCalledWith(`Adding compute entity with type: ${computeType}`);
    expect(mockLogger.info).toHaveBeenCalledWith('Added compute entity');    
  });

  test('should update compute entity', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const entityId = 1;
    const computeType = EmmaComputeType.KubernetesNode;
    const disks = [{type: EmmaVolumeType.SSD, sizeGb: 100}];
    const vCpuType = EmmaCPUType.Shared;
    
    await emmaApi.updateComputeEntity({ id: entityId, type: computeType, disks: disks, vCpuType: vCpuType, sshKeyId: 1 });

    expect(mockLogger.info).toHaveBeenCalledWith(`Updating compute entity with id: ${entityId} and type: ${computeType}`);
    expect(mockLogger.info).toHaveBeenCalledWith('Updated compute entity');    
  });

  test('should throw error when update with unsupported compute entity type', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const entityId = 1;
    const computeType = EmmaComputeType.VirtualMachine;
    const disks = [{type: EmmaVolumeType.SSD, sizeGb: 100}];
    const vCpuType = EmmaCPUType.Shared;
    
    await expect(emmaApi.updateComputeEntity({ id: entityId, type: computeType, disks: disks, vCpuType: vCpuType, sshKeyId: 1 })).rejects.toThrow(`Unsupported compute type: ${computeType}`);
  });
});
