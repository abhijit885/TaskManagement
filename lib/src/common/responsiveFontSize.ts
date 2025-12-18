import { Dimensions, } from 'react-native';

export const responsiveHeight = (height: any) => {
  return Dimensions.get('window').height / height;
};

export const responsiveWidth = (width: any) => {
  return Dimensions.get('window').width / width;
};