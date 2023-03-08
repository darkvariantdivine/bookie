
import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons";
import React from "react";
import {AxiosError} from "axios";

export default function handleApiError(e: Error | any, notification: boolean = true) {
  let message: string;
  if (
    e instanceof AxiosError &&
    e.response &&
    e.response.data
  ) message = e.response.data.message;
  else message = String(e);
  console.log(message);
  if (notification) {
    showNotification({
      icon: <IconX />,
      message: message,
      color: 'red'
    });
  }
  return e;
}