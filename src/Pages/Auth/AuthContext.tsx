import { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  photo: string; 
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  updatePhoto: (newPhotoBase64: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('loginData');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('loginData', JSON.stringify(user));
    }
  }, [user]);

  const updatePhoto = (newPhoto: string) => {
    if (!user) return;
    const updatedUser = { ...user, photo: newPhoto };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updatePhoto }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
