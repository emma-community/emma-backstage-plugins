import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { emmaHeatmapPlugin, EmmaHeatmapPage } from '../src/plugin';

createDevApp()
  .registerPlugin(emmaHeatmapPlugin)
  .addPage({
    element: <EmmaHeatmapPage />,
    title: 'Heatmap Page',
    path: '/emma',
  })
  .render();
