import express from 'express';
import Router from 'express-promise-router';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService, RootConfigService } from '@backstage/backend-plugin-api';
import { EmmaApiImpl } from '../api';
import { EmmaComputeType, EmmaDataCenter } from '@emma-community/backstage-plugin-emma-common';

/** @public */
export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
  emmaApi?: EmmaApiImpl;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const emmaApi = options.emmaApi ?? EmmaApiImpl.fromConfig(config, options);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/datacenters', async (req, res) => {
    const latMax = req.query.latMax ? Number(req.query.latMax) : undefined;
    const lonMax = req.query.lonMax ? Number(req.query.lonMax) : undefined;
    const latMin = req.query.latMin ? Number(req.query.latMin) : undefined;
    const lonMin = req.query.lonMin ? Number(req.query.lonMin) : undefined;

    let dataCenters: EmmaDataCenter[];

    if(latMax !== undefined && lonMax !== undefined && latMin !== undefined && lonMin !== undefined) {
      dataCenters = await emmaApi.getDataCenters({ topRight: { latitude: Number(req.query.latMax), longitude: Number(req.query.lonMax) }, bottomLeft: { latitude: Number(req.query.latMin), longitude: Number(req.query.lonMin) } });
    }
    else {
      dataCenters = await emmaApi.getDataCenters();
    }

    res.status(200).json(dataCenters);
  });

  router.get('/computeconfigs', async (req, res) => {
    let requestedComputeTypes: EmmaComputeType[] = [];
    let providerId: number | undefined;
    let locationId: number | undefined;
    let dataCenterId: string | undefined;

    if(req.query.computeType) {
      requestedComputeTypes = Array.isArray(req.query.computeType) ? req.query.computeType.map(value => EmmaComputeType[value as keyof typeof EmmaComputeType]) : [EmmaComputeType[req.query.computeType as keyof typeof EmmaComputeType]];
    }

    if(req.query.providerId) {
      providerId = Number(req.query.providerId);
    }

    if(req.query.locationId) {
      locationId = Number(req.query.locationId);
    }

    if(req.query.dataCenterId) {
      dataCenterId = req.query.dataCenterId as string;
    }

    const computeConfigs = await emmaApi.getComputeConfigs(providerId, locationId, dataCenterId, ...requestedComputeTypes);

    res.status(200).json(computeConfigs);
  });

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());

  return router;
}
