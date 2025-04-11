import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../Redux/Slices/NotificationSlice";
import { getSocket } from "../utils/socketClient.js"; // ده هو ملف الاتصال بتاعك
import sound from '../assets/notification.wav';
const NotificationListener = () => {
  const dispatch = useDispatch();
const initialized = useRef(false);
  useEffect(() => {
        console.log("🔁 NotificationListener mounted");
        if (initialized.current) return;
    initialized.current = true;
}, [dispatch]);

              
    const socket = getSocket();

    if (!socket) return;

    socket.on("taskReminder", (data) => {
        console.log("📢 Received Reminder:", data);
        
        dispatch(
          addNotification({
            id: Date.now(), // Unique ID
            message: `⏰ تذكير: ${data.title} - ${data.description}`,
          })
        );
      });
  
        socket.off("taskReminder");
   
  
  const sendTestNotification = () => {
        const audio = new Audio(sound);
        try{audio.play()}catch(err) {
            console.warn("🔇 Couldn't play sound:", err)
        } 
      const socket = getSocket();
      socket.emit("taskReminder", {
        title: "غسيل المواعين",
        description: "تذكير بغسيل المواعين الساعة 7:00 مساءً",
      });
    };
  
    return (
      <div>
        
      </div>
    );
  };
  
  export default NotificationListener;
