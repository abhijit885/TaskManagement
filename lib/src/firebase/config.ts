import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//import Config from 'react-native-config';

const apiKey = `cncnncncnc`; // Replace with your actual API key
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: '<Your-Auth-Domain>',
  projectId: '<Your-Project-ID>',
  storageBucket: '<Your-Storage-Bucket>',
  messagingSenderId: '<Your-Messaging-Sender-ID>',
  appId: '<Your-App-ID>',
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

export { auth, firestore };
