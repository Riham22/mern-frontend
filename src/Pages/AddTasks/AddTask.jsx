import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../../Redux/Slices/TaskSlice.js";
import sound from '../../assets/notification.wav';
import { addNotification } from "../../Redux/Slices/NotificationSlice.js";
import { connectSocket } from "../../utils/socketClient.js";

const AddTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDateTime, setTaskDateTime] = useState(new Date("2025-01-01T05:00:00Z"));
  const [taskRemindMe, setTaskRemindMe] = useState(false);
  const [err, setErr] = useState("");

  const dispatch = useDispatch();
  const taskStatus = useSelector((state) => state.tasks.status);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskDate = new Date(taskDateTime);
    if (!taskDateTime || isNaN(taskDate.getTime())) {
      setErr("Please enter a valid date and time.");
      return;
    }

    const currentTime = new Date();
    if (taskDate <= currentTime) {
      setErr("The task time must be in the future.");
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      dateTime: taskDate,
      remindMe: taskRemindMe,
    };

    try {
      await dispatch(addTask(newTask)).unwrap();
      new Audio(sound).play();

      dispatch(
        addNotification({
          id: new Date().getTime(),
          message: `Task "${taskTitle}" has been added successfully!`,
        })
      );

      const notifyTime = taskDate.getTime() - 5 * 60 * 1000;
      const timeUntilNotify = notifyTime - currentTime.getTime();

      if (timeUntilNotify > 0 && taskRemindMe) {
        setTimeout(() => {
          new Audio(sound).play();
          dispatch(
            addNotification({
              id: new Date().getTime(),
              message: `Reminder: Task "${taskTitle}" is due in 5 minutes!`,
            })
          );
        }, timeUntilNotify);
      }

      setTaskTitle("");
      setTaskDescription("");
      setTaskDateTime(new Date());
      setTaskRemindMe(false);
      setErr("");
    } catch (error) {
      setErr(error.message || "Something went wrong");
      console.error("Error adding task:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectSocket(token);

    socket.on("taskReminder", (reminder) => {
      dispatch(
        addNotification({
          id: new Date().getTime(),
          message: `Reminder: ${reminder.title} is due at ${new Date(reminder.time).toLocaleTimeString()}`,
        })
      );
    });

    return () => {
      socket.off("taskReminder");
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-10 text-gray-500 shadow-sm mb-6 border-[1px] rounded-3xl bg-opacity-80"
      >
        <h1 className="text-xl text-center text-gray-500 font-medium mb-4">Add Task</h1>
        {err && <p className="text-red-500">Error: {err}</p>}

        <div className="row flex flex-col lg:flex-row md:flex-col sm:flex-col m-1 gap-1 ">
          <div className="mb-2 lg:w-1/2 md: block md:w-full">
            <label htmlFor="title" className="inline-block my-1 text-gray-500 text-md font-medium">Title</label>
            <input
              type="text"
              id="title"
              className="w-full focus:outline-none p-2 border-[1px] rounded-lg"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-2 lg:w-1/2 md: block md:w-full">
            <label htmlFor="dat" className="inline-block my-1 text-gray-500 text-md font-medium">Deadline</label>
            <input
              id="dat"
              className="w-full focus:outline-none p-[11px] border-[1px] rounded-lg text-xs"
              type="datetime-local"
              value={taskDateTime}
              onChange={(e) => setTaskDateTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 m-1">
          <label htmlFor="description" className="inline-block my-1 text-gray-500 text-md font-medium">Description</label>
          <input
            id="description"
            className="w-full p-2 border focus:outline-none rounded-lg flex flex-row gap-4"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            className="inline-block mx-2 text-gray-500 text-xlg"
            type="checkbox"
            id="remindMe"
            checked={taskRemindMe}
            onChange={() => setTaskRemindMe(!taskRemindMe)}
          />
          <label htmlFor="remindMe" className="inline-block text-gray-500 text-sm font-medium">Remind Me</label>
        </div>

        <button
          type="submit"
          className="bg-gray-500 text-white p-2 rounded mt-4 text-center font-medium"
        >
          {taskStatus === "loading" ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
