// src/socket.js
import { io } from "socket.io-client";
import { BE_URL } from "./constants";

const socket = io(BE_URL);
export default socket;
