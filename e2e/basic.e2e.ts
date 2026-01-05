import { device } from 'detox';

describe('Basic App Launch', () => {
  it('should launch app', async () => {
    await device.launchApp();
    
    // Wait a bit for the app to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take a screenshot to see what's displayed
    await device.takeScreenshot('app-launched');
  });
});
