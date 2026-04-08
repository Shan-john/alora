import { firestore } from './config';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

export const getDocument = async (collectionName, docId) => {
  const docRef = doc(firestore, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getCollection = async (collectionName, constraints = []) => {
  const q = query(collection(firestore, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToCollection = (collectionName, constraints = [], callback) => {
  const q = query(collection(firestore, collectionName), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = doc(firestore, collectionName, docId);
  return onSnapshot(docRef, (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
};

export { where, orderBy, limit };
