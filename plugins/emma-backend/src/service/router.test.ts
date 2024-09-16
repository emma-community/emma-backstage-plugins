import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { EmmaApiImpl } from '../api';

describe('createRouter', () => {
  let emmaApi: jest.Mocked<EmmaApiImpl>;
  let app: express.Express;

  jest.mock('@backstage/plugin-auth-node', () => ({
    getBearerTokenFromAuthorizationHeader: () => 'token',
  }));

  beforeAll(async () => {
    emmaApi = {
      getDataCenters: jest.fn(),
      getComputeConfigs: jest.fn(),
      getComputeEntities: jest.fn(),
      getSshKeys: jest.fn(),
      addSshKey: jest.fn(),
      addComputeEntity: jest.fn(),
      updateComputeEntity: jest.fn(),
      deleteComputeEntity: jest.fn()
    } as any;

    const config = new ConfigReader({
      emma: {
        baseUrl: 'https://emma.example.com',
        clientId: '1234',
        clientSecret: '1234'
      },
    });

    const logger = mockServices.logger.mock();

    const router = await createRouter({
      config,
      logger,
      emmaApi
    });
    
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns 200', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /datacenters', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/datacenters');

      expect(response.status).toEqual(200);
    });
  });

  describe('GET /ssh-keys', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/ssh-keys');

      expect(response.status).toEqual(200);
    });
  });

  describe('POST /ssh-keys/:name/add', () => {
    it('returns ok', async () => {
      const response = await request(app).post('/ssh-keys/:name/add');

      expect(response.status).toEqual(200);
    });
  });

  describe('GET /compute/configs', () => {
    it('returns 200', async () => {
      const response = await request(app).get('/compute/configs');
      
      expect(response.status).toEqual(200);
    });
  });

  describe('GET /compute/entities', () => {
    it('returns 200', async () => {
      const response = await request(app).get('/compute/entities');
      
      expect(response.status).toEqual(200);
    });
  });

  describe('GET /compute/entities/:computeType/:entityId/delete', () => {
    it('returns 200', async () => {
      const response = await request(app).get('/compute/entities/:computeType/:entityId/delete');
      
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /compute/entities/:computeType/add', () => {
    it('returns 200', async () => {
      const response = await request(app).post('/compute/entities/:computeType/add');
      
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /compute/entities/:computeType/:entityId/update', () => {
    it('returns 200', async () => {
      const response = await request(app).post('/compute/entities/:computeType/:entityId/update');
      
      expect(response.status).toEqual(200);
    });
  });
});
