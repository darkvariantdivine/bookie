'use client';

import './globals.css'
import {MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {NotificationsProvider} from "@mantine/notifications";
import React from "react";

import {BookingContextProvider} from "@/contexts/BookingContext";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {UserContextProvider} from "@/contexts/UserContext";

export const metadata = {
  title: "Bookie",
  description: "Organising your workplace",
  icons: {
    icon: "/favicon.ico"
  }
}

let queryClient: QueryClient = new QueryClient();

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
          <QueryClientProvider client={queryClient}>
            <UserContextProvider>
              <BookingContextProvider>
                <NotificationsProvider>
                  <ModalsProvider>
                    {children}
                  </ModalsProvider>
                </NotificationsProvider>
              </BookingContextProvider>
            </UserContextProvider>
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
