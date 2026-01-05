module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/jest.config.js',
  skipLegacyWorkersInjection: true,
  testTimeout: 120000,
  artifacts: {
    plugins: {
      log: 'failing',
      screenshot: 'failing',
    },
  },
  configurations: {
    'android.emu.debug': {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_33',
      },
      app: {
        binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
        build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
        launchArgs: {
          detoxPrintBusyIdleResources: 'YES',
          detoxDebugVisibility: 'YES',
          ENABLE_IDLE: 'true',
        },
      },
    },
  },
};
