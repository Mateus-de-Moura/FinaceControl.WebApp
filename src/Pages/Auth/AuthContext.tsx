import { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tokenJwt: string;
  refreshToken: string;
  username: string;
  photo: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  updatePhoto: (newPhotoBase64: string) => void;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('loginData');
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return user !== null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('loginData', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('loginData');
      setIsAuthenticated(false);
    }
  }, [user]);


  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loginData');
    setIsAuthenticated(false);
  };

  const updatePhoto = (newPhoto: string) => {
    if (user) {
      const updatedUser = { ...user, photo: newPhoto };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updatePhoto, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
