import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useThemeContext } from '../../theme/ThemeContext';
import {
  responsiveHeight,
} from '../../common/responsiveFontSize';
import { useSelector } from 'react-redux';
import { rootState } from '../../redux/store';

import UserInputForm from './components/UserInputForm';
import ActionButtons from './components/ActionButtons';
import TableHeader from './components/TableHeader';
import UserTableRow from './components/UserTableRow';
import ListEmptyState from './components/ListEmptyState';
import LoadingFooter from './components/LoadingFooter';

// WatermelonDB imports
import { syncService } from '../../database/watermelon';
import Todo from '../../database/watermelon/models/Todo';

interface UserItem {
  id: string;
  name: string;
  age: number;
  isChecked: boolean;
  isSynced?: boolean;
}

const HomeScreen = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const pageSize = 10;
  const [newUser, setNewUser] = useState<{
    name: string;
    age: string;
    isChecked: boolean;
    userId: string | null;
    isEditing: boolean;
  }>({
    name: '',
    age: '',
    isChecked: false,
    userId: null,
    isEditing: false,
  });
  const { theme, colors } = useThemeContext();
  const globalSpinner: any = useSelector<any>(
    (state: rootState) => state.user.globalLoading,
  );
  const styles = useMemo(() => createStyles(theme), [theme, colors]);

  // Initialize sync service and subscribe to events
  useEffect(() => {
    // Initialize the sync service network listener
    syncService.init();

    // Load initial data from local DB
    loadUsers();

    // Try initial sync if online
    performInitialSync();

    // Subscribe to sync completion - auto refresh list when sync completes
    const unsubscribeSyncComplete = syncService.onSyncComplete(() => {
      console.log('Sync completed - refreshing list');
      loadUsers();
    });

    // Subscribe to network changes
    const unsubscribeNetworkChange = syncService.onNetworkChange((online) => {
      setIsOnline(online);
      if (online) {
        Toast.show({
          type: 'success',
          text1: '🌐 You are online',
          text2: 'Syncing your changes...',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: '📴 You are offline',
          text2: 'Changes will be saved locally',
          visibilityTime: 3000,
        });
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeSyncComplete();
      unsubscribeNetworkChange();
      syncService.cleanup();
    };
  }, []);

  // Perform initial sync when app starts
  const performInitialSync = async () => {
    try {
      const online = await syncService.checkConnection();
      setIsOnline(online);
      if (online) {
        await syncService.fullSync();
        await loadUsers();
      }
    } catch (error) {
      console.log('Initial sync error:', error);
    }
  };

  // Load users from local WatermelonDB
  const loadUsers = async () => {
    try {
      setLoading(true);
      const todos = await syncService.getTodos();
      const usersList: UserItem[] = todos.map((todo: Todo) => ({
        id: todo.id,
        name: todo.name,
        age: todo.age,
        isChecked: todo.isChecked,
        isSynced: todo.isSynced,
      }));
      setUsers(usersList);
    } catch (error) {
      console.log('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add Todo - works offline! Saves locally first, syncs in background
  const addTodo = async () => {
    if (!newUser.name.trim()) {
      Alert.alert('Error', 'Please enter a name.');
      return;
    }
    if (!newUser.age.trim()) {
      Alert.alert('Error', 'Please enter an age.');
      return;
    }
    if (isNaN(parseInt(newUser.age))) {
      Alert.alert('Validation Error', 'Please enter a valid age number.');
      return;
    }

    const nameToAdd = newUser.name;
    const ageToAdd = parseInt(newUser.age);

    // Clear form immediately for better UX
    setNewUser({ name: '', age: '', isChecked: false, userId: null, isEditing: false });

    try {
      // Add to local DB (instant - never blocks)
      const newTodo = await syncService.addTodo({
        name: nameToAdd,
        age: ageToAdd,
        isChecked: false,
      });

      // Add to UI immediately
      const newUserItem: UserItem = {
        id: newTodo.id,
        name: newTodo.name,
        age: newTodo.age,
        isChecked: newTodo.isChecked,
        isSynced: newTodo.isSynced,
      };

      setUsers(prevUsers => [newUserItem, ...prevUsers]);

      Toast.show({
        type: 'success',
        text1: '✅ User Added',
        text2: isOnline ? 'Syncing in background...' : 'Saved locally',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.log('Error adding user:', error);
      Toast.show({
        type: 'error',
        text1: 'Error adding user',
      });
    }
  };

  // Update User - works offline! Updates locally first, syncs in background
  const updateUser = async (userId: string) => {
    if (!userId) return;

    const nameToUpdate = newUser.name;
    const ageToUpdate = parseInt(newUser.age);

    // Clear form immediately
    setNewUser({ name: '', age: '', isChecked: false, userId: null, isEditing: false });

    // Update UI immediately
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, name: nameToUpdate, age: ageToUpdate, isSynced: false }
          : user
      )
    );

    try {
      // Update local DB (instant - never blocks)
      await syncService.updateTodo(userId, {
        name: nameToUpdate,
        age: ageToUpdate,
      });

      Toast.show({
        type: 'success',
        text1: '✅ User Updated',
        text2: isOnline ? 'Syncing in background...' : 'Saved locally',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.log('Error updating user:', error);
      await loadUsers();
      Toast.show({
        type: 'error',
        text1: 'Error updating user',
      });
    }
  };

  // Update checkbox status - works offline!
  const updateCheckboxStatus = async (userId: string, isChecked: boolean) => {
    try {
      await syncService.updateTodo(userId, { isChecked });
    } catch (error) {
      console.log('Error updating checkbox:', error);
      await loadUsers();
    }
  };

  // Delete User - works offline! Marks for deletion locally, syncs in background
  const deleteUser = async (userId: string) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          // Remove from UI immediately
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

          try {
            // Delete from local DB (instant - never blocks)
            await syncService.deleteTodo(userId);
            
            Toast.show({
              type: 'success',
              text1: '🗑️ User Deleted',
              text2: isOnline ? 'Syncing in background...' : 'Saved locally',
              visibilityTime: 2000,
            });
          } catch (error) {
            console.log('Error deleting user:', error);
            await loadUsers();
            Toast.show({
              type: 'error',
              text1: 'Error deleting user',
            });
          }
        },
      },
    ]);
  };

  // Manual sync trigger (pull to refresh)
  const onRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const online = await syncService.checkConnection();
      if (online) {
        await syncService.fullSync();
      }
      await loadUsers();
      if (!online) {
        Toast.show({
          type: 'info',
          text1: 'Offline - showing local data',
        });
      }
    } catch (error) {
      console.log('Refresh sync error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCheckboxChange = (itemId: string, newState: boolean) => {
    // Update UI immediately
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === itemId ? { ...user, isChecked: newState, isSynced: false } : user
      )
    );
    // Update in background
    updateCheckboxStatus(itemId, newState);
  };

  const handleEditUser = (user: UserItem) => {
    setNewUser({
      name: user.name,
      age: user.age ? user.age.toString() : '',
      isChecked: user.isChecked,
      userId: user.id,
      isEditing: true,
    });
  };

  const handleClearAllFields = () => {
    setNewUser({
      name: '',
      age: '',
      isChecked: false,
      userId: null,
      isEditing: false,
    });
  };

  return (
    <View style={styles.container}>
      {globalSpinner !== true ? (
        <View style={styles.subContainer}>
          <Text style={styles.heading}>Add User!</Text>
          <UserInputForm
            name={newUser.name}
            age={newUser.age}
            onNameChange={(text) => setNewUser({ ...newUser, name: text })}
            onAgeChange={(text) => setNewUser({ ...newUser, age: text })}
          />
          <ActionButtons
            isEditing={newUser.isEditing}
            onSubmit={newUser.isEditing ? () => updateUser(newUser.userId!) : addTodo}
            onClear={handleClearAllFields}
          />

          <Text style={styles.subHeading}>Your User List</Text>
          <View style={styles.tableContainer}>
            <TableHeader />
            <View style={styles.TableFlex}>
              <FlatList
                data={users}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={onRefresh}
                renderItem={({ item }) => (
                  <UserTableRow
                    item={item}
                    onCheckboxChange={handleCheckboxChange}
                    onEdit={handleEditUser}
                    onDelete={deleteUser}
                  />
                )}
                keyExtractor={(item: UserItem) => item.id}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={<ListEmptyState isLoading={loading} />}
                ListFooterComponent={<LoadingFooter isLoading={loadingMore} />}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.heading}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E3ECF1',
    },
    subContainer: { padding: 10 },
    tableContainer: {
      marginTop: 20,
      borderTopWidth: 1,
      borderColor: '#ccc',
      paddingTop: 10,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    subHeading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 10,
      textAlign: 'center',
    },
    TableFlex: {
      height: responsiveHeight(2.8),
    },
    activityContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
  });

export default HomeScreen;
