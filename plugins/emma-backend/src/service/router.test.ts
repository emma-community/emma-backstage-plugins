import { mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
      // TODO: Figure out why rootConfig does not include the required emma fields?
      config: mockServices.rootConfig(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /datacenters', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/datacenters');

      //TODO: Change to 200 / OK when auth config is working
      expect(response.status).toEqual(401);
    });
  });

  describe('GET /computeconfigs', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/computeconfigs');

      //TODO: Change to 200 / OK when auth config is working
      expect(response.status).toEqual(401);
    });
  });
});
