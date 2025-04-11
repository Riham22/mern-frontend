import { io } from 'socket.io-client';


let socket;
// const myLink = "https://mern-backend-l6sx.onrender.com";
const myLink = "https://mern-backend-bx9x.onrender.com";



export const connectSocket = (token) => {
  if (socket && socket.connected) {
    console.log("🔁 Socket already connected:", socket.id);
    return socket;
  }

  if (!token) {
    console.warn("⛔ No token provided, socket will not connect.");
    return;
  }

  socket = io(myLink, {
    auth: { token },
    transports: [ "polling"],
    withCredentials: true,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Connected to socket server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("⚠️ Socket error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

