import { API_BASE_URL } from "@/config/env";
import { io } from "socket.io-client";

export const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  reconnection: true,
});
