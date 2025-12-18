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
  const { theme, colors } = useThemeContext();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
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
  // ✅ Load stored credentials
  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');

      setIsFirstTime(!storedEmail);

      if (parsedData) {
        //const { email, password } = JSON.parse(storedCredentials);
        // setValue('email', parsedData?.email);
        //setValue('password', parsedData?.password);
        setRememberMe(true);
      }
    };

    checkStoredCredentials();
  }, [parsedData]);
  const handleSignUp = async () => {
    setValidate(true);
    if (data.email && data.password && emailRegex.test(data.email)) {
      let resp = await dispatch(
        signUpUser({ email: data.email, password: data.password }),
      );
      if (resp?.meta?.requestStatus === 'fulfilled') {
        setData({ email: '', password: '' });
        setValidate(false);
      }
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignIn = async () => {
    setValidate(true);
    if (data.email && data.password && emailRegex.test(data.email)) {
      let resp = await dispatch(
        signInUser({ email: data.email, password: data.password }),
      );
      if (resp?.meta?.requestStatus === 'fulfilled') {
        Toast.show({
          type: 'type',
          text1: 'text1',
          text2: 'text2',
        });
        setData({ email: '', password: '' });
        setValidate(false);
      }
    }

    // try {
    //   const user: any = await login(email, password);
    //   console.log('User Login:', user);
    //   setSession(user.uid); // Save user session
    //   navigation.navigate('Home');
    // } catch (err) {
    //   console.log('Error:', err);
    //   setError('Sign in failed. Please check your credentials.');
    // }
  };
  // const onSubmit = async (data: LoginFormData) => {
  //   setError('');
  //   try {
  //     setLoading(true);
  //     let response;

  //       // 👈 Login flow
  //       response = await loginUser({
  //         email: data.email,
  //         password: data.password || '',
  //         platform_type: 'app',
  //       });
  //       dispatch(
  //         setRememberMeCookies(
  //           JSON.stringify({
  //             email: data.email,
  //             password: data.password,
  //           }),
  //         ),
  //       ); // Update Redux store

  //     if (response?.statusCode === 200) {
  //       dispatch(setProfile(null));
  //       // ✅ Remember Me for login only
  //       if (!isActivateMode) {
  //         if (rememberMe) {
  //           await AsyncStorage.setItem(
  //             'rememberMeData',
  //             JSON.stringify({
  //               email: data.email,
  //               password: data.password || '',
  //             }),
  //           );
  //         } else {
  //           await AsyncStorage.removeItem('rememberMeData');
  //         }
  //       }

  //       console.log(response?.data);
  //       await AsyncStorage.setItem('userEmail', data.email);

  //       // Navigate depending on flow
  //       navigation.navigate('Otp', {
  //         email: data.email,
  //         isFrom: isActivateMode ? 'account_activation' : 'login',
  //         otp: response?.data?.otp,
  //         isActive: response?.data?.is_active,
  //       });
  //     } else {
  //       console.log(response);
  //     }
  //   } catch (error2: any) {
  //     console.log('error');
  //     // Alert.alert(
  //     //   t('errors.error'),
  //     //   error?.message || t('errors.somethingWrong'),
  //     // );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
      borderColor: '#092E75',
      borderWidth: 2,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonTextLogin: {
      color: '#092E75',
      textAlign: 'center',
    },
    buttonSignUp: {
      backgroundColor: '#092E75',
      borderWidth: 2,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonTextSignUp: {
      color: '#fff',
      textAlign: 'center',
    },
    TextInputRequired: {
      color: 'red',
      fontSize: responsiveHeight(60),
      marginBottom: 10,
      //backgroundColor:'#eafa',
    },
  });
