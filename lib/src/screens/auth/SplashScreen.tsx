import React, { useEffect } from 'react';
import { View, StyleSheet, Image, SafeAreaViewBase, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveWidth } from '../../common/responsiveFontSize';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
      <View style={styles.container}>
        <Text style={{fontSize:responsiveWidth(10),fontWeight:'500'}}>Welcome Back</Text>
      </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',  
  },
  splashImage: {
    height: 80,
    width: responsiveWidth(1.5),
    alignSelf: 'center',
    marginBottom: 5,
  },
});
