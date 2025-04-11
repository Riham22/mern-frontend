import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask } from '../../Redux/Slices/TaskSlice';

const EditTaskForm = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dateTime, setDateTime] = useState(task.dateTime);
  const [remindMe, setRemindMe] = useState(task.remindMe);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { title, description, dateTime, remindMe };
    dispatch(updateTask({ id: task._id, updatedData }));
    onClose();
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Edit Task</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remindMe}
            onChange={(e) => setRemindMe(e.target.checked)}
          />
          Remind me
        </label>
        <button type="submit" className="bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditTaskForm;
