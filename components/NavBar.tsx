"use client";

import React, {useContext} from 'react';
import {
  createStyles,
  Container,
  Group,
  Image,
  Button
} from '@mantine/core';
import Link from "next/link";
import {MantineTheme} from "@mantine/styles/lib/theme";

import ProfileMenu from "@/components/ProfileMenu";
import HeaderTabs from "@/components/HeaderTabs";
import MobileHeaderTabs from "@/components/MobileHeaderTabs";
import {UserContext} from "@/contexts/UserContext";

const useStyles = createStyles((theme: MantineTheme) => ({
  header: {
    width: "100%",
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    borderBottom: `1px solid ${
      theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  dropDown: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('xs')]: {
      display: 'none'
    }
  },

  dropDownLink: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  dropDownLinkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
      marginLeft: 'auto',
      marginRight: 0
    },
  },

}));

export default function NavBar(): React.ReactElement {
  const { classes, theme, cx } = useStyles();

  const {user} = useContext(UserContext);

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">

          {/*Logo*/}
          <Link href={'/'}>
            <Image src={"/Logo.png"} alt={"Bookie Logo"} width={"48px"} radius={"lg"} />
          </Link>

          <HeaderTabs />
          <MobileHeaderTabs />
          {
            user && (<ProfileMenu />)
          }

          {/*Show sign in prompt if user is not logged in*/}
          {
            !user && (
              <Button
                component={'a'}
                href={'/login'}
              >
                Sign In
              </Button>
            )
          }
        </Group>
      </Container>
    </div>
  );
}