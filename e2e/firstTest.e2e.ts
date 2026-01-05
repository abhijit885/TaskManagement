import { device, expect, element, by, waitFor } from 'detox';

describe('App Launch Test', () => {
  beforeAll(async () => {
    // Set up device and launch app with debug flags
    await device.setURLBlacklist([
      '.*', // Block all network requests initially
    ]);

    await device.launchApp({
      newInstance: true,
      launchArgs: { 
        detoxPrintBusyResources: 'YES',
        detoxDebugVisibility: 'YES',
        // Enable test environment
        DETOX: 'true',
        // Disable animations for more reliable tests
        IS_DETOX: 'true',
      },
      // Disable permissions dialogs
      permissions: {
        notifications: 'YES',
        location: 'inuse',
        camera: 'YES',
        medialibrary: 'YES',
        photos: 'YES',
        microphone: 'YES',
      },
    });
  }, 300000); // 5 minute timeout for the beforeAll hook

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should launch the app and display welcome text', async () => {
    try {
      // Wait for the app root to be visible with a longer timeout
      await waitFor(element(by.id('app-root')))
        .toBeVisible()
        .withTimeout(30000);
      
      // Check for welcome text
      await expect(element(by.text('App Ready for E2E Testing'))).toBeVisible();
      
      // Take a screenshot for debugging
      await device.takeScreenshot('app-launch-success');
      
    } catch (error) {
      // Take a screenshot on failure
      await device.takeScreenshot('app-launch-failure');
      console.error('Test failed:', error);
      throw error;
    }
  });

  afterEach(async () => {
    // Clean up after each test
    await device.takeScreenshot('test-completed');
  });
});
