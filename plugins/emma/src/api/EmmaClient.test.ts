import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { EmmaClient } from './EmmaClient';
import { EmmaDataCenter, EmmaVmConfiguration, GeoFence, EMMA_PLUGIN_ID, EmmaComputeType } from '@emma-community/backstage-plugin-emma-common';

describe('EmmaClient', () => {
  let discoveryApi: jest.Mocked<DiscoveryApi>;
  let fetchApi: jest.Mocked<FetchApi>;
  let emmaClient: EmmaClient;

  beforeEach(() => {
    discoveryApi = {
      getBaseUrl: jest.fn(),
    } as jest.Mocked<DiscoveryApi>;

    fetchApi = {
      fetch: jest.fn(),
    } as jest.Mocked<FetchApi>;

    emmaClient = new EmmaClient({ discoveryApi, fetchApi });
  });

  describe('getDataCenters', () => {
    it('should call fetch with the correct URL when geoFence is provided', async () => {
      const mockDataCenters: EmmaDataCenter[] = [ {
        "name": "East US",
        "region_code": "eastus",
        "location": {
        "longitude": -79.4209,
        "latitude": 37.4316        
        },
        "provider": "AZURE"
    }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockDataCenters,
      } as Response);

      const geoFence: GeoFence = {
        topRight: { latitude: 40, longitude: -74 },
        bottomLeft: { latitude: 39, longitude: -75 },
      };

      const result = await emmaClient.getDataCenters(geoFence);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/datacenters/?latMax=40&lonMax=-74&latMin=39&lonMin=-75');
      expect(result).toEqual(mockDataCenters);
    });

    it('should call fetch with the correct URL when geoFence is not provided', async () => {
      const mockDataCenters: EmmaDataCenter[] = [ {
        "name": "East US",
        "region_code": "eastus",
        "location": {
        "longitude": -79.4209,
        "latitude": 37.4316        
        },
        "provider": "AZURE"
    }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockDataCenters,
      } as Response);

      const result = await emmaClient.getDataCenters();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/datacenters/?');
      expect(result).toEqual(mockDataCenters);
    });

    it('should throw a ResponseError if the fetch response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore
      await expect(emmaClient.getDataCenters()).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/datacenters/?');
    });
  });

  describe('getComputeConfigs', () => {
    it('should call fetch with the correct URL when computeType is provided', async () => {
      const mockVmConfigurations: EmmaVmConfiguration[] = [{ id: 1, label: 'default', type: EmmaComputeType.VirtualMachine }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockVmConfigurations,
      } as Response);

      const result = await emmaClient.getComputeConfigs(undefined, undefined, undefined, EmmaComputeType.VirtualMachine);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/configs/?computeType=VirtualMachine');
      expect(result).toEqual(mockVmConfigurations);
    });

    it('should call fetch with the correct URL when no computeType is provided', async () => {
      const mockVmConfigurations: EmmaVmConfiguration[] = [{ id: 1, label: 'default', type: EmmaComputeType.VirtualMachine }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockVmConfigurations,
      } as Response);

      const result = await emmaClient.getComputeConfigs();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/configs/?');
      expect(result).toEqual(mockVmConfigurations);
    });

    it('should throw a ResponseError if the fetch response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore
      await expect(emmaClient.getComputeConfigs()).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/configs/?');
    });
  });
});
