import React from 'react';
import { View, Text } from 'react-native';

const E2EApp = () => {
  return (
    <View testID="app-root" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text testID="welcome-text">E2E Test App</Text>
    </View>
  );
};

export default E2EApp;
