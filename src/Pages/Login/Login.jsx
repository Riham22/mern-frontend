import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "@heroui/react";
import { MailIcon } from "../../Components/MailIcon";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../../Components/EyeIcon";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginUser } from "../../Redux/Slices/AuthSlice";
import AuthSlice from "./../../Redux/Slices/AuthSlice";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate(); // التوجيه بعد عملية التسجيل

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ username, password }));
      if (result.payload?.user) {
        localStorage.setItem("token", result.payload.token);
        localStorage.setItem("user", JSON.stringify(result.payload.user));
  console.log(result.payload.user);
  
        setUsername("");
        setPassword("");
        navigate("/home");
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      toast.error("Login failed: " + err.message);
    }
  };
  
  

  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Something went wrong. Please try again."
      );
    }

    return () => {
      dispatch(clearErrors());
    };
  }, [error, dispatch]);

  return (
    <div className="h-screen">
       <Form
      className="bg-gray-200   bg-opacity-50 text-gray-600 rounded-lg p-10 mx-auto w-full max-w-xs flex flex-col gap-4"
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2 className="mx-auto font-medium">Log in</h2>

      <Input
        name="username"
        label="Username"
        type="String"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        labelPlacement="outside"
        errorMessage="Invalid email"
        variant=""
        classNames={{
          inputWrapper: "rounded-md bg-white  ",

          input: "focus:outline-none  ",
          label: "text-sm  ",
          errorMessage: "text-xs text-red-500",
        }}
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
      />
      <Input
        name="password"
        label="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="max-w-xs"
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
        labelPlacement="outside"
        value={password}
        type={isVisible ? "text" : "password"}
        variant=""
        classNames={{
          inputWrapper: "rounded-md bg-white  ",

          input: "focus:outline-none  ",
          label: "text-sm ",
          errorMessage: "text-xs text-red-500",
        }}
      />
       <h4 className="text-gray-500 font-medium my-2 text-xs">
      <NavLink to="/forgot" className=" underline">
  Forgot your password?
</NavLink>

      </h4> 
      <div className="flex gap-2 " disabled={isLoading}>
        <Button
          color="gray"
          className="font-medium bg-slate-500 text-white rounded-md"
          type="submit"
        >
          Submit
        </Button>
      </div>
      <h4 className="mx-auto text-gray-500 font-medium my-2 text-xs">
        {" "}
        Don't have an account?{" "}
        <NavLink className="underline" to="/register">
          Register here
        </NavLink>
      </h4>
    </Form>
    </div>
   
  );
};
export default Login;
