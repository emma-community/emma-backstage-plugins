import React from 'react';
import { HeatMapComponent } from './HeatMapComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  registerMswTestHooks,
  renderInTestApp,
  TestApiProvider
} from '@backstage/test-utils';
import { emmaApiRef } from '../../plugin';

describe('HeatMapComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  registerMswTestHooks(server);

  const mockEmmaApi = {
    getDataCenters: async () => { return [{
        "name": "China (Beijing)",
        "address": "Beijing, China",
        "country_code": "CN",
        "region_code": "cn-north-1",
        "location": {
        "longitude": 116.4074,
        "latitude": 39.9042
        },
        "provider": "AWS",
        "price": 222,
        "intensity": 2,
        "radius": 2
    }]}
  };

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    // TODO: Figure out if its worth trying to mock heatmap lib for testing to fix this:  TypeError: Cannot set properties of null (setting 'shadowOffsetY')
    await renderInTestApp(<TestApiProvider apis={[[ emmaApiRef, mockEmmaApi ]]}><HeatMapComponent /></TestApiProvider>);
    expect(
      screen.getByText('OpenStreetMap'),
    ).toBeInTheDocument();
  });
});
