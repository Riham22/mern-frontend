import React from 'react'
import NavbarComponent from '../../Components/Navbar'
import {  Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <div>
      <NavbarComponent/>
      <div className="h-full py-10  ">
        <Outlet/>

      </div>
      
    </div>
  )
}

export default Layout
