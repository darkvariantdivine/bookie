"use client";

import React, {useRef} from "react";
import {
  createStyles,
  Image,
} from "@mantine/core";
import {Carousel} from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";

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

interface PhotoCarouselProps {
  imagesToDisplay: string[];
  imageDescription?: string;
  maxWidth?: number;
  slideSize?: string;
  autoplayDuration?: number;
}

export default function PhotoCarousel(
  {
    imagesToDisplay=["/Logo.png"],
    imageDescription="Meeting room image",
    maxWidth=450,
    slideSize="80%",
  }: PhotoCarouselProps
): React.ReactElement {
  const { classes } = useStyles();

  const images = imagesToDisplay.map((image: string, index: number) => (
    <Carousel.Slide key={String(index)}>
      <Image
        width={maxWidth}
        src={image}
        alt={imageDescription}
      />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      sx={{maxWidth: maxWidth}}
      slideSize={slideSize}
      withIndicators
      loop
      classNames={{
        root: classes.carousel,
        controls: classes.carouselControls,
        indicator: classes.carouselIndicator
      }}
    >
      {images}
    </Carousel>
  )
}

export function PhotoCarouselWithAutoplay(
  {
    imagesToDisplay=["/Logo.png"],
    imageDescription="Meeting room image",
    maxWidth=450,
    slideSize="80%",
    autoplayDuration=3000,
  }: PhotoCarouselProps
): React.ReactElement {
  const { classes } = useStyles();
  const autoplay = useRef(Autoplay({ delay: autoplayDuration }));

  const images = imagesToDisplay.map((image: string, index: number) => (
    <Carousel.Slide key={String(index)}>
      <Image
        width={maxWidth}
        src={image}
        alt={imageDescription}
      />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      sx={{maxWidth: maxWidth}}
      slideSize={slideSize}
      withIndicators
      loop
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      classNames={{
        root: classes.carousel,
        controls: classes.carouselControls,
        indicator: classes.carouselIndicator
      }}
    >
      {images}
    </Carousel>
  )
}