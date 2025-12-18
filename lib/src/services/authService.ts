import { auth } from '../firebase/config';

export const signUp = async (email: string, password: string) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (error: any) {
    console.log("Error:", error);
    throw new Error(error.message);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    console.log("User Credential:", userCredential);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await auth().signOut();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
