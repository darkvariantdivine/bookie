"use client";

import React, {
  createContext,
  useEffect,
  useState
} from 'react';

import {
  IRestApiResponse,
  IUser,
  IUserAuth
} from "@/constants";
import {useRouter} from "next/navigation";
import {
  loginUser,
  logoutUser
} from "@/libs/rest";
import {handleApiError} from "@/components/Errors";

const UserContext = createContext({} as any);

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  const handleLogin = async (auth: IUserAuth) => {
    let data: IRestApiResponse = await loginUser(auth);
    sessionStorage.setItem('USER', JSON.stringify(data['data']['user']));
    sessionStorage.setItem('TOKEN', data['data']['token']);
    setUser(data['data']['user']);
    setToken(data['data']['token']);
    router.push('/rooms');
    return data['data']['user'];
  }

  const handleLogout = async () => {
    try {
      await logoutUser(token as string);
    } catch (e) {
      handleApiError(e, false);
    }
    sessionStorage.removeItem('USER');
    sessionStorage.removeItem('TOKEN');
    setUser(undefined);
    setToken(undefined);
    router.push('/');
  }

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
      token,
      handleLogin, handleLogout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export {
  UserContext,
  UserContextProvider,
}