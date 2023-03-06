
import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons";
import React from "react";

import {RestApiError} from "@/libs/rest";


export function handleApiError(e: Error | any, notification: boolean = true) {
  let message: string;
  if (e instanceof RestApiError) message = e.message;
  else message = String(e);
  if (notification) {
    showNotification({
      icon: <IconX />,
      message: message,
      color: 'red'
    });
  }
}