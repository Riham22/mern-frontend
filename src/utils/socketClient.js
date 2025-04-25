import { io } from 'socket.io-client';
import store from './../Redux/store';
// import { updateTask } from '../Redux/Slices/TaskSlice';
import sound from "../../assets/notification.wav";


let socket;
// const myLink = "https://mern-backend-l6sx.onrender.com";
const myLink = 'https://mern-backend-production-4d08.up.railway.app';
// "https://mern-backend-bx9x.onrender.com";



const storedUser = localStorage.getItem("user");
const currentUser = storedUser ? JSON.parse(storedUser) : null;

export const connectSocket = (token) => {
  if (socket && socket.connected) {
    console.log("🔁 Socket already connected:", socket.id);
    return socket;
  }

  if (!token || !currentUser?._id) {
    console.warn("⛔ Token or user ID missing, socket will not connect.");
    return;
  }

  console.log("🔐 Connecting socket with token:", token);

  socket = io(myLink, {
    query: { userId: currentUser._id },
    auth: { token },
    transports: ["polling", "websocket"],
    withCredentials: true,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log("✅ Connected to socket server:", socket.id);
    socket.emit("join-room", currentUser._id);
  });
  socket.on("task-updated", (task) => {
    console.log("📦 Task updated via socket:", task);
    sound.play().catch((e) =>
      console.warn("🔇 Edit sound failed:", e)
    );
    store.dispatch({ type: 'tasks/updateTaskFromSocket', payload: task });
  
    alert(`✏️ تم تعديل المهمة: ${task.title}`);
  });
  
  socket.on("connect_error", (err) => {
    console.error("⚠️ Socket error:", err.message);
  });

  return socket;
};


export const getSocket = () => socket;

