const admin = require('firebase-admin');
require('dotenv').config();

let db;
let auth;
let bucket;
let isMock = false;

try {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  if (!serviceAccount.private_key || serviceAccount.private_key.includes('YOUR_KEY')) {
    throw new Error('Key missing or placeholder');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  db = admin.firestore();
  auth = admin.auth();
  bucket = admin.storage().bucket();
  console.log('✅ Firebase Admin initialized successfully');
} catch (err) {
  console.error('⚠️ Firebase Admin failed to initialize. Falling back to MOCK MODE.');
  isMock = true;

  // Mock Database Implementation (minimal)
  const mockSnapshot = (data) => ({
    docs: data.map(item => ({ id: item.id || Math.random().toString(36).substr(2, 9), data: () => item })),
    get: async () => mockSnapshot(data),
  });

  const mockCollection = (collectionName) => {
    const data = require('./mockData.json')[collectionName] || [];
    return {
      where: () => mockCollection(collectionName),
      orderBy: () => mockCollection(collectionName),
      limit: () => mockCollection(collectionName),
      startAfter: () => mockCollection(collectionName),
      get: async () => mockSnapshot(data),
      doc: (id) => ({
        get: async () => ({ exists: !!data.find(i => i.id === id), data: () => data.find(i => i.id === id) }),
        set: async () => ({}),
        delete: async () => ({}),
      }),
      add: async (doc) => ({ id: 'new-id' }),
    };
  };

  db = {
    collection: mockCollection,
    doc: (path) => {
      const parts = path.split('/');
      return mockCollection(parts[0]).doc(parts[1]);
    }
  };
  
  auth = {
    verifyIdToken: async () => ({ uid: 'mock-user' }),
  };
}

module.exports = { admin: isMock ? { firestore: { FieldValue: { serverTimestamp: () => new Date() } } } : admin, db, auth, bucket, isMock };
