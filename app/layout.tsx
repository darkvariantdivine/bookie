'use client';

import './globals.css'
import {MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {NotificationsProvider} from "@mantine/notifications";
import React from "react";

import {UserContextProvider} from "@/contexts/UserContext";
import {RoomContextProvider} from "@/contexts/RoomContext";
import {BookingContextProvider} from "@/contexts/BookingContext";

export const metadata = {
  title: "Bookie",
  description: "Organising your workplace",
  icons: {
    icon: "/favicon.ico"
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        <MantineProvider
          withCSSVariables
          withNormalizeCSS
        >
          <UserContextProvider>
            <RoomContextProvider>
              <BookingContextProvider>
                <NotificationsProvider>
                  <ModalsProvider>
                    {children}
                  </ModalsProvider>
                </NotificationsProvider>
              </BookingContextProvider>
            </RoomContextProvider>
          </UserContextProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
