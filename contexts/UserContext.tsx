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
import {loginUser, logoutUser} from "@/libs/rest";

const UserContext = createContext({});

function UserContextProvider({ children }) {
  const router = useRouter();

  let prevUser: string | null = sessionStorage.getItem('USER');
  let prevToken: string | null = sessionStorage.getItem('TOKEN');
  const [user, setUser] = useState<IUser | undefined>(
    prevUser !== null ? JSON.parse(prevUser) : undefined
  );
  const [token, setToken] = useState<string | undefined>(
    prevToken !== null ? JSON.parse(prevToken) : undefined
  );

  const handleLogin = async (auth: UserAuth) => {
    let data: RestApiResponse = await loginUser(auth);
    if (data.status < 300) {
      sessionStorage.setItem('USER', JSON.stringify(data['data']['user']));
      sessionStorage.setItem('TOKEN', data['data']['token']);
      setUser(user);
      setToken(token);
      router.push('/rooms');
    }
  }

  const handleLogout = async () => {
    let data: RestApiResponse = await logoutUser(token as string);
    if (data.status < 300) {
      sessionStorage.removeItem('USER');
      sessionStorage.removeItem('TOKEN');
      setUser(undefined);
      setToken(undefined);
      router.push('/');
    }
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