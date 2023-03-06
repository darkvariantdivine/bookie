"use client";

import {IRoom} from "@/constants";
import React, {useContext} from "react";
import {
  Badge,
  Button,
  Card,
  createStyles,
  Group,
  Text
} from "@mantine/core";
import {UserContext} from "@/contexts/UserContext";
import PhotoCarousel from "@/components/PhotoCarousel";

const useStyles = createStyles((theme, _params, getRef) => ({
}));

interface BookingCardProps {
  room: IRoom;
}

export default function BookingCard({ room }: BookingCardProps): React.ReactElement {
  const { classes } = useStyles();
  const { user } = useContext(UserContext);

  return (
    <Card
      key={room.id}
      shadow={"sm"}
      p="lg"
      m="lg"
      radius={"md"}
      mih={50}
      withBorder
    >
      <Card.Section>
        <PhotoCarousel
          imagesToDisplay={
          room.images.length > 0 ?
            room.images :
            ['/Logo.png']
          }
        />
      </Card.Section>
      <Group
        position={"apart"}
        mt={"md"}
        mb={"xs"}
      >
        <Text
          weight={500}
        >{room.name}</Text>
        <Badge>Pax: {room.capacity}</Badge>
      </Group>
      <Text
        mt={"md"}
        mb={"xs"}
        size={"sm"}
        color={"dimmed"}
      >
        {room.description}
      </Text>
        <Button
          component={'a'}
          href={`/rooms/${room.id}`}
          fullWidth
          disabled={!user}
        >
          { !user ?
            "Sign in to Book" :
            "Book Now"
          }
        </Button>
    </Card>
  )
}