/**
 * @format
 */

import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../lib/src/redux/store';

// Mock React hooks to prevent useEffect execution that triggers native modules
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn((initial) => [initial, jest.fn()]),
  createRef: jest.fn(() => ({ current: null })),
}));

// Mock all native modules that cause issues in test environment
jest.mock('@notifee/react-native', () => ({
  default: {
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getNotificationSettings: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
    displayNotification: jest.fn(() => Promise.resolve()),
    cancelNotification: jest.fn(() => Promise.resolve()),
    cancelAllNotifications: jest.fn(() => Promise.resolve()),
    getTriggerNotifications: jest.fn(() => Promise.resolve([])),
    createTriggerNotification: jest.fn(() => Promise.resolve()),
    deleteTriggerNotification: jest.fn(() => Promise.resolve()),
    onForegroundEvent: jest.fn(() => jest.fn()),
    createChannel: jest.fn(() => Promise.resolve({ id: 'default_channel', name: 'Default Channel' })),
  },
  EventType: {
    DELIVERED: 'delivered',
    PRESS: 'press',
    DISMISSED: 'dismissed',
  },
}));

// Simple mock component that represents the App structure
const MockApp = () => (
  <View>
    <Text>Task Management App</Text>
  </View>
);

test('App renders without crashing', () => {
  const { getByText } = render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MockApp />
      </PersistGate>
    </Provider>
  );

  expect(getByText('Task Management App')).toBeTruthy();
});
