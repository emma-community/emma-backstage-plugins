import { emmaHeatmapPlugin, emmaApiRef, EmmaHeatmapPage, EmmaComputePage } from './plugin';
import { EmmaClient } from './api';

describe('emma', () => {
  it('should export types', () => {
    expect(emmaHeatmapPlugin).toBeDefined();
    expect(emmaApiRef).toBeDefined();
    expect(EmmaHeatmapPage).toBeDefined();
    expect(EmmaComputePage).toBeDefined();
    expect(EmmaClient).toBeDefined();
  });
});
