import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Redux Persist
jest.mock('redux-persist', () => ({
  persistReducer: jest.fn((config, reducers) => reducers),
  persistStore: jest.fn(() => ({
    purge: jest.fn(() => Promise.resolve()),
    flush: jest.fn(() => Promise.resolve()),
    pause: jest.fn(),
    persist: jest.fn(),
    rehydrate: jest.fn(),
  })),
  FLUSH: 'persist/FLUSH',
  REHYDRATE: 'persist/REHYDRATE',
  PAUSE: 'persist/PAUSE',
  PERSIST: 'persist/PERSIST',
  PURGE: 'persist/PURGE',
  REGISTER: 'persist/REGISTER',
}));

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }) => children,
}));

// Mock WatermelonDB
jest.mock('@nozbe/watermelondb/adapters/sqlite', () => {
  return class MockSQLiteAdapter {
    constructor(options) {
      this.schema = options.schema;
    }
    test() {
      return Promise.resolve();
    }
  };
});

jest.mock('@nozbe/watermelondb', () => ({
  Database: jest.fn().mockImplementation(() => ({
    collections: {
      get: jest.fn(() => ({
        create: jest.fn(),
        query: jest.fn(),
        find: jest.fn(),
      })),
    },
    action: jest.fn(),
    batch: jest.fn(),
  })),
  Model: class MockModel {
    static table = 'mock_table';
    constructor(args) {
      Object.assign(this, args);
    }
  },
  appSchema: jest.fn((config) => config),
  tableSchema: jest.fn((config) => config),
  Q: {
    where: jest.fn(),
    on: jest.fn(),
    orderBy: jest.fn(),
    take: jest.fn(),
    skip: jest.fn(),
  },
}));

// Mock Firebase modules
jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    options: {},
  })),
}));

jest.mock('@react-native-firebase/auth', () => ({
  default: {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/firestore', () => ({
  default: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      add: jest.fn(),
      where: jest.fn(),
      orderBy: jest.fn(),
      limit: jest.fn(),
      get: jest.fn(),
    })),
  },
}));

jest.mock('@react-native-firebase/messaging', () => {
  const mockMessaging = {
    requestPermission: jest.fn(() => Promise.resolve(1)), // AUTHORIZED
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    setBackgroundMessageHandler: jest.fn(),
    AuthorizationStatus: {
      AUTHORIZED: 1,
      PROVISIONAL: 2,
    },
  };
  const messagingFn = jest.fn(() => mockMessaging);
  messagingFn.AuthorizationStatus = {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  };
  return messagingFn;
});

// Mock Notifee
jest.mock('@notifee/react-native', () => {
  const mockNotifee = {
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getNotificationSettings: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
    displayNotification: jest.fn(() => Promise.resolve()),
    cancelNotification: jest.fn(() => Promise.resolve()),
    cancelAllNotifications: jest.fn(() => Promise.resolve()),
    getTriggerNotifications: jest.fn(() => Promise.resolve([])),
    createTriggerNotification: jest.fn(() => Promise.resolve()),
    deleteTriggerNotification: jest.fn(() => Promise.resolve()),
    onForegroundEvent: jest.fn(() => jest.fn()),
  };
  
  const EventType = {
    DELIVERED: 'delivered',
    PRESS: 'press',
    DISMISSED: 'dismissed',
  };

  return {
    default: mockNotifee,
    EventType,
  };
});

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  addEventListener: jest.fn(),
  useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));