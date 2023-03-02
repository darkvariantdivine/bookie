"use client";

import React, {createContext, useState} from 'react';
import {User} from "@/constants";
import {useRouter} from "next/navigation";

const UserContext = createContext({});

function UserContextProvider({ children }) {
  let prevUser: string | null = window.sessionStorage.getItem('USER')
  const [user, setUser] = useState(prevUser !== null ? JSON.parse(prevUser) : undefined);
  const router = useRouter();

  function updateUser(user: User | undefined) {
    if (!user) {
      window.sessionStorage.removeItem('USER');
      router.push('/');
    } else {
      window.sessionStorage.setItem('USER', JSON.stringify(user));
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