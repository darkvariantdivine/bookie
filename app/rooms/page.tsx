"use client";

import {
  Container,
  createStyles,
  Flex,
  Title
} from "@mantine/core";
import React from 'react';

import {IRoom} from "@/constants";
import BookingCard from "@/components/BookingCard";
import NavBar from "@/components/NavBar";
import Loading from "@/components/Loading";
import {useRooms} from "@/hooks/rooms";

const useStyle = createStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  }
});

const RoomsLandingPage = (): React.ReactElement => {
  const {classes, theme, cx} = useStyle();

  const { isLoading, data: rooms } = useRooms();

  if (isLoading) return <Loading />;

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
            rooms!.map((room: IRoom) => (
              <BookingCard key={room.id} room={room}/>
            ))
          }
        </Flex>
      </Container>
    </main>
  )
}

export default RoomsLandingPage;
