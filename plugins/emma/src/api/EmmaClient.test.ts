import { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { EmmaClient } from './EmmaClient';
import { EmmaDataCenter, EmmaVmConfiguration, GeoFence, EmmaProvider, EmmaVmOs, EMMA_PLUGIN_ID, EmmaComputeType, EmmaVm, EmmaLocation, EmmaSshKey, EmmaSshKeyType } from '@emma-community/backstage-plugin-emma-common';

describe('EmmaClient', () => {
  let discoveryApi: jest.Mocked<DiscoveryApi>;
  let fetchApi: jest.Mocked<FetchApi>;
  let identityApi: jest.Mocked<IdentityApi>;
  let emmaClient: EmmaClient;

  beforeEach(() => {
    discoveryApi = {
      getBaseUrl: jest.fn(),
    } as jest.Mocked<DiscoveryApi>;

    fetchApi = {
      fetch: jest.fn(),
    } as jest.Mocked<FetchApi>;

    identityApi = {
      getProfileInfo: jest.fn(),
      getBackstageIdentity: jest.fn(),
      getCredentials: jest.fn(),
      signOut: jest.fn(),
    } as jest.Mocked<IdentityApi>;

    emmaClient = new EmmaClient({ discoveryApi, fetchApi, identityApi });
  });

  describe('getDataCenters', () => {
    it('should call fetch with the correct URL when geoFence is provided', async () => {
      const mockDataCenters: EmmaDataCenter[] = [ {
        "name": "East US",
        "location": {
          "longitude": -79.4209,
          "latitude": 37.4316        
        }
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
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/datacenters/?latMax=40&lonMax=-74&latMin=39&lonMin=-75', {});
      expect(result).toEqual(mockDataCenters);
    });

    it('should call fetch with the correct URL when geoFence is not provided', async () => {
      const mockDataCenters: EmmaDataCenter[] = [ {
        "name": "East US",
        "location": {
          "longitude": -79.4209,
          "latitude": 37.4316        
        }
    }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockDataCenters,
      } as Response);

      const result = await emmaClient.getDataCenters();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/datacenters/?', {});
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
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/datacenters/?', {});
    });
  });
  
  describe('getLocations', () => {
    it('should call fetch with the correct URL', async () => {
      const mockLocations: EmmaLocation[] = [ {
        "name": "East US",
      }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockLocations,
      } as Response);

      const result = await emmaClient.getLocations();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/locations/?', {});
      expect(result).toEqual(mockLocations);
    });

    it('should throw a ResponseError if the fetch response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore
      await expect(emmaClient.getLocations()).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/locations/?', {});
    });
  });
  
  describe('getOperatingSystems', () => {
    it('should call fetch with the correct URL', async () => {
      const mockOperatingSystems: EmmaVmOs[] = [ {
        id: 1,
      }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockOperatingSystems,
      } as Response);

      const result = await emmaClient.getOperatingSystems();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/operating-systems/?', {});
      expect(result).toEqual(mockOperatingSystems);
    });

    it('should throw a ResponseError if the fetch response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore
      await expect(emmaClient.getLocations()).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/locations/?', {});
    });
  });

  describe('getProviders', () => {
    it('should call fetch with the correct URL', async () => {
      const mockProviders: EmmaProvider[] = [ {
        "name": "East US",
      }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockProviders,
      } as Response);

      const result = await emmaClient.getProviders();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/providers/?', {});
      expect(result).toEqual(mockProviders);
    });

    it('should throw a ResponseError if the fetch response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore
      await expect(emmaClient.getProviders()).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/providers/?', {});
    });
  });
  
  describe('getSshKey', () => {
    it('should call fetch with the correct URL', async () => {
      const mockSshKeys: EmmaSshKey[] = [ {
        id: 1,
        type: EmmaSshKeyType.Rsa,
      }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockSshKeys,
      } as Response);

      const result = await emmaClient.getSshKeys();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/ssh-keys/?', {});
      expect(result).toEqual(mockSshKeys);
    });

    it('should call fetch with the correct URL and id', async () => {
      const mockSshKeys: EmmaSshKey[] = [ {
        id: 1,
        type: EmmaSshKeyType.Rsa,
      }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockSshKeys,
      } as Response);

      const result = await emmaClient.getSshKeys(1);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/ssh-keys/?sshKeyId=1', {});
      expect(result).toEqual(mockSshKeys);
    });

    it('should throw a ResponseError if the fetch response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore
      await expect(emmaClient.getSshKeys()).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/ssh-keys/?', {});
    });
  });  
  
  describe('addSshKey', () => {
    it('should create key with the correct URL', async () => {
      const mockSshKeys: EmmaSshKey[] = [ {
        id: 1,
        type: EmmaSshKeyType.Rsa,
      }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      identityApi.getCredentials.mockResolvedValue({ token: '' });
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockSshKeys,
      } as Response);

      const result = await emmaClient.addSshKey('name', EmmaSshKeyType.Rsa);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/ssh-keys/name/add/', { body: `{\"keyOrkeyType\":\"${EmmaSshKeyType.Rsa}\"}`, headers: { 'Content-Type': 'application/json', 'Authorization' : 'Bearer ' }, method: 'POST' });
      expect(result).toEqual(mockSshKeys);
    });

    it('should throw a ResponseError if the create response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      identityApi.getCredentials.mockResolvedValue({ token: '' });
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore      
      await expect(emmaClient.addSshKey('name', EmmaSshKeyType.Rsa)).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/ssh-keys/name/add/', { body: `{\"keyOrkeyType\":\"${EmmaSshKeyType.Rsa}\"}`, headers: { 'Content-Type': 'application/json', 'Authorization' : 'Bearer ' }, method: 'POST' });
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
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/configs/?computeType=VirtualMachine', {});
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
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/configs/?', {});
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
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/configs/?', {});
    });
  });  

  describe('getComputeEntities', () => {
    it('should call fetch with the correct URL when computeType is provided', async () => {
      const mockVms: EmmaVm[] = [{ id: 1, label: 'default', type: EmmaComputeType.VirtualMachine }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockVms,
      } as Response);

      const result = await emmaClient.getComputeEntities(undefined, EmmaComputeType.VirtualMachine);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/entities/?computeType=VirtualMachine', {});
      expect(result).toEqual(mockVms);
    });

    it('should call fetch with the correct URL when no computeType is provided', async () => {
      const mockVms: EmmaVm[] = [{ id: 1, label: 'default', type: EmmaComputeType.VirtualMachine }];
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockVms,
      } as Response);

      const result = await emmaClient.getComputeEntities();

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/entities/?', {});
      expect(result).toEqual(mockVms);
    });

    it('should throw a ResponseError if the fetch response is not ok', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // @ts-ignore
      await expect(emmaClient.getComputeEntities()).rejects.toThrow(ResponseError);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/entities/?', {});
    });
  }); 

  describe('deleteComputeEntity', () => {
    it('should call fetch with the correct URL', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => Promise<void>,
      } as Response);

      await emmaClient.deleteComputeEntity(1, EmmaComputeType.VirtualMachine);

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/entities/VirtualMachine/1/delete/', {});
    });
  });

  describe('addComputeEntity', () => {
    it('should call fetch with the correct URL', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => 1,
      } as Response);

      const result = await emmaClient.addComputeEntity({ type: EmmaComputeType.VirtualMachine });

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/entities/VirtualMachine/add/', { body: "{\"type\":\"VirtualMachine\"}", headers: { 'Content-Type': 'application/json' }, method: 'POST' });
      expect(result).toEqual(1);
    });
  });

  describe('updateComputeEntity', () => {
    it('should call fetch with the correct URL', async () => {
      discoveryApi.getBaseUrl.mockResolvedValue('http://localhost:7000');
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: async () => Promise<void>,
      } as Response);

      await emmaClient.updateComputeEntity({ id: 1, type: EmmaComputeType.VirtualMachine });

      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith(EMMA_PLUGIN_ID);
      expect(fetchApi.fetch).toHaveBeenCalledWith('http://localhost:7000/compute/entities/VirtualMachine/1/update/', { body: "{\"id\":1,\"type\":\"VirtualMachine\"}", headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    });
  });
});
