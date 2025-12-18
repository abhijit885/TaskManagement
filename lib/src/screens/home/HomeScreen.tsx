import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../../theme/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { useThemeContext } from '../../theme/ThemeContext';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../common/responsiveFontSize';
import { useSelector } from 'react-redux';
import { rootState } from '../../redux/store';
import { truncateText } from '../../common/commonFunction';

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
    console.log('Users fetched from Firestore', users);
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
      console.log('User added!');
      Toast.show({
        type: 'success',
        text1: 'User Added',
      });
      const newUserData = {
        id: docRef.id,
        name: newUser.name,
        age: parseInt(newUser.age),
        isChecked: false,
      };
      setUsers([newUserData, ...users]);
      setNewUser({ name: '', age: '', isChecked: false });
      //getUsers();
    } catch (error) {
      console.log('Error adding user: ', error);
    }
  };

  const updateUser = async (userId: string) => {
    try {
      const updatedUser = await firestore()
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
      console.log('User updated!', updatedUser);
    } catch (error) {
      console.log('Error updating user: ', error);
    }
  };

  const updateCheckboxStatus = async (userId: string, isChecked: boolean) => {
    try {
      await firestore().collection('Todo').doc(userId).update({
        isChecked: isChecked,
      });
      console.log('Checkbox updated!');
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
            const deletedUser = await firestore()
              .collection('Todo')
              .doc(userId)
              .delete();
            console.log('User deleted!', deletedUser);
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
      let query: any = firestore().collection('Todo').limit(pageSize);
      const snapshot = await query.get();

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
        setUsers(prev => [...prev, ...moreUsers]); // Append new users
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

  const handleCheckboxChange = (itemId: any) => {
    const updatedUsers = users.map(user =>
      user.id === itemId ? { ...user, isChecked: !user.isChecked } : user,
    );
    setUsers(updatedUsers);
  };

  const handleEditUser = (user: any) => {
    setNewUser({
      name: user.name,
      age: user.age ? user.age.toString() : '',
      userId: user.id,
      isEditing: true,
    });
  };

  const handelClearAllFields = () => {
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
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newUser.name}
            onChangeText={text => setNewUser({ ...newUser, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={newUser.age}
            keyboardType="numeric"
            onChangeText={text => setNewUser({ ...newUser, age: text })}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={
                newUser.isEditing ? () => updateUser(newUser.userId) : addTodo
              }
            >
              <Text style={styles.buttonTextLogin}>
                {newUser.isEditing ? 'Update User' : 'Add User'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={handelClearAllFields}
            >
              <Text style={styles.buttonTextLogin}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subHeading}>Your User List</Text>
          {/* Users Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText2}>Select</Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { marginLeft: responsiveWidth(-25) },
                ]}
              >
                Name
              </Text>
              <Text style={styles.tableHeaderText}>Age</Text>
              <Text style={styles.tableHeaderText2}>Edit</Text>
              <Text style={styles.tableHeaderText2}>Delete</Text>
            </View>
            <View style={styles.TableFlex}>
              <FlatList
                data={users}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }: any) => (
                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor: item.isChecked ? '#D3F9D8' : '#E3ECF8',
                      },
                    ]}
                  >
                    <View style={styles.checkBoxContainer}>
                      <CheckBox
                        value={item.isChecked}
                        onValueChange={() => {
                          const newCheckedState = !item.isChecked;
                          handleCheckboxChange(item.id);
                          updateCheckboxStatus(item.id, newCheckedState);
                        }}
                        onCheckColor={Colors.blue}
                        lineWidth={2}
                        boxType="square"
                        style={[
                          {
                            marginRight: 5,
                            marginLeft: -4,
                            borderColor: 'red',
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.userNameStyle}>
                      <Text style={[styles.tableCell]}>
                        {truncateText(item?.name, 5)}
                      </Text>
                    </View>
                    <Text style={styles.width10Pix}>{item?.age}</Text>
                    <TouchableOpacity
                      onPress={() => handleEditUser(item)}
                      style={styles.width10Pix}
                    >
                      <MaterialIcons name="edit" size={30} color="#092E75" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteUser(item?.id)}
                      style={styles.width10Pix}
                    >
                      <MaterialIcons name="delete" size={30} color="#092E75" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item: any) => item.id}
                onEndReached={() => loadMoreUsers()}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  loading ? (
                    <View style={styles.listEmptyContainer}>
                      <ActivityIndicator size="large" color="#092E75" />
                      <Text style={styles.loadingText}>Loading todos...</Text>
                    </View>
                  ) : (
                    <View style={styles.listEmptyContainer}>
                      <Text>No todos found</Text>
                    </View>
                  )
                }
                ListFooterComponent={
                  loadingMore ? (
                    <View style={styles.listFooterContainer}>
                      <ActivityIndicator size="small" color="#092E75" />
                      <Text style={styles.listFooterText}>Loading more...</Text>
                    </View>
                  ) : null
                }
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    checkBoxContainer: { width: '20%', alignItems: 'center' },
    tableContainer: {
      marginTop: 20,
      borderTopWidth: 1,
      borderColor: '#ccc',
      paddingTop: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    tableHeaderText: {
      fontWeight: 'bold',
      fontSize: 16,
      width: '20%',
      textAlign: 'center',
    },
    tableHeaderText2: {
      fontWeight: 'bold',
      fontSize: 16,
      width: '15%',
      textAlign: 'center',
    },
    userNameStyle: { width: '20%', marginLeft: responsiveWidth(-10) },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    tableCell: {
      fontSize: 14,
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 12,
      paddingLeft: 10,
      borderRadius: 5,
    },
    buttonLogin: {
      backgroundColor: theme !== 'dark' ? Colors.primary : Colors.secondary,
      padding: 10,
      borderRadius: 5,
      width: '48%',
    },
    buttonTextLogin: {
      color: theme !== 'dark' ? Colors.secondary : Colors.primary,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
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
    width10Pix: { width: '10%' },
    listEmptyContainer: { alignItems: 'center', marginTop: 20 },
    loadingText: { marginTop: 10 },
    listFooterContainer: { alignItems: 'center', paddingVertical: 15 },
    listFooterText: { marginTop: 8, fontSize: 12 },
    activityContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
  });

export default HomeScreen;
