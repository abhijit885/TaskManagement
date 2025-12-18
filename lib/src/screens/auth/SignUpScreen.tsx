import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  SafeAreaViewBase,
  Text,
  TextInput,
  Button,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { typography } from '../../theme/typography';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../redux/reduxHooks';
import {
  setProfile,
  setRememberMeCookies,
} from '../../redux/slices/profileSlice';
import { useThemeContext } from '../../theme/ThemeContext';
import { useSelector } from 'react-redux';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../common/responsiveFontSize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setSession } from '../../services/storageService';
import { login, signUp } from '../../services/authService';
import { signInUser, signUpUser } from '../../redux/slices/authSlice';
import Toast from 'react-native-toast-message';

type LoginFormData = {
  email: string;
  password?: string;
};

const SignUpScreen = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { theme, colors } = useThemeContext();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isActivateMode, setIsActivateMode] = useState(false);
  const isCheckedVal = useSelector(
    (state: any) => state?.profile?.rememberMeData,
  );
  const styles = useMemo(() => createStyles(theme), [theme]);
  const parsedData = JSON.parse(isCheckedVal);
  interface textFields {
    email: string;
    password?: any;
  }
  const [data, setData] = useState<textFields>({ email: '', password: '' });
  const [validate, setValidate] = useState<boolean>(false);
  const [visibleEye, setVisibleEye] = useState(true);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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

        {/* <Button title="Sign Up" onPress={handleSignUp} /> */}
        <TouchableOpacity
          style={styles.buttonSignUp}
          onPress={
            () => handleSignUp()
            //dispatch(signUpUser({ email: data.email, password: data.password }))
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
        {/* <Button
          title="Login"
          onPress={() =>
            dispatch(signInUser({ email: email, password: password }))
          }
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const createStyles = (theme: string) =>
  StyleSheet.create({
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
      color: theme !== 'dark' ? Colors.background : Colors.primary,
      textAlign: 'center',
    },
    buttonSignUp: {
      backgroundColor: theme !== 'dark' ? Colors.primary : Colors.secondary,
      //borderWidth: 2,
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
      //backgroundColor:'#eafa',
    },
  });
