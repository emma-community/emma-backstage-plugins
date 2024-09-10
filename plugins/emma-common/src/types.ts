import { DataCenter, VmConfiguration } from '@emma-community/emma-typescript-sdk';

/** @public */
export type EmmaDataCenter = DataCenter & {
    location: GeoLocation
    region_code: string;
    provider: string;
}

/** @public */
export type EmmaVmConfiguration = VmConfiguration & {
    label: string;
    type: EmmaComputeType;
}

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