import React from 'react'
import errorImage from '../../assets/error.jpg';
const NotFound = () => {
  return (
    <div className='h-screen w-screen'>
      <img src={errorImage} height="100vh" width="100vw" className='h-screen w-screen bg-cover' />
    </div>
  )
}

export default NotFound
