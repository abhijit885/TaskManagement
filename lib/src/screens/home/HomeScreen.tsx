import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
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

const HomeScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10; // Items per page
  const [newUser, setNewUser]: any = useState({
    name: '',
    age: '',
    city: '',
    isChecked: false,
    userId: null, // Store the ID of the user being edited
    isEditing: false,
  });
  const { theme, colors } = useThemeContext();
  const globalSpinner: any = useSelector<any>(
    (state: rootState) => state.user.globalLoading,
  );
  const styles = useMemo(() => createStyles(theme, colors), [theme, colors]);

  useEffect(() => {
    getUsers();
    console.log('Users fetched from Firestore', users);
  }, []);
  const addTodo = async () => {
    // Validation: Check if all fields are filled
    if (!newUser.name.trim()) {
      Alert.alert('Error', 'Please enter a name.');
      return;
    }
    if (!newUser.age.trim()) {
      Alert.alert('Error', 'Please enter an age.');
      return;
    }
    if (!newUser.city.trim()) {
      Alert.alert('Error', 'Please enter a city.');
      return;
    }

    // Validate age is a valid number
    if (isNaN(parseInt(newUser.age))) {
      Alert.alert('Validation Error', 'Please enter a valid age number.');
      return;
    }

    try {
      await firestore()
        .collection('Todo')
        .add({
          name: newUser.name,
          age: parseInt(newUser.age),
          city: newUser.city,
          isChecked: false,
        });
      console.log('User added!');
      Toast.show({
        type: 'success', // You can choose from 'success', 'error', or 'info'
        position: 'top', // 'top' or 'bottom'
        text1: 'Hello!',
        text2: 'This is a toast message.',
        visibilityTime: 3000, // Duration of the toast
      });
      setNewUser({ name: '', age: '', city: '', isChecked: false }); // Reset input fields
      getUsers(); // Refresh user list
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
          city: newUser.city,
        });
        getUsers();
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
      getUsers(); // Refresh user list
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
            getUsers(); // Refresh user list
          },
        },
      ]);
    } catch (error) {
      console.log('Error deleting user: ', error);
    }
  };

  // Get Users function to fetch data from Firestore with pagination
  const getUsers = async () => {
    try {
      setLoading(true);
      let query: any = firestore().collection('Todo').limit(pageSize);
      const snapshot = await query.get();

      if (snapshot.docs.length > 0) {
        const usersList: any = snapshot.docs.map((doc:any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]); // Store last doc for next page
        setHasMore(snapshot.docs.length === pageSize); // If less than pageSize, no more data
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

  // Load more data function for pagination
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

  // Handle checkbox state for a specific item
  const handleCheckboxChange = (itemId: any) => {
    const updatedUsers = users.map(user =>
      user.id === itemId ? { ...user, isChecked: !user.isChecked } : user,
    );
    setUsers(updatedUsers);
  };

  // Fill TextFields with user data on icon click
  const handleEditUser = (user: any) => {
    setNewUser({
      name: user.name,
      age: user.age ? user.age.toString() : '',
      city: user.city,
      userId: user.id,
      isEditing: true,
    });
  };
  const handelClearAllFields = () => {
    setNewUser({
      name: '',
      age: '',
      city: '',
      isChecked: false,
      userId: null,
      isEditing: false,
    });
  };
  return (
    <View style={styles.container}>
      {globalSpinner !== true ? (
        <View style={{ padding: 10 }}>
          <Text style={styles.heading}>Add Your Wish!</Text>
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
          <TextInput
            style={styles.input}
            placeholder="City"
            value={newUser.city}
            onChangeText={text => setNewUser({ ...newUser, city: text })}
          />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={
                newUser.isEditing ? () => updateUser(newUser.userId) : addTodo
              }
            >
              <Text style={styles.buttonTextLogin}>
                {newUser.isEditing ? 'Update Todo' : 'Add Todo'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={handelClearAllFields}
            >
              <Text style={styles.buttonTextLogin}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subHeading}>Your Todo List</Text>
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
                    <View style={{ width: '20%', alignItems: 'center' }}>
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
                    <View
                      style={{ width: '20%', marginLeft: responsiveWidth(-10) }}
                    >
                      <Text style={[styles.tableCell]}>{item?.name}</Text>
                    </View>
                    <Text style={{ width: '10%' }}>{item?.age}</Text>
                    <TouchableOpacity
                      onPress={() => handleEditUser(item)}
                      style={{ width: '10%' }}
                    >
                      <MaterialIcons name="edit" size={30} color="#092E75" />
                    </TouchableOpacity>{' '}
                    <TouchableOpacity
                      onPress={() => deleteUser(item?.id)}
                      style={{ width: '10%' }}
                    >
                      <MaterialIcons name="delete" size={30} color="#092E75" />
                    </TouchableOpacity>{' '}
                  </View>
                )}
                keyExtractor={(item: any) => item.id}
                onEndReached={() => loadMoreUsers()}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  loading ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                      <ActivityIndicator size="large" color="#092E75" />
                      <Text style={{ marginTop: 10 }}>Loading todos...</Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                      <Text>No todos found</Text>
                    </View>
                  )
                }
                ListFooterComponent={
                  loadingMore ? (
                    <View style={{ alignItems: 'center', paddingVertical: 15 }}>
                      <ActivityIndicator size="small" color="#092E75" />
                      <Text style={{ marginTop: 8, fontSize: 12 }}>
                        Loading more...
                      </Text>
                    </View>
                  ) : null
                }
              />
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: '#fff' }}
        >
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.heading}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: string, colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E3ECF1',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
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
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc'
    },
    tableCell: {
      fontSize: 14,
      //width: '20%',
      //textAlign: 'center',
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
      //backgroundColor: theme !== 'dark' ? colors.primary : colors.secondary,
    },
  });

export default HomeScreen;
