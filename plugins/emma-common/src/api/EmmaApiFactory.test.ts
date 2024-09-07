import {
    Authentication,
    HttpBearerAuth,
    DataCentersApi,
    ComputeInstancesConfigurationsApi,
    LocationsApi,
    KubernetesClustersApi,
    OperatingSystemsApi,
    SecurityGroupsApi,
    ProvidersApi,
    SpotInstancesApi,
    SSHKeysApi,
    StatisticsApi,
    SubnetworksApi,
    VirtualMachinesApi,
} from '@emma-community/emma-typescript-sdk';
import { EmmaApiFactory } from './EmmaApiFactory';
  
jest.mock('@emma-community/emma-typescript-sdk', () => {
  const mockSetDefaultAuthentication = jest.fn();
  
  class MockDataCentersApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockSSHKeysApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockComputeInstancesConfigurationsApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockLocationsApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockKubernetesClustersApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockOperatingSystemsApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockSecurityGroupsApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockProvidersApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockSpotInstancesApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockStatisticsApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockSubnetworksApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
    
  class MockVirtualMachinesApi {
    setDefaultAuthentication = mockSetDefaultAuthentication;
  }
  
  return {
    Authentication: jest.fn(),
    HttpBearerAuth: jest.fn(),
    DataCentersApi: MockDataCentersApi,
    ComputeInstancesConfigurationsApi: MockComputeInstancesConfigurationsApi,
    LocationsApi: MockLocationsApi,
    KubernetesClustersApi: MockKubernetesClustersApi,
    OperatingSystemsApi: MockOperatingSystemsApi,
    SecurityGroupsApi: MockSecurityGroupsApi,
    ProvidersApi: MockProvidersApi,
    SpotInstancesApi: MockSpotInstancesApi,
    SSHKeysApi: MockSSHKeysApi,
    StatisticsApi: MockStatisticsApi,
    SubnetworksApi: MockSubnetworksApi,
    VirtualMachinesApi: MockVirtualMachinesApi,
  };
});
  
describe('EmmaApiFactory', () => {    
  let authHandler: Authentication;
  let factory : EmmaApiFactory;
  
  beforeEach(() => {
    authHandler = new HttpBearerAuth();
    factory = new EmmaApiFactory(authHandler);
  });
 
  it('should create an instance of DataCentersApi and set the authentication handler', () => {
    const apiInstance = factory.create(DataCentersApi);

    expect(apiInstance).toBeInstanceOf(DataCentersApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of SSHKeysApi and set the authentication handler', () => {
    const apiInstance = factory.create(SSHKeysApi);

    expect(apiInstance).toBeInstanceOf(SSHKeysApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of ComputeInstancesConfigurationsApi and set the authentication handler', () => {
    const apiInstance = factory.create(ComputeInstancesConfigurationsApi);

    expect(apiInstance).toBeInstanceOf(ComputeInstancesConfigurationsApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of LocationsApi and set the authentication handler', () => {
    const apiInstance = factory.create(LocationsApi);

    expect(apiInstance).toBeInstanceOf(LocationsApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of KubernetesClustersApi and set the authentication handler', () => {
    const apiInstance = factory.create(KubernetesClustersApi);

    expect(apiInstance).toBeInstanceOf(KubernetesClustersApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of OperatingSystemsApi and set the authentication handler', () => {
    const apiInstance = factory.create(OperatingSystemsApi);

    expect(apiInstance).toBeInstanceOf(OperatingSystemsApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of SecurityGroupsApi and set the authentication handler', () => {
    const apiInstance = factory.create(SecurityGroupsApi);

    expect(apiInstance).toBeInstanceOf(SecurityGroupsApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of ProvidersApi and set the authentication handler', () => {
    const apiInstance = factory.create(ProvidersApi);

    expect(apiInstance).toBeInstanceOf(ProvidersApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of SpotInstancesApi and set the authentication handler', () => {
    const apiInstance = factory.create(SpotInstancesApi);

    expect(apiInstance).toBeInstanceOf(SpotInstancesApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of StatisticsApi and set the authentication handler', () => {
    const apiInstance = factory.create(StatisticsApi);

    expect(apiInstance).toBeInstanceOf(StatisticsApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of SubnetworksApi and set the authentication handler', () => {
    const apiInstance = factory.create(SubnetworksApi);

    expect(apiInstance).toBeInstanceOf(SubnetworksApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should create an instance of VirtualMachinesApi and set the authentication handler', () => {
    const apiInstance = factory.create(VirtualMachinesApi);

    expect(apiInstance).toBeInstanceOf(VirtualMachinesApi);
    expect(apiInstance.setDefaultAuthentication).toHaveBeenCalledWith(authHandler);
  });

  it('should return the auth handler when getAuthHandler is called', () => {
    expect(factory.getAuthHandler()).toBe(authHandler);
  });
});