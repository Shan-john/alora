import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, logout as firebaseLogout } from '../firebase/auth';
import { getDocument } from '../firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Check admin status
        try {
          const adminDoc = await getDocument('admins', firebaseUser.uid);
          if (adminDoc) {
            setIsAdmin(true);
            setAdminRole(adminDoc.role);
          } else {
            setIsAdmin(false);
            setAdminRole(null);
          }
        } catch {
          setIsAdmin(false);
          setAdminRole(null);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setAdminRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
    setIsAdmin(false);
    setAdminRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, adminRole, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
