import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../redux/reduxHooks';
import { useThemeContext } from '../../theme/ThemeContext';
import { useSelector } from 'react-redux';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../common/responsiveFontSize';
import { signInUser, signUpUser } from '../../redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import { textFields } from '../../types/task';

const LoginScreen = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { theme, colors } = useThemeContext();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const isCheckedVal = useSelector(
    (state: any) => state?.profile?.rememberMeData,
  );
  const styles = useMemo(() => createStyles(theme), [theme, colors]);
  const parsedData = JSON.parse(isCheckedVal);
  const [data, setData] = useState<textFields>({ email: '', password: '' });
  const [validate, setValidate] = useState<boolean>(false);
  const [visibleEye, setVisibleEye] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
    };
    checkStoredCredentials();
  }, [parsedData]);

  const managePasswordVisibility = () => {
    setVisibleEye(!visibleEye);
    Keyboard.dismiss();
  };

  const handleSignIn = async () => {
    setValidate(true);
    if (data.email && data.password && emailRegex.test(data.email)) {
      let resp = await dispatch(
        signInUser({ email: data.email, password: data.password }),
      );
      if (resp?.meta?.requestStatus === 'fulfilled') {
        setData({ email: '', password: '' });
        setValidate(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Task Manager</Text>
      <Text style={styles.header}>Please Login!</Text>
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
      <View style={[styles.enterPassCont]}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={data.password}
          onChangeText={text => setData({ ...data, password: text })}
          placeholderTextColor={'#000'}
          secureTextEntry={!visibleEye}
        />
        <TouchableOpacity
          onPress={() => {
            managePasswordVisibility();
          }}
          style={styles.passEyeIconContainer}
        >
          <Ionicons
            name={!visibleEye ? 'eye-off-outline' : 'eye-outline'}
            color={Colors.primary}
            size={responsiveWidth(16)}
          />
        </TouchableOpacity>
      </View>
      {validate && data.password === '' && (
        <Text style={styles.TextInputRequired}>Please enter your password</Text>
      )}
      <TouchableOpacity style={styles.buttonLogin} onPress={handleSignIn}>
        <Text style={styles.buttonTextLogin}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSignUp}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonTextSignUp}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>
        Don't have an account?
        <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

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
      width: '100%',
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
      backgroundColor: theme !== 'dark' ? Colors.primary : Colors.secondary,
      padding: 10,
      borderRadius: 5,
    },
    buttonTextLogin: {
      color: theme !== 'dark' ? Colors.background : Colors.primary,
      textAlign: 'center',
    },
    buttonSignUp: {
      borderColor: theme !== 'dark' ? Colors.primary : Colors.secondary,
      borderWidth: 2,
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonTextSignUp: {
      color: '#092E75',
      textAlign: 'center',
    },
    TextInputRequired: {
      color: 'red',
      fontSize: responsiveHeight(60),
      marginBottom: 10,
    },
    enterPassCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: '#D7DDEB',
      borderRadius: 10,
      marginBottom: 5,
      marginTop: 4,
    },
    passEyeIconContainer: {
      position: 'absolute',
      right: responsiveWidth(30),
      top: responsiveWidth(33),
    },
  });
