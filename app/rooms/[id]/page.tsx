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
  useEffect,
  useState
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
  IRoom
} from "@/constants"
import SelectTimeSlots from "@/components/SelectTimeSlots";
import {NavBar} from "@/components/NavBar";
import {PhotoCarouselWithAutoplay} from "@/components/PhotoCarousel";
import {fetchRoom} from "@/libs/rest";
import Loading from "@/components/Loading";

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

  const [room, setRoom] = useState<IRoom | null>(null);

  useEffect(
    () => {
      const retrieveRoom = async () => {
        let data: IRestApiResponse = await fetchRoom(params.id);
        setRoom(data['data']);
      }
      retrieveRoom();
    },
    []
  )

  return (
    <main className={classes.main}>
      <NavBar />
      <Paper
        className={classes.wrapper}
      >
        <ActionIcon onClick={router.back}>
          <IconArrowBackUp />
        </ActionIcon>
        {!room && <Loading />}
        {
          room &&
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
        }
      </Paper>
    </main>
  )
}

