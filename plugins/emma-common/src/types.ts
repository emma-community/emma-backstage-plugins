import { DataCenter } from '@zaradarbh/emma-typescript-sdk';

/** @public */
export type EmmaDataCenter = DataCenter & {
    latitude: number;
    longitude: number;
    address: string;
    country_code: string;
    region_code: string;
    provider: string;
    price: number;
    intensity: number;
    radius: number;
}