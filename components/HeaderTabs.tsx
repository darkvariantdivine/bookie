"use client";

import React, {
  useContext,
  useState
} from "react";
import {
  createStyles,
  Tabs
} from "@mantine/core";
import {
  ITab,
  TABS
} from "@/constants";
import {
  usePathname,
  useRouter
} from "next/navigation";
import {MantineTheme} from "@mantine/styles/lib/theme";

import {UserContext} from "@/contexts/UserContext";
import {getActiveTab} from "@/libs/utils";

const useStyles = createStyles((theme: MantineTheme) => ({
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

export function HeaderTabs(): React.ReactElement {
  const router = useRouter();
  const { classes, theme, cx } = useStyles();

  const { user } = useContext(UserContext);
  const [active, setActive] = useState(getActiveTab(usePathname()!));

  return (
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
          let tab: ITab = TABS.find((tab: ITab) => value === tab.link)!;
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
          TABS.map((tab: ITab) => (
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
  )
}