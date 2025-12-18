import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface ListEmptyStateProps {
  isLoading: boolean;
}

const ListEmptyState: React.FC<ListEmptyStateProps> = ({ isLoading }) => {
  return (
    <View style={styles.listEmptyContainer}>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#092E75" />
          <Text style={styles.loadingText}>Loading todos...</Text>
        </>
      ) : (
        <Text>No todos found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listEmptyContainer: { alignItems: 'center', marginTop: 20 },
  loadingText: { marginTop: 10 },
});

export default ListEmptyState;