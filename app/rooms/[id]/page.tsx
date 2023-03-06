"use client";

import {
  createStyles,
  Flex,
  Stack,
  Title,
  Text,
  Container,
  ActionIcon,
  Group,
  Paper,
} from "@mantine/core";
import React, {
  useContext,
  useEffect,
} from "react";
import {
  IconArrowBackUp
} from "@tabler/icons";
import {useRouter} from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import ObjectSupport from "dayjs/plugin/objectSupport";

import {
  IRestApiResponse,
} from "@/constants"
import SelectTimeSlots from "@/components/SelectTimeSlots";
import {NavBar} from "@/components/NavBar";
import {PhotoCarouselWithAutoplay} from "@/components/PhotoCarousel";
import {fetchRoom} from "@/libs/rest";
import Loading from "@/components/Loading";
import {RoomContext} from "@/contexts/RoomContext";

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

  const {selectedRoom, setRoom} = useContext(RoomContext);

  const retrieveRoom = async () => {
    let data: IRestApiResponse = await fetchRoom(params.id);
    setRoom(data['data']);
  }

  useEffect(
    () => {retrieveRoom();},
    []
  )

  useEffect(
    () => {retrieveRoom();},
    [params.id]
  )

  if (selectedRoom === undefined) {
    return (
      <main className={classes.main}>
        <Loading />
      </main>
    )
  } else {
    return (
      <main className={classes.main}>
        <NavBar />
        <Paper
          className={classes.wrapper}
        >
          <ActionIcon onClick={router.back} size={"xl"}>
            <IconArrowBackUp size={36}/>
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
                  <Title order={1}>{selectedRoom.name}</Title>
                  <Text>{selectedRoom.description}</Text>
                </Group>
                <PhotoCarouselWithAutoplay
                  imagesToDisplay={
                    selectedRoom.images.length > 0 ?
                      selectedRoom.images :
                      ["/Logo.png"]
                  }
                />
              </Stack>
              <SelectTimeSlots room={selectedRoom}/>
            </Flex>
          </Container>
        </Paper>
      </main>
    )
  }
}

