"use client";

import React, {
  createContext,
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

const UserContext = createContext({});

function UserContextProvider({ children }) {
  const router = useRouter();

  let prevUser: string | null = sessionStorage.getItem('USER');
  let prevToken: string | null = sessionStorage.getItem('TOKEN');
  const [user, setUser] = useState<IUser | undefined>(
    prevUser !== null ? JSON.parse(prevUser) : undefined
  );
  const [token, setToken] = useState<string | undefined>(
    prevToken !== null ? prevToken : undefined
  );

  const handleLogin: Promise<IUser> = async (auth: IUserAuth) => {
    let data: IRestApiResponse = await loginUser(auth);
    sessionStorage.setItem('USER', JSON.stringify(data['data']['user']));
    sessionStorage.setItem('TOKEN', data['data']['token']);
    setUser(data['data']['user']);
    setToken(data['data']['token']);
    router.push('/rooms');
    return data['data']['user'];
  }

  const handleLogout = async () => {
    await logoutUser(token as string);
    sessionStorage.removeItem('USER');
    sessionStorage.removeItem('TOKEN');
    setUser(undefined);
    setToken(undefined);
    router.push('/');
  }

  return (
    <UserContext.Provider value={{
      user, setUser, handleLogin, handleLogout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export {
  UserContext,
  UserContextProvider,
}