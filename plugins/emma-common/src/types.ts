import { DataCenter, VmConfiguration, Provider, Location, KubernetesNodeGroupsInnerNodesInnerDisksInner, SshKey, VmCost, VmOs, SecurityGroup, KubernetesNodeGroupsInnerNodesInnerNetworksInner } from '@emma-community/emma-typescript-sdk';

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
  Hpc = 'hcp'
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
export enum EmmaSshKeyType {
  Rsa = 'Rsa',
  Ed25519 = 'Ed25519'
}

/** @public */
export type GeoLocation = {
  latitude: number;
  longitude: number;
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
export type EmmaDisk = EmmaEntity<number> & KubernetesNodeGroupsInnerNodesInnerDisksInner;

/** @public */
export type EmmaNetwork = EmmaEntity<number> & KubernetesNodeGroupsInnerNodesInnerNetworksInner;

/** @public */
export type EmmaSecurityGroup = EmmaEntity<number> & SecurityGroup;

/** @public */
export type EmmaSshKey = EmmaEntity<number> & SshKey & {
  type: EmmaSshKeyType;
}

/** @public */
export type EmmaDataCenter = EmmaEntity<string> & DataCenter & {
  location: GeoLocation
}

/** @public */
export type EmmaLocation = EmmaEntity<number> & Location;

/** @public */
export type EmmaProvider = EmmaEntity<number> & Provider;

/** @public */
export type EmmaVmOs = EmmaEntity<number> & VmOs;

/** @public */
export type EmmaVmCost = EmmaEntity<number> & VmCost;

/** @public */
export type EmmaVm = EmmaEntity<number> & {
  type: EmmaComputeType;
  label?: string;
  createdAt?: string;
  name?: string;
  status?: string;
  provider?: EmmaProvider;
  location?: EmmaLocation;
  dataCenter?: EmmaDataCenter;
  os?: EmmaVmOs;
  vCpu?: number;
  vCpuType?: EmmaCPUType;
  cloudNetworkType?: EmmaNetworkType;
  ramGb?: number;
  disks?: Array<EmmaDisk>;
  networks?: Array<EmmaNetwork>;
  securityGroup?: SecurityGroup;
  cost?: EmmaVmCost;
  sshKeyId?: number;
  clusterId?: number;
  clusterStatus?: string;
};

/** @public */
export type EmmaVmConfiguration = EmmaEntity<number> & VmConfiguration & {  
  type: EmmaComputeType;
  label?: string;
};