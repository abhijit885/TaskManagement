module.exports = {
  preset: 'react-native',
    setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest/setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-redux|@reduxjs/toolkit|immer|@notifee))/',
  ],
  testMatch: [
    '**/__tests__/**/*.test.(js|ts|tsx)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.styles.ts',
    '!src/**/index.ts',
  ],
  watchman: false,
};
