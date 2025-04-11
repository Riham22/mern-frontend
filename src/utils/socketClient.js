import { io } from "socket.io-client";

let socket;
const myLink ='https://mern-backend-l6sx.onrender.com';
export const connectSocket = (token) => {
  if (!token) {
    console.warn("⛔ No token provided, socket will not connect.");
    return;
  }

  socket = io(myLink, {
    // autoConnect: false,
    auth: { token },
  });

  socket.connect(); 

  socket.on("connect", () => {
    console.log("✅ Connected to socket server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.log("⚠️ Socket error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;
