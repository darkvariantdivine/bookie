"use client";

import {Room} from "@/constants";
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
import Link from "next/link";
import PhotoCarousel from "@/components/PhotoCarousel";

const useStyles = createStyles((theme, _params, getRef) => ({
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

interface BookingCardProps {
  room: Room;
}

export default function BookingCard({ room }: BookingCardProps): React.ReactElement {
  const { classes } = useStyles();
  const { user } = useContext(UserContext);

  return (
    <Card
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
          fullWidth
          disabled={!user}
        >
          { !user ?
            "Sign in to Book" :
            <Link href={`/rooms/${room.id}`}>Book Now</Link>
          }
        </Button>
    </Card>
  )
}