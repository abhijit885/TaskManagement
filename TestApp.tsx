import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Completely minimal test app to isolate crash issues
const TestApp = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Task Management App</Text>
    <Text style={styles.text}>E2E Test Mode</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default TestApp;
