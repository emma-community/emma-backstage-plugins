import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService, RootConfigService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { EmmaApiImpl } from '../api';
import { EmmaDataCenter } from '@internal/backstage-plugin-emma-common';

export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
  emmaApi?: EmmaApiImpl;
}

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

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());

  return router;
}
