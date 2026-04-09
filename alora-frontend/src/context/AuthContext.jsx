import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'alora2024';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('alora_admin_logged_in') === 'true';
  });
  const [loading] = useState(false);

  const adminLogin = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('alora_admin_logged_in', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('alora_admin_logged_in');
  };

  return (
    <AuthContext.Provider value={{ user: isAdmin ? { displayName: 'Admin' } : null, isAdmin, adminRole: isAdmin ? 'owner' : null, loading, logout, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
