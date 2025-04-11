import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../Redux/Slices/NotificationSlice';
import NotificationListener from './NotificationListiner';

const NotificationList = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="fixed bottom-0 right-0 m-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gray-500 text-white p-2 m-2 rounded-lg"
        >
          <p>{notification.message}</p>
          <button
            onClick={() => handleRemove(notification.id)}
            className="ml-2 text-white"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
