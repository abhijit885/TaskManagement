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
        avdName: 'test',
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
    'ios.sim.debug': {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
      app: {
        binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/TaskManagement.app',
        build: 'xcodebuild -workspace ios/TaskManagement.xcworkspace -scheme TaskManagement -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      },
    },
  },
};
