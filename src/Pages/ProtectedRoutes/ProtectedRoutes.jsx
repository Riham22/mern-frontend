import React from 'react'
import Login from '../Login/Login'
import {  useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
  const { isAuthenticated } = useSelector(state => state.auth); 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;  
  }  return (
    <div className=''>
      {children}
    </div>
  )
}

export default ProtectedRoutes
