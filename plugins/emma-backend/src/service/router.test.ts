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

  describe('GET /computeconfigs', () => {
    it('returns 200', async () => {
      const response = await request(app).get('/computeconfigs');
      
      expect(response.status).toEqual(200);
    });
  });
});
