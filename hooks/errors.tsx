
import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons";
import React from "react";

export default function handleApiError(e: Error | any, notification: boolean = true) {
  let message: string;
  if (e.message) message = e.message;
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