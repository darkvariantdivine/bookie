"use client";

import React, {
  createContext,
  useEffect,
  useState
} from 'react';
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

import {IUser} from "@/constants";
import {API} from "@/libs/rest";

const UserContext = createContext({} as any);

interface LogoutProps {
  token?: string
}

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  const router = useRouter();

  const handleLogout = () => {
    console.log(`Successfully logged out user ${user!.name}`);
    sessionStorage.removeItem('USER');
    sessionStorage.removeItem('TOKEN');
    setUser(undefined);
    setToken(undefined);
    router.push('/')
  }

  const {mutate: logout} = useMutation({
    mutationFn: ({token}: LogoutProps) => API.delete(
      `/login`,
      {headers: {Authorization: `Bearer ${token}`}}
    ).then(() => null),
    onSuccess: () => handleLogout(),
    onError: () => handleLogout()
  })

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
      token, setToken,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export {
  UserContext,
  UserContextProvider,
}