import { DataCenter } from '@zaradarbh/emma-typescript-sdk';

/** @public */
export type EmmaDataCenter = DataCenter & {
    location: GeoLocation
    address: string;
    country_code: string;
    region_code: string;
    provider: string;
    price: number;
    intensity: number;
    radius: number;
}

/** @public */
export enum EmmaComputeType {
    VirtualMachine = 'VirtualMachine',
    SpotInstance = 'SpotInstance',
    KubernetesNode = 'KubernetesNode'
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