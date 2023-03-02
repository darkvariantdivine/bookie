"use client";

import React from "react";
import {Container, createStyles, Title} from "@mantine/core";
import {Image} from '@mantine/core';
import {MantineTheme} from "@mantine/styles/lib/theme";

const useStyles = createStyles((theme: MantineTheme) => ({
  loading: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'transparent',
    borderColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    transition: 'background-color 100ms ease',
  },
}));

export default function Loading() {
  const { classes, theme, cx } = useStyles();
  return (
    <Container>
      <Image
        className={classes.loading}
        src={'/loading.gif'}
        alt={'Loading...'}
        width={'60%'}
        height={'60%'}
        fit={"contain"}
      />
      <Title order={2}>Loading...</Title>
    </Container>
  )
}