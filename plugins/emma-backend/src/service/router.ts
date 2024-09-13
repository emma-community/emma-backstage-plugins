import express from 'express';
import Router from 'express-promise-router';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService, RootConfigService } from '@backstage/backend-plugin-api';
import { EmmaApiImpl } from '../api';
import { EmmaComputeType, EmmaDataCenter, EmmaSshKey, EmmaSshKeyType, EmmaVm } from '@emma-community/backstage-plugin-emma-common';

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

  router.get('/providers', async (req, res) => {
    let providerId: number | undefined;
    let providerName: string | undefined;

    if(req.query.providerId) {
      providerId = Number(req.query.providerId);
    }

    if(req.query.providerName) {
      providerName = req.query.providerName as string;
    }

    const providers = await emmaApi.getProviders(providerId, providerName);

    res.status(200).json(providers);
  });

  router.get('/locations', async (req, res) => {
    let locationId: number | undefined;
    let locationName: string | undefined;

    if(req.query.locationId) {
      locationId = Number(req.query.locationId);
    }

    if(req.query.locationName) {
      locationName = req.query.locationName as string;
    }

    const locations = await emmaApi.getLocations(locationId, locationName);

    res.status(200).json(locations);
  });

  router.get('/ssh-keys', async (req, res) => {
    let sshKeyId: number | undefined;

    if(req.query.sshKeyId) {
      sshKeyId = Number(req.query.sshKeyId);
    }

    const sshKeys = await emmaApi.getSshKeys(sshKeyId);

    res.status(200).json(sshKeys);
  });

  router.post('/ssh-keys/:name/add', async (req, res) => {
    const name: string = req.params.name;
    const key: EmmaSshKey | EmmaSshKeyType = ((req.body as EmmaSshKey).key !== undefined) ? req.body as EmmaSshKey : req.body as EmmaSshKeyType;

    logger.info(`ENTITY: ${JSON.stringify(key)}`);

    const keyId = await emmaApi.addSshKey(name, key);

    res.status(200).json({keyId});
  });

  router.get('/compute/configs', async (req, res) => {
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

  router.get('/compute/entities', async (req, res) => {
    let requestedComputeTypes: EmmaComputeType[] = [];
    let entityId: number | undefined;

    if(req.query.computeType) {
      requestedComputeTypes = Array.isArray(req.query.computeType) ? req.query.computeType.map(value => EmmaComputeType[value as keyof typeof EmmaComputeType]) : [EmmaComputeType[req.query.computeType as keyof typeof EmmaComputeType]];
    }

    if(req.query.entityId) {
      entityId = Number(req.query.entityId);
    }

    const computeEntities = await emmaApi.getComputeEntities(entityId, ...requestedComputeTypes);

    res.status(200).json(computeEntities);
  });

  router.get('/compute/entities/:computeType/:entityId/delete', async (req, res) => {
    const requestedComputeType: EmmaComputeType = EmmaComputeType[req.params.computeType as keyof typeof EmmaComputeType];
    const entityId: number = Number(req.params.entityId);;

    await emmaApi.deleteComputeEntity(entityId, requestedComputeType);

    res.status(200).json({});
  });

  router.post('/compute/entities/:computeType/add', async (req, res) => {
    const entity = req.body as EmmaVm;

    logger.info(`ENTITY: ${JSON.stringify(entity)}`);

    const entityId = await emmaApi.addComputeEntity(entity);

    res.status(200).json({entityId});
  });

  router.post('/compute/entities/:computeType/:entityId/update', async (req, res) => {
    const entity = req.body as EmmaVm;

    logger.info(`ENTITY: ${JSON.stringify(entity)}`);

    await emmaApi.updateComputeEntity(entity);

    res.status(200).json({});
  });

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());

  return router;
}
