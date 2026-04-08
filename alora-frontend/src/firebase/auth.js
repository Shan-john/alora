import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  return result;
};

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const logout = () => signOut(auth);

export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
