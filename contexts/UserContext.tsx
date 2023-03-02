"use client";

import React, {
  createContext,
  useState
} from 'react';

import {User} from "@/constants";
import {useRouter} from "next/navigation";

const UserContext = createContext({});

function UserContextProvider({ children }) {
  const router = useRouter();

  let prevUser: string | null = sessionStorage.getItem('USER');
  const [user, setUser] = useState<User | undefined>(prevUser !== null ? JSON.parse(prevUser) : undefined);

  function updateUser(user: User | undefined) {
    if (!user) {
      sessionStorage.removeItem('USER');
      router.push('/');
    } else {
      sessionStorage.setItem('USER', JSON.stringify(user));
      router.push('/rooms');
    }
    setUser(user);
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export {
  UserContext,
  UserContextProvider,
}