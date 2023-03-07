"use client";

import {
  Container,
  createStyles,
  Flex,
  Title
} from "@mantine/core";
import React, {useContext} from 'react';

import {IRoom} from "@/constants";
import BookingCard from "@/components/BookingCard";
import {RoomContext} from "@/contexts/RoomContext";
import NavBar from "@/components/NavBar";

const useStyle = createStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  }
});

export default function RoomsLandingPage(): React.ReactElement {
  const {classes, theme, cx} = useStyle();
  const { rooms } = useContext(RoomContext);

  return (
    <main className={classes.main}>
      <NavBar />
      <Container
        py="xl"
        size={'xl'}
      >
        <Title order={1}>Booking page</Title>
        <Flex
          py="lg"
          justify="center"
          wrap="wrap"
          gap="md"
        >
          {
            rooms.map((room: IRoom) => (
              <BookingCard key={room.id} room={room}/>
            ))
          }
        </Flex>
      </Container>
    </main>
  )
}
