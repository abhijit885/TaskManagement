import { device } from 'detox';

describe('App Launch', () => {
  it('should launch app', async () => {
    await device.launchApp({
      newInstance: true,
    });
  });
});
