import { DataCenter, VmConfiguration, Provider } from '@emma-community/emma-typescript-sdk';

/** @public */
export enum EmmaComputeType {
  VirtualMachine = 'VirtualMachine',
  SpotInstance = 'SpotInstance',
  KubernetesNode = 'KubernetesNode'
}

/** @public */
export enum EmmaCPUType {
  Shared = 'shared',
  Standard = 'standard',
  HCP = 'hcp'
}

/** @public */
export enum EmmaNetworkType {
  Isolated = 'isolated',
  MultiCloud = 'multi-cloud',
  Default = 'default'
}

/** @public */
export enum EmmaVolumeType {
  SSD = 'ssd',
  SSDPlus = 'ssd-plus'
}

/** @public */
export enum EmmaComputeUnit {
  Months = 'MONTHS',
  Days = 'DAYS',
  Hours = 'HOURS'
}

/** @public */
export type GeoLocation = {
  latitude: number;
  longitude: number;
  label?: string;
}

/** @public */
export type GeoFence = {
  topRight: GeoLocation;
  bottomLeft: GeoLocation;
}

/** @public */
export type EmmaEntity<T> = {
  id?: T;
}

/** @public */
export type EmmaDataCenter = EmmaEntity<string> & DataCenter & {
  location: GeoLocation
  region_code: string;
  provider: string;
}

/** @public */
export type EmmaProvider = EmmaEntity<number> & Provider;

/** @public */
export type EmmaVm = EmmaEntity<number> & {
  type: EmmaComputeType;
  label?: string;
  createdAt?: string;
  name?: string;
  status?: any;
  provider?: any;
  location?: any;
  dataCenter?: any;
  os?: any;
  vCpu?: number;
  vCpuType?: any;
  cloudNetworkType?: any;
  ramGb?: number;
  disks?: Array<any>;
  networks?: Array<any>;
  securityGroup?: any;
  cost?: any;
  sshKeyId?: number;
};

/** @public */
export type EmmaVmConfiguration = EmmaEntity<number> & VmConfiguration & {  
  type: EmmaComputeType;
  label?: string;
};