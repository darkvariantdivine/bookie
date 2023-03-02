"use client";

import React, {useContext, useState} from 'react';
import {
  createStyles,
  Container,
  Group,
  Image,
  Tabs,
  Burger,
  Transition,
  Paper,
  Button
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import Link from "next/link";
import {MantineTheme} from "@mantine/styles/lib/theme";
import {
  usePathname,
  useRouter
} from "next/navigation";

import {
  TABS,
  Tab
} from "@/constants";
import ProfileMenu from "@/components/ProfileMenu";
import {UserContext} from "@/contexts/UserContext";
import {getActiveTab} from "@/libs/utils";

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

  tabs: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tab: {
    fontWeight: 500,
    height: 38,
    color: theme.white,
    backgroundColor: 'transparent',
    borderColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1
      ),
    },

    '&[data-active]': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1
      ),
      borderColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    },
  },
}));

export function NavBar(): React.ReactElement {
  const router = useRouter();
  const { classes, theme, cx } = useStyles();
  const { user } = useContext(UserContext);

  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(getActiveTab(usePathname()));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">

          {/*Logo*/}
          <Link href={'/'}>
            <Image src={"/Logo.png"} alt={"Bookie Logo"} width={"48px"} radius={"lg"} />
          </Link>

          {/*Reactive tabs menu*/}
          {/*Tabs menu when screen size is large*/}
          <Tabs
            defaultValue={active}
            variant="outline"
            classNames={{
              root: classes.tabs,
              tabsList: classes.tabsList,
              tab: classes.tab,
            }}
            onTabChange={
              (value: string) => {
                let tab: Tab = TABS.find((tab: Tab) => value === tab.link);
                if (tab.requireSignIn && !user) {
                  router.push('/login');
                } else {
                  setActive(value);
                  router.push(value);
                }
              }
            }
          >
            <Tabs.List>
              {
                TABS.map((tab: Tab) => (
                  <Tabs.Tab
                    value={tab.link}
                    key={tab.link}
                  >
                    {tab.label}
                  </Tabs.Tab>
                ))
              }
            </Tabs.List>
          </Tabs>

          {/*Activated when screen size is small (HP)*/}
          {/*Burger expands tab menus in dropdown list*/}
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color={theme.white}
          />

          <Transition
            mounted={opened}
            transition={"pop-top-right"}
            duration={200}
            timingFunction={"ease"}
          >
            {
              (styles) =>
                <Paper
                  className={classes.dropDown}
                  style={styles}
                  withBorder
                >
                  {
                    TABS.map((tab: Tab) => (
                      <Link
                        passHref
                        href={tab.link}
                        key={tab.label}
                        onClick={
                          (event) => {
                            event.preventDefault();
                            setActive(tab.link);
                            close();
                          }
                        }
                        className={
                          cx(
                            classes.dropDownLink,
                            {[classes.dropDownLinkActive]: active === tab.label}
                          )
                        }
                      >
                        {tab.label}
                      </Link>
                    ))
                  }
                </Paper>
            }
          </Transition>

          {/*User profile segment*/}
          {/*Show user menu if user is logged in*/}
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