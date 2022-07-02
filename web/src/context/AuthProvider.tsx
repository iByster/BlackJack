import { createContext, useContext, useState } from 'react';

export interface IUserProfile {
  name: string;
  id: number;
  roomId: number;
  gameActive: boolean;
}

interface IAuthContext {
  userProfile: Partial<IUserProfile>;
  login(userProfile: IUserProfile | {}): void;
  logout(): void;
}

export const AuthContext = createContext<Partial<IAuthContext>>({});

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthContextProviderInterface {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderInterface> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<IUserProfile | undefined>(
    undefined
  );

  function login(userProfile: IUserProfile) {
    setUserProfile(userProfile);
    localStorage.setItem('user', JSON.stringify(userProfile));
  }

  function logout() {
    setUserProfile(undefined);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
