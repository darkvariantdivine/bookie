"use client";

import React, {
  createContext,
  useEffect,
  useState
} from 'react';

import {IUser} from "@/constants";

const UserContext = createContext({} as any);

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(
    () => {
      let prevUser: string | null = sessionStorage.getItem('USER');
      let prevToken: string | null = sessionStorage.getItem('TOKEN');
      setUser(prevUser !== null ? JSON.parse(prevUser) : undefined);
      setToken(prevToken !== null ? prevToken : undefined);
    },
    []
  );

  return (
    <UserContext.Provider value={{
      user, setUser,
      token, setToken
    }}>
      {children}
    </UserContext.Provider>
  );
}

export {
  UserContext,
  UserContextProvider,
}