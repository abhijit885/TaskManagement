import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//import Config from 'react-native-config';

const firebaseConfig = {
  apiKey: 'AIzaSyD1_1OqCfa9cI5uHocqRVlMd8quHhxzHVE',
  authDomain: 'task-management-150f7.firebaseapp.com',
  projectId: 'task-management-150f7',
  storageBucket: 'task-management-150f7.firebasestorage.app',
  messagingSenderId: '80202691532',
  appId: '1:80202691532:android:080ce69b97d7957a382369',
};

const firebaseApp = initializeApp(firebaseConfig);

export { auth, firestore };
