import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../Redux/Slices/TaskSlice";
import TaskItem from "../../Components/TaskItem";
import AddTask from "../AddTasks/AddTask";
import NotificationList from "../../Components/NotificationList";
import NotificationListener from "../../Components/NotificationListiner";

const TasksPage = () => {

  
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks || []);

  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className=" min-h-screen mx-auto p-4">

      
      <div className="mx-auto px-6 ">
        <h2 className="my text-3xl text-center font-semibold text-white mb-4">Task List</h2>
        {Array.isArray(tasks) ? (
  tasks.length === 0 ? (
    <p className="text-white font-semibold text-lg">No tasks available</p>
  ) : (
    <ul>
      {tasks.filter(task => task && (task._id || task.id))
    .map((task) => (
      <TaskItem key={task._id || task.id} task={task} />
    ))}
    </ul>
  )
) : (
  <p className="text-white font-semibold text-lg">Loading tasks...</p>
)}

      </div>
    
      
    </div>
  );
};

export default TasksPage;
