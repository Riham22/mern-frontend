import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../Redux/Slices/AuthSlice';
import { toast } from 'react-toastify';
import { Button, Input } from '@heroui/react';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const { token } = useParams();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(resetPassword({ token, newPassword }));
            if (response.payload?.message) {
                toast.success(response.payload.message);
            }
            if (response.error) {
                toast.error(response.error.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(`Failed to reset your password: ${error.message}`);
        }
    };

    return (
        <div className="bg-gray-200 text-gray-600 rounded-lg p-10 mx-auto w-full max-w-xs flex flex-col gap-4">
            <h2 className="mx-auto font-medium">Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    labelPlacement="outside"
                    classNames={{
                        inputWrapper: "rounded-md bg-white",
                        input: "focus:outline-none",
                        label: "text-sm",
                        errorMessage: "text-xs text-red-500",
                    }}
                />
                <Button className="mx-auto my-4 text-center text-sm font-medium rounded-md bg-gray-500 text-white" type="submit">
                    Reset Password
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword;
