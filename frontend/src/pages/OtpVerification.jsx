// OtpVerification.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux'; // Import hooks
import InputField from '../components/forms/InputField';
import Button from '../components/forms/Button';
import {
    verifyOtp,
    resendOtp, // Import resend action
    selectAuthUser,
    selectAuthLoading,
    selectOtpError,
    selectOtpMessage,
    selectIsVerified,
    clearOtpError, // Import action to clear errors
} from '../redux/slice/authSlice'; // Adjust path as needed

function OtpVerification() {
    const [otpValue, setOtpValue] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Selectors for state
    const user = useSelector(selectAuthUser);
    const isLoading = useSelector(selectAuthLoading);
    const otpError = useSelector(selectOtpError);
    const otpMessage = useSelector(selectOtpMessage);
    const isVerified = useSelector(selectIsVerified);

    // Get email from user object, provide fallback
    const displayEmail = user?.email || 'your email address'; // Use optional chaining

     // Clear OTP error state when component mounts or unmounts
    useEffect(() => {
        dispatch(clearOtpError()); // Clear on mount
        return () => {
            dispatch(clearOtpError()); // Clear on unmount
        };
    }, [dispatch]);


    // Effect to navigate when verification is successful
    useEffect(() => {
        if (isVerified) {
            console.log("Verification successful, navigating...");
             // You might want to clear OTP state here before navigating
             // dispatch(clearOtpStateAction()); // Create this if needed
            navigate('/login'); // Navigate to login or dashboard after verification
        }
    }, [isVerified, navigate]);

    const handleOtpChange = (e) => {
        // Allow only numbers and limit length
        const value = e.target.value.replace(/[^0-9]/g, '');
        setOtpValue(value.slice(0, 6));
        // Clear error when user types
        if (otpError || otpMessage) {
            dispatch(clearOtpError());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.email) {
            // Handle case where user email is not available (e.g., direct navigation)
            dispatch(clearOtpError()); // Clear previous message/error
            // You might want to set an error directly or redirect
             console.error("User email not found in state for OTP verification.");
             // setLocalError("Could not verify OTP. Please try registering again."); // Example local error
             navigate('/register'); // Redirect to register perhaps
            return;
        }
        if (otpValue.length !== 6) {
             // Set a local validation error maybe
             console.error("OTP must be 6 digits.");
             // setLocalValidationError("OTP must be 6 digits.");
            return;
        }

        try {
            await dispatch(verifyOtp({ email: user.email, otp: otpValue })).unwrap();
            // Navigation is handled by the useEffect watching isVerified
        } catch (error) {
            console.error("OTP Verification failed:", error);
            // Error is already in Redux state (otpError)
        }
    };

     const handleResendOtp = async () => {
        if (!user || !user.email) {
             console.error("User email not found in state for resending OTP.");
             navigate('/register'); // Redirect
             return;
        }
        dispatch(clearOtpError()); // Clear previous message/error
        try {
             await dispatch(resendOtp(user.email)).unwrap();
             // Success message is handled by the Redux state (otpMessage)
        } catch (error) {
             console.error("Resend OTP failed:", error);
             // Error is handled by the Redux state (otpError)
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* ... Header ... */}
                <Link to="/" className="flex justify-center items-center mb-6">
                    <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
                    <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Verify Your Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter the 6-digit code sent to
                    <br />
                    {/* Display the email from Redux state */}
                    <span className="font-medium text-gray-800">{displayEmail}</span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                     {/* Display OTP specific errors or messages */}
                    {otpError && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
                            <p className="text-sm font-medium text-red-800">{otpError}</p>
                        </div>
                    )}
                    {otpMessage && !otpError && ( // Only show message if no error
                         <div className="rounded-md bg-blue-50 p-4 mb-4">
                            <p className="text-sm font-medium text-blue-800">{otpMessage}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <InputField
                            label="Verification Code"
                            type="text" // Use text to allow easier input masking/validation if needed
                            inputMode="numeric" // Hint for mobile keyboards
                            name="otp"
                            value={otpValue}
                            onChange={handleOtpChange}
                            required
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            disabled={isLoading} // Disable input while loading
                            autoComplete="one-time-code" // Help password managers/browsers
                        />

                        <div>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                disabled={isLoading || otpValue.length !== 6} // Disable if loading or OTP length is wrong
                                fullWidth
                            >
                                {isLoading ? 'Verifying...' : 'Verify Account'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">Didn't receive the code?</p>
                        <Button
                            variant="link"
                            onClick={handleResendOtp}
                            disabled={isLoading} // Disable while any loading is happening
                            className="mt-1"
                            fullWidth={false}
                        >
                             {/* Indicate loading specific to resend if needed */}
                             {isLoading && otpMessage === 'Resending OTP...' ? 'Sending...' : 'Resend OTP'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OtpVerification;