import { DataCenter } from '@zaradarbh/emma-typescript-sdk';

/** @public */
export type EmmaDataCenter = DataCenter & {
    location: GeoLocation
    region_code: string;
    provider: string;
}

/** @public */
export enum EmmaComputeType {
    VirtualMachine = 'VirtualMachine',
    SpotInstance = 'SpotInstance',
    KubernetesNode = 'KubernetesNode'
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