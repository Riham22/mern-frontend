import { io } from 'socket.io-client';



let socket;
const myLink = 'https://mern-backend-production-4d08.up.railway.app';



const storedUser = localStorage.getItem("user");
const currentUser = storedUser ? JSON.parse(storedUser) : null;

export const connectSocket = (token) => {
  if (socket && socket.connected) {
    console.log("🔁 Socket already connected:", socket.id);
    return socket;
  }

  if (!token || !currentUser?._id) {
    console.warn("⛔ Token or user ID missing, socket will not connect.");
    return null;
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
  // socket.on("task-updated", (task) => {
  //   console.log("📦 Task updated via socket:", task);

  //   const dispatcher = externalDispatch || store.dispatch;
  //   dispatcher({ type: 'tasks/updateTask/fulfilled', payload: task });

  //   alert(`✏️ تم تعديل المهمة: ${task.title}`);
  
  // });
  
  socket.on("connect_error", (err) => {
    console.error("⚠️ Socket error:", err.message);
  });

  return socket;
};

export const onTaskUpdated = (callback) => {
  if (!socket) return;
  socket.on("task-updated", (task) => {
    console.log("📦 Task updated via socket:", task);
    callback(task); // ننادي الكولباك اللي جاي من الكومبوننت
  });}
export const getSocket = () => socket;

