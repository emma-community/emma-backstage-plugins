import { emmaHeatmapPlugin, emmaApiRef, EmmaHeatmapPage } from './plugin';

describe('emma', () => {
  it('should export plugin', () => {
    expect(emmaHeatmapPlugin).toBeDefined();
    expect(emmaApiRef).toBeDefined();
    expect(EmmaHeatmapPage).toBeDefined();
  });
});
