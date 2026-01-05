import { device } from 'detox';

describe('App Launch', () => {
  it('should launch app without crashing', async () => {
    // This test passes if we can launch app without throwing an exception
    await device.launchApp();
    
    // Wait a bit to see if app stays alive
    await new Promise(resolve => setTimeout(resolve, 5000));
  });
});
