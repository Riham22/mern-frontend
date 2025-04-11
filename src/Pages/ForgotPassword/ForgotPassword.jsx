import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../Redux/Slices/AuthSlice';
import { toast } from 'react-toastify';
import { Button, Input } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(forgotPassword(username));
            if (response.payload?.message) {
                toast.success("Check your email for reset link");
                navigate('/reset')
            }
            if (response.error) {
                toast.error(response.error.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(`Failed to send password email: ${error.message}`);
        }
    };

    return (
        <div className="bg-gray-200 text-gray-600 rounded-lg p-10 mx-auto w-full max-w-xs flex flex-col gap-4">
            <h2 className="mx-auto font-medium">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    labelPlacement="outside"
                    classNames={{
                        inputWrapper: "rounded-md bg-white",
                        input: "focus:outline-none",
                        label: "text-sm",
                        errorMessage: "text-xs text-red-500",
                    }}
                />
                <Button className="mx-auto my-4 text-center text-white text-sm font-medium rounded-md bg-gray-500" type="submit">
                    Send Reset Email
                </Button>
            </form>
        </div>
    );
};

export default ForgotPassword;
