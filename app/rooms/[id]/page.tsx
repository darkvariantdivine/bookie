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
import {Carousel} from "@mantine/carousel";
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

dayjs.extend(utc);
dayjs.extend(ObjectSupport);

const useStyles = createStyles((theme, _params, getRef) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "apart",
    alignItems: "center"
  },

  carousel: {
    '&:hover': {
      [`& .${getRef('carouselControls')}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getRef('carouselControls'),
    transition: 'opacity 150ms ease',
    opacity: 0,
  },

  carouselIndicator: {
    width: 4,
    height: 4,
    transition: 'width 250ms ease',

    '&[data-active]': {
      width: 16,
    },
  },
}));

interface RoomPageProps {
  params: {id: string}
}

export default function RoomPage({ params }: RoomPageProps) {
  const router = useRouter()
  const { classes, theme, cx } = useStyles();

  const { rooms } = useContext(RoomContext);
  const room: Room = rooms.filter((room: Room) => {return params.id === room.id})[0];

  const images = room.images.map((image) => (
    <Carousel.Slide key={image}>
      <Image
        width={450}
        src={image}
        alt={"Meeting room image"}
      />
    </Carousel.Slide>
  ));

  function createBooking(form: unknown) {
    // TODO: API call to create Booking
  }

  return (
    <main className={classes.main}>
      <NavBar />
      <Paper>
        <ActionIcon onClick={router.back}>
          <IconArrowBackUp />
        </ActionIcon>
        <Container
          py={"xl"}
          size={"lg"}
        >
          <Flex
            mih={50}
            maw={"80%"}
            bg={"rgba(0, 0, 0, .3)"}
            gap={"md"}
            justify={"flex-start"}
            align={"flex-start"}
            direction={"row"}
            wrap={"wrap"}
          >
            <Stack
              sx={{maxWidth: 450}}
            >
              <Group>
                <Title order={1}>{room.name}</Title>
                <Text>{room.description}</Text>
              </Group>
              {
                images.length !== 0 ? (
                  <Carousel
                    sx={{maxWidth: 450}}
                    slideSize={"80.0%"}
                    withIndicators
                    loop
                    classNames={{
                      root: classes.carousel,
                      controls: classes.carouselControls,
                      indicator: classes.carouselIndicator
                    }}
                  >
                    {images}
                  </Carousel>
                ) : (
                  <Image
                    sx={{maxWidth: 300}}
                    src={"/Logo.png"}
                    alt={"Meeting Room Image"}
                  />
                )
              }
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

