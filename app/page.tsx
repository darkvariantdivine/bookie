"use client";

import {
  Container,
  createStyles,
  Group,
  Title,
  Text,
  Button
} from "@mantine/core";
import React, {useContext} from 'react';
import {IconLogout} from "@tabler/icons";

import {UserContext} from "@/contexts/UserContext";

const useStyle = createStyles((theme, _params, getRef) => ({
  wrapper: {
    position: 'relative',
    maxHeight: "100vh",
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  backgroundImage: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    opacity: 0.9,
  },

  inner: {
    position: 'relative',
    paddingTop: 200,
    paddingBottom: 120,

    [theme.fn.smallerThan('sm')]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [theme.fn.smallerThan('sm')]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

export default function Home(): React.ReactElement {
  const {classes, theme, cx} = useStyle();
  const { user, handleLogout } = useContext(UserContext);

  return (
    <main >
      <div className={classes.wrapper}>
        <Container size={700} className={classes.inner}>
          <Group>
            <Title className={classes.title}>
              A{' '}
              <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
                fully featured
              </Text>{' '}
              facilities booking website
            </Title>
          </Group>

          <Text className={classes.description} color="dimmed">
            Always squabbling over who gets to use the meeting room? Organise your workplace today with Bookie.
          </Text>

          <Group className={classes.controls}>
            {
              user ?
                <Group>
                  <Button
                    component={"a"}
                    href={"/rooms"}
                    size="xl"
                    className={classes.control}
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                  >
                    Book Rooms
                  </Button>
                  <Button
                    component={"a"}
                    href={"/bookings"}
                    size="xl"
                    className={classes.control}
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                  >
                    My Bookings
                  </Button>
                  <Button
                    onClick={async () => {await handleLogout();}}
                    size="xl"
                    className={classes.control}
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    leftIcon={<IconLogout/>}
                  >
                    Log out
                  </Button>
                </Group> :
                <Button
                  component={"a"}
                  href={"/login"}
                  size="xl"
                  className={classes.control}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                >
                  Sign In
                </Button>
            }
          </Group>
        </Container>
      </div>
    </main>
  )
}
