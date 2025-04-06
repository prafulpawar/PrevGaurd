// OtpVerification.js
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'; // Import icons
import { useSelector, useDispatch } from 'react-redux';
import InputField from '../components/forms/InputField';
import Button from '../components/forms/Button';
import {
    verifyOtp,
    resendOtp,
    checkOtpStatus, // <-- Import check status action
    selectAuthUser,
    selectAuthLoading, // General loading
    selectOtpError,
    selectOtpMessage,
    selectIsVerified,
    clearOtpError,
    // --- Import new selectors ---
    selectOtpRequestId,
    selectOtpDeliveryStatus,
    selectIsCheckingOtpStatus,
    // --- End new selectors ---
} from '../redux/slice/authSlice';

// Constants for polling
const POLLING_INTERVAL = 5000; // Check every 5 seconds
const MAX_POLLING_ATTEMPTS = 12; // Stop after 1 minute (12 * 5s)

function OtpVerification() {
    const [otpValue, setOtpValue] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pollingIntervalRef = useRef(null); // Ref to store interval ID
    const pollingAttemptsRef = useRef(0); // Ref to count attempts

    // Selectors
    const user = useSelector(selectAuthUser);
    const isVerified = useSelector(selectIsVerified);
    const isLoading = useSelector(selectAuthLoading); // Loading for verify/resend
    const otpError = useSelector(selectOtpError);
    const otpMessage = useSelector(selectOtpMessage);

    // --- Select new state ---
    const otpRequestId = useSelector(selectOtpRequestId);
    const otpDeliveryStatus = useSelector(selectOtpDeliveryStatus); // 'idle', 'pending_send', 'checking', 'sent', 'failed', etc.
    const isCheckingOtpStatus = useSelector(selectIsCheckingOtpStatus); // Loading for status check
    // --- End select new state ---

    const displayEmail = user?.email || 'your email address';

    // Clear errors on mount/unmount
    useEffect(() => {
        dispatch(clearOtpError());
        return () => {
            dispatch(clearOtpError());
            // Clear interval on unmount
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [dispatch]);

    // Effect for polling OTP status
    useEffect(() => {
        // Conditions to start polling:
        // 1. We have a requestId.
        // 2. The status is 'pending_send' (initial state after registration) or maybe 'checking'
        // 3. Verification hasn't already succeeded.
        const shouldPoll = otpRequestId &&
                           (otpDeliveryStatus === 'pending_send' || otpDeliveryStatus === 'checking') &&
                           !isVerified;

        if (shouldPoll) {
            // Clear previous interval if any (e.g., after resend)
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
            pollingAttemptsRef.current = 0; // Reset attempts counter

            const poll = () => {
                if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) {
                    console.warn("Max polling attempts reached for OTP status.");
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                    // Optionally set an error/status indicating timeout
                    // dispatch(setOtpDeliveryStatus('timeout')); // Need to add 'timeout' handling in slice if desired
                    dispatch(clearOtpError()) // Clear previous error before setting new one
                    dispatch(verifyOtp.rejected('Failed to get OTP status in time. Please try resending.')); // Use reject mechanism of another thunk or a specific action
                    return;
                }

                console.log(`Polling attempt: ${pollingAttemptsRef.current + 1}`);
                dispatch(checkOtpStatus(otpRequestId)); // Dispatch the check
                pollingAttemptsRef.current += 1;
            };

            // Start immediately then set interval
            poll();
            pollingIntervalRef.current = setInterval(poll, POLLING_INTERVAL);

        } else {
             // Conditions not met, ensure polling is stopped
             if (pollingIntervalRef.current) {
                 console.log("Stopping OTP status polling.");
                 clearInterval(pollingIntervalRef.current);
                 pollingIntervalRef.current = null;
             }
        }

        // Cleanup function for this effect instance
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
        // Dependencies: Start/stop polling when these change
    }, [otpRequestId, otpDeliveryStatus, isVerified, dispatch]);


    // Effect to navigate on successful verification
    useEffect(() => {
        if (isVerified) {
            console.log("Verification successful, navigating...");
            if (pollingIntervalRef.current) { // Stop polling if verify succeeds
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            navigate('/login'); // Or wherever appropriate
        }
    }, [isVerified, navigate]);

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setOtpValue(value.slice(0, 6));
        if (otpError || otpMessage) {
            dispatch(clearOtpError());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.email || otpDeliveryStatus !== 'sent') { // Only allow submit if OTP is confirmed sent
            console.error("Cannot verify OTP. Email missing or OTP not confirmed sent.");
            // Maybe set a local error? Or rely on the button being disabled.
            return;
        }
        if (otpValue.length !== 6) return;

        try {
            await dispatch(verifyOtp({ email: user.email, otp: otpValue })).unwrap();
        } catch (error) {
            console.error("OTP Verification failed:", error);
        }
    };

    const handleResendOtp = async () => {
        if (!user || !user.email) return;
        // Clear previous status/errors before resend attempt
        dispatch(clearOtpError());
        // Stop current polling before resending
         if (pollingIntervalRef.current) {
             clearInterval(pollingIntervalRef.current);
             pollingIntervalRef.current = null;
         }
        try {
            await dispatch(resendOtp(user.email)).unwrap();
            // Polling will restart via useEffect if resend is successful and provides an ID/sets status
        } catch (error) {
            console.error("Resend OTP failed:", error);
        }
    };

    // Determine if OTP input and Verify button should be enabled
    const canVerify = otpDeliveryStatus === 'sent' && !isLoading;

    // Display Status Information
    const renderStatusInfo = () => {
        switch (otpDeliveryStatus) {
            case 'pending_send':
            case 'checking':
                return (
                    <div className="flex items-center text-sm text-yellow-600 justify-center mb-4">
                        <ClockIcon className="h-5 w-5 mr-2 animate-spin" />
                        {isCheckingOtpStatus ? 'Checking status...' : 'Waiting for OTP to be sent...'}
                    </div>
                );
            case 'sent':
                return (
                    <div className="flex items-center text-sm text-green-600 justify-center mb-4">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        OTP Sent! Please check your email ({displayEmail}).
                    </div>
                );
             case 'failed':
             case 'expired':
             case 'not_found':
                 // Error is already displayed via otpError selector below this section
                 return null; // Don't show duplicate info
            case 'verified': // Should have navigated away, but just in case
                 return (
                    <div className="flex items-center text-sm text-green-600 justify-center mb-4">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Account Verified!
                    </div>
                 );
            case 'idle': // Before registration completes or if no requestId
            default:
                return null; // No status to show initially
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
                {/* Show status before asking for code */}
                {!isVerified && renderStatusInfo()}
                 {/* Conditional message - only show if status isn't clearly indicating sent/failed */}
                {(otpDeliveryStatus !== 'sent' && otpDeliveryStatus !== 'failed' && otpDeliveryStatus !== 'expired' && otpDeliveryStatus !== 'not_found' && !isVerified) && (
                     <p className="mt-2 text-center text-sm text-gray-600">
                         We are sending a 6-digit code to
                         <br />
                         <span className="font-medium text-gray-800">{displayEmail}</span>
                     </p>
                 )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                    {/* Display OTP specific errors or resend messages */}
                    {otpError && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
                             <div className="flex">
                                 <div className="flex-shrink-0">
                                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                 </div>
                                 <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{otpError}</p>
                                 </div>
                             </div>
                        </div>
                    )}
                    {otpMessage && !otpError && (
                         <div className="rounded-md bg-blue-50 p-4 mb-4">
                            <p className="text-sm font-medium text-blue-800">{otpMessage}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <InputField
                            label="Verification Code"
                            type="text"
                            inputMode="numeric"
                            name="otp"
                            value={otpValue}
                            onChange={handleOtpChange}
                            required
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            // Disable until OTP is confirmed sent
                            disabled={!canVerify || isLoading || isCheckingOtpStatus}
                            autoComplete="one-time-code"
                        />

                        <div>
                            <Button
                                type="submit"
                                // Loading state should cover Verify action
                                isLoading={isLoading && !isCheckingOtpStatus}
                                // Disable until OTP sent and not loading
                                disabled={!canVerify || otpValue.length !== 6 || isLoading || isCheckingOtpStatus}
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
                            // Disable while any action is loading (verify, resend, status check)
                            disabled={isLoading || isCheckingOtpStatus}
                            className="mt-1"
                            fullWidth={false}
                        >
                             {/* Indicate loading specific to resend if needed */}
                             {(isLoading && otpMessage === 'Resending OTP...') ? 'Sending...' : 'Resend OTP'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OtpVerification;