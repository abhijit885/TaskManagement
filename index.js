/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import E2EApp from './E2EApp';
import { name as appName } from './app.json';
import store, { persistor } from './lib/src/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Use minimal app for E2E testing
if (process.env.DETOX === 'true') {
  // Register minimal app directly for E2E testing
  AppRegistry.registerComponent(appName, () => E2EApp);
} else {
  // Use full app with Redux for normal operation
  const ReduxAppWrapper = () => {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    );
  };
  AppRegistry.registerComponent(appName, () => ReduxAppWrapper);
}
