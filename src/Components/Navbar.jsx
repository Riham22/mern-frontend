import React, { useEffect, useState } from "react";
import 'jwt-decode';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { FiLogOut } from "react-icons/fi";

import { NavLink } from "react-router-dom";
import 'react-redux';
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logoutUser } from './../Redux/Slices/AuthSlice';

const NavbarComponent = () => {

  const dispatch=useDispatch();
  
  const {user,isAuthenticated}= useSelector(state=> state.auth);
  
  console.log("user in component:", user);
const handleLogout=()=>{
  dispatch(logoutUser());
  localStorage.removeItem("token"); 
  localStorage.removeItem("user"); 

};

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = isAuthenticated
  ? [{ label: "Home", to: "/" }, { label: "Logout", action: handleLogout }]
  : [{ label: "Login", to: "/login" }, { label: "Sign Up", to: "/register" }];


  useEffect(() => {
    dispatch(loadUser());
    
    }, [dispatch]);
    
    
  return (
    <Navbar className="bg-gray-50 opacity-90 shadow" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <div className="text-gray-500">
          <NavbarBrand>
            <p className=" font-bold text-inherit">To Do</p>
          </NavbarBrand>
        </div>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {isAuthenticated && (
          <><NavLink
            className="text-gray-700 font-semibold"
            color="foreground"
            to={"/get-tasks"}
          >
            <NavbarItem>Task List </NavbarItem>
          </NavLink>
          <NavLink
            className="text-gray-700 font-semibold"
            color="foreground"
            to={"/add-task"}
          >
              <NavbarItem>Add </NavbarItem>
            </NavLink>
            
            </>
        )}

     
      </NavbarContent>
      <NavbarContent justify="end">
        {isAuthenticated ? 
        (
          <>
<span>{user?.username }</span>
<NavLink onClick={handleLogout}  className="text-red-500">
            <NavbarItem>
              <FiLogOut />
              {console.log(user)
              }
            </NavbarItem>
          </NavLink>
          </>
        ) : 
        (
          <>
            <NavLink to={"login"}>
              <NavbarItem className="hidden lg:flex">Login</NavbarItem>
            </NavLink>
            <NavLink to={"register"}>
              <NavbarItem>
                
                  Sign Up
              </NavbarItem>
            </NavLink>
          </>
        )}
      </NavbarContent>
      <NavbarMenu>
  {menuItems.map((item, index) => (
    <NavbarMenuItem key={index}>
      {item.to ? (
        <NavLink to={item.to}>
          {item.label}
        </NavLink>
      ) : (
        <Button variant="light" onClick={item.action} className="text-red-500">
          {item.label}
        </Button>
      )}
    </NavbarMenuItem>
  ))}
</NavbarMenu>

    </Navbar>
  );
};

export default NavbarComponent;
