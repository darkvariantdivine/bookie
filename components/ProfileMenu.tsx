"use client";

import {
  Avatar,
  createStyles,
  Group,
  Menu,
  Text,
  UnstyledButton
} from "@mantine/core";
import {
  IconCalendar,
  IconChevronDown,
  IconLogout,
} from "@tabler/icons";
import React, {useContext, useState} from "react";
import {MantineTheme} from "@mantine/styles/lib/theme";
import {UserContext} from "@/contexts/UserContext";
import {showNotification} from "@mantine/notifications";

const useStyles = createStyles((theme: MantineTheme) => ({
  user: {
    color: theme.white,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1
      ),
    },

  },

  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
      0.1
    ),
  },

}));

export default function ProfileMenu(): React.ReactElement {
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const { user, updateUser } = useContext(UserContext);

  return (
    <Menu
      trigger={"hover"}
      width={260}
      position="bottom-end"
      transition="pop-top-right"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group spacing={7}>
            <Avatar src={user.image} alt={user.name} radius="xl" size={48} />
            <Text weight={500} size="sm" sx={{ lineHeight: 1, color: theme.white }} mr={3}>
              {user.name}
            </Text>
            <IconChevronDown size={12} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Bookings</Menu.Label>
        <Menu.Item
          component={"a"}
          href={"/bookings"}
          icon={
            <IconCalendar
              size={14}
              stroke={1.5}
              color={theme.colors.blue[6]}
            />
          }
        >
          My Bookings
        </Menu.Item>

        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          icon={
            <IconLogout
              size={14}
              stroke={1.5}
            />
          }
          onClick={
            () => {
              updateUser(undefined);
              showNotification(
                {
                  message: `${user.name} logged out`,
                  icon: <IconLogout />,
                  color: 'teal'
                }
              );
            }
          }
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}