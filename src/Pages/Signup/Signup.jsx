import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "@heroui/react";
import { MailIcon } from "../../Components/MailIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../../Components/EyeIcon";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearErrors } from "../../Redux/Slices/AuthSlice";
import { toast } from "react-toastify";
import { Navigate, NavLink, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate=useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser({ username, password }));
      if (result.payload?.user) {
        setUsername("");
        setPassword("");
        navigate("/home");
      }
    } catch (err) {
      toast.error("Signup failed"+err);
    }
  };
  

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "Signup failed");
    }

    return () => {
      dispatch(clearErrors());
    };
  }, [error, dispatch]);

  return (
    <div className="h-screen">
       <Form
      className="bg-gray-200 bg-opacity-50 text-gray-600 rounded-lg p-10 mx-auto w-full max-w-xs flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <h2 className="mx-auto font-medium">Sign Up</h2>

      <Input
        name="username"
        type="String"
        label="Username"
        labelPlacement="outside"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        variant=""
        classNames={{
          inputWrapper: "rounded-md bg-white",
          input: "focus:outline-none",
          label: "text-sm",
          errorMessage: "text-xs text-red-500",
        }}
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
      />

      <Input
        name="password"
        label="Password"
        type={isVisible ? "text" : "password"}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        labelPlacement="outside"
        variant=""
        classNames={{
          inputWrapper: "rounded-md bg-white",
          input: "focus:outline-none",
          label: "text-sm",
          errorMessage: "text-xs text-red-500",
        }}
        startContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
      />

      <div className="flex gap-2">
        <Button
          color="gray"
          className="bg-slate-500 text-white rounded-md"
          type="submit"
          isDisabled={isLoading}
        >
          Submit
        </Button>
      

      </div>

      <h4 className="mx-auto  text-gray-500 font-medium my-2 text-xs">Already have an account? <NavLink to='/login' className="underline"> Login </NavLink></h4>
    </Form>
    </div>
   
  );
};

export default Signup;
