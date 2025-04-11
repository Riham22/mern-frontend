import React from 'react'
import TasksPage from '../TaskPage/TaskPage'
import AddTask from '../AddTasks/AddTask'
import NotificationList from '../../Components/NotificationList'
import NotificationListener from '../../Components/NotificationListiner'

const Home = () => {
  return (
    <div>
            <AddTask />
            <NotificationList/>
            <NotificationListener/>
      <TasksPage/>
    </div>
  )
}

export default Home
