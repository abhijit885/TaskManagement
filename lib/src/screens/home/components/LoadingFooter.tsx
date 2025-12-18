import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingFooterProps {
  isLoading: boolean;
}

const LoadingFooter: React.FC<LoadingFooterProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.listFooterContainer}>
      <ActivityIndicator size="small" color="#092E75" />
      <Text style={styles.listFooterText}>Loading more...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listFooterContainer: { alignItems: 'center', paddingVertical: 15 },
  listFooterText: { marginTop: 8, fontSize: 12 },
});

export default LoadingFooter;