"use client";

import {
  Burger,
  createStyles,
  Paper,
  Transition
} from "@mantine/core";
import Link from "next/link";
import React, {
  useContext,
  useState
} from "react";
import {MantineTheme} from "@mantine/styles/lib/theme";
import {
  usePathname,
  useRouter
} from "next/navigation";
import {useDisclosure} from "@mantine/hooks";

import {
  ITab,
  TABS
} from "@/constants";
import {UserContext} from "@/contexts/UserContext";
import {getActiveTab} from "@/libs/utils";

const useStyles = createStyles((theme: MantineTheme) => ({
  dropDown: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 15,
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

export function MobileHeaderTabs() {
  const router = useRouter();
  const { classes, theme, cx } = useStyles();
  const { user } = useContext(UserContext);

  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(getActiveTab(usePathname()));

  return (
    <>
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
                TABS.map((tab: ITab) => (
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
    </>
  )
}