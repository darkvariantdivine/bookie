"use client";

import {
  createStyles,
  Flex,
  Image,
  Stack,
  Title,
  Text,
  Container,
  ActionIcon,
  Group,
  Paper,
} from "@mantine/core";
import React, {useContext} from "react";
import {
  IconArrowBackUp
} from "@tabler/icons";
import {useRouter} from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ObjectSupport from "dayjs/plugin/objectSupport";

import {Room} from "@/constants"
import SelectTimeSlots from "@/components/SelectTimeSlots";
import {RoomContext} from "@/contexts/RoomContext";

import ROOMS from "@/mocks/rooms.json"
import {NavBar} from "@/components/NavBar";
import {PhotoCarouselWithAutoplay} from "@/components/PhotoCarousel";

dayjs.extend(utc);
dayjs.extend(ObjectSupport);

const useStyles = createStyles((theme, _params, getRef) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "apart",
    alignItems: "center",
    width: "100%",
  },

  wrapper: {
    width: "100%",
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    minHeight: "50px",
    maxWidth: "80%",
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2],
    gap: "md",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));

interface RoomPageProps {
  params: {id: string};
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter()
  const { classes, theme, cx } = useStyles();

  const { rooms } = useContext(RoomContext);
  const room: Room = rooms.filter((room: Room) => {return params.id === room.id})[0];

  function createBooking(form: unknown) {
    // TODO: API call to create Booking
  }

  return (
    <main className={classes.main}>
      <NavBar />
      <Paper
        className={classes.wrapper}
      >
        <ActionIcon onClick={router.back}>
          <IconArrowBackUp />
        </ActionIcon>
        <Container
          py={"xl"}
          size={"lg"}
        >
          <Flex
            className={classes.inner}
          >
            <Stack
              sx={{maxWidth: 450}}
            >
              <Group>
                <Title order={1}>{room.name}</Title>
                <Text>{room.description}</Text>
              </Group>
              <PhotoCarouselWithAutoplay
                imagesToDisplay={
                  room.images.length > 0 ?
                    room.images :
                    ["/Logo.png"]
                }
              />
            </Stack>
            <SelectTimeSlots room={room}/>
          </Flex>
        </Container>
      </Paper>
    </main>
  )
}

export async function getStaticPaths() {
  // TODO: API query to retrieve room paths
  return {
    paths: ROOMS.map((room: Room) => {
      return {params: {id: room.id}}
    }),
    fallback: false
  }
}

