import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
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

const HomeScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const [newUser, setNewUser]: any = useState({
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

  useEffect(() => {
    getUsers();
  }, []);

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
    try {
      const docRef = await firestore()
        .collection('Todo')
        .add({
          name: newUser.name,
          age: parseInt(newUser.age),
          isChecked: false,
        });
      Toast.show({
        type: 'success',
        text1: 'User Added',
      });
      setUsers([{ id: docRef.id, name: newUser.name, age: parseInt(newUser.age), isChecked: false }, ...users]);
      setNewUser({ name: '', age: '', isChecked: false });
    } catch (error) {
      console.log('Error adding user: ', error);
    }
  };

  const updateUser = async (userId: string) => {
    try {
      await firestore()
        .collection('Todo')
        .doc(userId)
        .update({
          name: newUser.name,
          age: parseInt(newUser.age),
        });
      getUsers();
      Toast.show({
        type: 'success',
        text1: 'User Updated',
      });
    } catch (error) {
      console.log('Error updating user: ', error);
    }
  };

  const updateCheckboxStatus = async (userId: string, isChecked: boolean) => {
    try {
      await firestore().collection('Todo').doc(userId).update({
        isChecked: isChecked,
      });
      getUsers();
    } catch (error) {
      console.log('Error updating checkbox: ', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await firestore()
              .collection('Todo')
              .doc(userId)
              .delete();
            getUsers();
            Toast.show({
              type: 'success',
              text1: 'User Deleted',
            });
          },
        },
      ]);
    } catch (error) {
      console.log('Error deleting user: ', error);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await firestore().collection('Todo').limit(pageSize).get();

      if (snapshot.docs.length > 0) {
        const usersList: any = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === pageSize);
      } else {
        setUsers([]);
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error getting users: ', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = async () => {
    if (!hasMore || loadingMore || lastDoc === null) return;

    try {
      setLoadingMore(true);
      const snapshot = await firestore()
        .collection('Todo')
        .startAfter(lastDoc)
        .limit(pageSize)
        .get();

      if (snapshot.docs.length > 0) {
        const moreUsers: any = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(prev => [...prev, ...moreUsers]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === pageSize);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Error loading more users: ', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCheckboxChange = (itemId: string, newState: boolean) => {
    const updatedUsers = users.map(user =>
      user.id === itemId ? { ...user, isChecked: newState } : user,
    );
    setUsers(updatedUsers);
    updateCheckboxStatus(itemId, newState);
  };

  const handleEditUser = (user: any) => {
    setNewUser({
      name: user.name,
      age: user.age ? user.age.toString() : '',
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
            onSubmit={newUser.isEditing ? () => updateUser(newUser.userId) : addTodo}
            onClear={handleClearAllFields}
          />

          <Text style={styles.subHeading}>Your User List</Text>
          <View style={styles.tableContainer}>
            <TableHeader />
            <View style={styles.TableFlex}>
              <FlatList
                data={users}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <UserTableRow
                    item={item}
                    onCheckboxChange={handleCheckboxChange}
                    onEdit={handleEditUser}
                    onDelete={deleteUser}
                  />
                )}
                keyExtractor={(item: any) => item.id}
                onEndReached={() => loadMoreUsers()}
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