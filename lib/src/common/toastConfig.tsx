import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import Colors from '../theme/colors'

/*
  1. Create the config
*/
export const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props: any) => (
        <BaseToast
            {...props}
            text1NumberOfLines={30}
            style={{ borderLeftColor: '#69C779', height: 'auto', flex: 1, paddingVertical: 15, }}
            contentContainerStyle={{ flex: 1 }}
            text1Style={{ color: Colors.blue }}
            text2Props={{ color: Colors.blue }}
        />
    ),

    error: (props: any) => (
        <ErrorToast

            {...props}
            style={{ borderLeftColor: '#FE6301', height: 'auto', flex: 1, paddingVertical: 15, }}
            contentContainerStyle={{ flex: 1 }}
            text1Style={{ color: Colors.blue }}
            text2Props={{ color: Colors.blue }}
            text1NumberOfLines={30}

        />
    ),
}
