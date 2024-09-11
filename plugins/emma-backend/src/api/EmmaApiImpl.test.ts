import fs from 'fs';
import path from 'path';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import { HttpBearerAuth, DataCentersApi, AuthenticationApi, ComputeInstancesConfigurationsApi, VirtualMachinesApi, SpotInstancesApi, KubernetesClustersApi } from '@emma-community/emma-typescript-sdk';
import { EmmaApiFactory } from '@emma-community/backstage-plugin-emma-common';
import { EmmaApiImpl } from './EmmaApiImpl';

jest.mock('fs');
jest.mock('path');
jest.mock('@emma-community/emma-typescript-sdk');
jest.mock('@emma-community/backstage-plugin-emma-common');

describe('EmmaApiImpl', () => {
  let mockConfig: Config;
  let mockLogger: LoggerService;
  let mockAuthHandler: any;
  let mockAuthApi: any;
  let mockDataCentersApi: any;
  let mockComputeApi: any;
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
    mockComputeApi.getVm = jest.fn().mockResolvedValue({
      body: { id: 'vm-1' },
    });
    mockComputeApi.getVms = jest.fn().mockResolvedValue({
      body: [{ id: 'vm-1' }, { id: 'vm-2' }],
    });
    mockComputeApi.getSpot = jest.fn().mockResolvedValue({
      body: { id: 'spot-1' },
    });
    mockComputeApi.getSpots = jest.fn().mockResolvedValue({
      body: [{ id: 'spot-1' }, { id: 'spot-2' }],
    });
    mockComputeApi.getKubernetesCluster = jest.fn().mockResolvedValue({
      body: { id: 'k8s-1', nodeGroups: [{ id: 'nodeGroup-1', nodes: [ { id: 'k8s-1' }, { id: 'k8s-2' } ] }] },
    });
    mockComputeApi.getKubernetesClusters = jest.fn().mockResolvedValue({
      body: [{ id: 'k8s-1', nodeGroups: [{ id: 'nodeGroup-1', nodes: [ { id: 'k8s-1' }, { id: 'k8s-2' } ] }] }, { id: 'k8s-2', nodeGroups: [{ id: 'nodeGroup-2', nodes: [ { id: 'k8s-3' }, { id: 'k8s-4' } ] }] }],
    });

    // Mock the EmmaApiFactory to return our mock API instances
    mockApiFactory = {
      create: jest.fn((apiClass) => {
        if (apiClass === AuthenticationApi) return mockAuthApi;
        if (apiClass === DataCentersApi) return mockDataCentersApi;
        if (apiClass === ComputeInstancesConfigurationsApi) return mockComputeApi;
        if (apiClass === VirtualMachinesApi) return mockComputeApi;
        if (apiClass === SpotInstancesApi) return mockComputeApi;
        if (apiClass === KubernetesClustersApi) return mockComputeApi;
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

  test('should fetch compute configurations', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const vmConfigs = await emmaApi.getComputeConfigs();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching compute configs');
    expect(vmConfigs).toEqual([{ id: 'vm-1', label: 'default', type: 'VirtualMachine' }, { id: 'vm-2', label: 'default', type: 'VirtualMachine' }, { id: 'spot-1', label: 'default', type: 'SpotInstance' }, { id: 'k8s-1', label: 'default', type: 'KubernetesNode' }]);
  });

  test('should fetch compute entitites', async () => {
    const emmaApi = EmmaApiImpl.fromConfig(mockConfig, { logger: mockLogger });
    const vms = await emmaApi.getComputeEntities();

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching compute entities');
    expect(vms).toEqual([{ id: 'vm-1', label: 'default', type: 'VirtualMachine' }, { id: 'vm-2', label: 'default', type: 'VirtualMachine' }, { id: 'spot-1', label: 'default', type: 'SpotInstance' }, { id: 'spot-2', label: 'default', type: 'SpotInstance' }, { id: 'k8s-1', label: 'default', type: 'KubernetesNode' }, { id: 'k8s-2', label: 'default', type: 'KubernetesNode' }, { id: 'k8s-3', label: 'default', type: 'KubernetesNode' }, { id: 'k8s-4', label: 'default', type: 'KubernetesNode' }]);
  });
});
