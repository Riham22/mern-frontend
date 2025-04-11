import React, { useState } from "react";
import { useDispatch } from "react-redux";
import EditTaskForm from "../Pages/EditTask/EditTask";
import Modal from "./Modal";
import { deleteTask } from "../Redux/Slices/TaskSlice";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  return (
    <li className="bg-white text-pretty text-gray-500 p-4 mb-4 border rounded-lg opacity-90 ">
      <div className="flex justify-between">
        <div className="flex">
          <div className="flex-col ">
            <div className="flex my-1">
              <h3 className="text-pretty text-lg font-medium">{task.title}</h3>
              <p className="font-sans text-base mx-2">{task.description}</p>
            </div>

            <div className="flex">
              <p>
                <strong>Due:</strong> {new Date(task.dateTime).toLocaleString()}
              </p>
              <p className="text-gray-500 font-medium font-sans mx-2">
                {task.remindMe ? "Reminder" : null}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col text-lg justify-around">
          <button onClick={handleEditClick} className="text-gray-700 my-1">
            <AiOutlineEdit />
          </button>
          <button onClick={handleDelete} className=" text-red-500 my-1 ">
            <MdOutlineDelete />
          </button>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <EditTaskForm task={task} onClose={() => setIsEditOpen(false)} />
      </Modal>
    </li>
  );
};

export default TaskItem;
