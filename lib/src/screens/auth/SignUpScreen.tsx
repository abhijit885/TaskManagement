import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../redux/reduxHooks';
import { useThemeContext } from '../../theme/ThemeContext';
import { useSelector } from 'react-redux';
import {
  responsiveHeight,
} from '../../common/responsiveFontSize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUpUser } from '../../redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import { textFields } from '../../types/task';

const SignUpScreen = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { theme, colors } = useThemeContext();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const isCheckedVal = useSelector(
    (state: any) => state?.profile?.rememberMeData,
  );
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [data, setData] = useState<textFields>({ email: '', password: '' });
  const [validate, setValidate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setValidate(true);
    if (data.email && data.password && emailRegex.test(data.email)) {
      let resp = await dispatch(
        signUpUser({ email: data.email, password: data.password }),
      );
      if (resp?.meta?.requestStatus === 'fulfilled') {
        Toast.show({
          type: 'success',
          text1: 'Sign Up Successfully',
        });
        navigation.navigate('Login');
        setData({ email: '', password: '' });
        setValidate(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Task Manager</Text>
        <Text style={styles.header}>Please SignUp!</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={data.email}
          onChangeText={text => setData({ ...data, email: text })}
          keyboardType="email-address"
          placeholderTextColor={'#000'}
        />
        {validate && data.email === '' && (
          <Text style={styles.TextInputRequired}>
            Please enter your email address
          </Text>
        )}
        {validate && data.email !== '' && !emailRegex.test(data.email) && (
          <Text style={styles.TextInputRequired}>
            Please enter valid email address
          </Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={data.password}
          onChangeText={text => setData({ ...data, password: text })}
          placeholderTextColor={'#000'}
          secureTextEntry
        />
        {validate && data.password === '' && (
          <Text style={styles.TextInputRequired}>
            Please enter your password
          </Text>
        )}
        <TouchableOpacity
          style={styles.buttonSignUp}
          onPress={
            () => handleSignUp()
          }
        >
          <Text style={styles.buttonTextSignUp}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonTextLogin}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const createStyles = (theme: string) =>
  StyleSheet.create({
    safeArea:{ flex: 1, backgroundColor: '#fff' },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 12,
      paddingLeft: 10,
      borderRadius: 5,
    },
    errorText: {
      color: 'red',
      marginBottom: 12,
      textAlign: 'center',
    },
    footer: {
      marginTop: 16,
      textAlign: 'center',
    },
    link: {
      color: '#092E75',
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
    buttonLogin: {
      borderColor: theme !== 'dark' ? Colors.primary : Colors.secondary,
      borderWidth: 2,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonTextLogin: {
      color:  Colors.primary,
      textAlign: 'center',
    },
    buttonSignUp: {
      backgroundColor: theme !== 'dark' ? Colors.primary : Colors.secondary,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonTextSignUp: {
      color: theme !== 'dark' ? Colors.background : Colors.primary,
      textAlign: 'center',
    },
    TextInputRequired: {
      color: 'red',
      fontSize: responsiveHeight(60),
      marginBottom: 10,
    },
  });
