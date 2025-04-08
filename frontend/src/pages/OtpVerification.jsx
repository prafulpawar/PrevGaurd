
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import InputField from '../components/forms/InputField';
import Button from '../components/forms/Button';
import { getemail } from '../redux/slice/authSlice';

import {
    verifyOtp,
    checkOtpStatus,
    updateOtpValue,
    resetOtpState,
    resetStatusCheck,
    selectOtpValue,
    selectOtpError,
    selectIsSubmittingOtp,
    selectOtpMessage,
    selectRequestId,
    selectIsCheckingStatus,
    selectStatusError
} from '../redux/slice/otpSlice';


const STATUS_CHECK_DELAY = 10000;

function OtpVerification() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const statusCheckTimeoutRef = useRef(null);

    const displayEmail = useSelector(getemail);
    const rawOtpValue = useSelector(selectOtpValue);
    const otpError = useSelector(selectOtpError);
    const otpMessage = useSelector(selectOtpMessage);
    const isSubmittingOtp = useSelector(selectIsSubmittingOtp);
    const requestId = useSelector(selectRequestId);
    const isCheckingStatus = useSelector(selectIsCheckingStatus);
    const statusError = useSelector(selectStatusError);

    const otpValue = typeof rawOtpValue === 'string' ? rawOtpValue : '';
     useEffect(() => {
        if (typeof rawOtpValue !== 'string') {
            console.warn(`OtpVerification: Received non-string otpValue.`);
        }
    }, [rawOtpValue]);


    const [finalStatus, setFinalStatus] = useState(null);
    const isProcessing = isSubmittingOtp || isCheckingStatus;
    const canSubmit = !isProcessing && !requestId && !finalStatus;

    const clearStatusCheckTimeout = () => {
        if (statusCheckTimeoutRef.current) {
            clearTimeout(statusCheckTimeoutRef.current);
            statusCheckTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        if (otpError && !requestId && !isSubmittingOtp) {
            console.log("Initial OTP verification failed, redirecting to /register...");
             const redirectTimer = setTimeout(() => {
                navigate('/register');
             }, 1500);
             return () => clearTimeout(redirectTimer);
        }
    }, [otpError, requestId, isSubmittingOtp, navigate]);


    useEffect(() => {
        if (requestId && !finalStatus) {
            clearStatusCheckTimeout();

            statusCheckTimeoutRef.current = setTimeout(async () => {
                if (!requestId || finalStatus) return;

                console.log(`Checking status for RequestID: ${requestId} after delay...`);
                try {
                    const actionResult = await dispatch(checkOtpStatus(requestId));
                    const statusData = unwrapResult(actionResult);

                    console.log("Status check result:", statusData);

                    if (statusData.status === 'success') {
                        setFinalStatus('success');
                        setTimeout(() => navigate('/login'), 500);

                    } else if (statusData.status === 'failed' || statusData.status === 'invalid') { // Handle invalid status here as well
                        setFinalStatus('failed');
                        dispatch({ type: 'otp/checkStatus/rejected', payload: statusData.message || 'OTP Verification Failed.' });
                        dispatch(resetStatusCheck());

                    } else if (statusData.status === 'pending') {
                        console.warn("Status still pending after delay.");
                        setFinalStatus('pending_timeout');
                        dispatch({ type: 'otp/checkStatus/rejected', payload: 'Verification is taking too long. Please try again later.' });
                        dispatch(resetStatusCheck());
                    }
                } catch (error) {
                    console.error("Status check error caught in component:", error);
                    setFinalStatus('failed');
                    dispatch(resetStatusCheck());
                }
            }, STATUS_CHECK_DELAY);
        }

        return () => {
            clearStatusCheckTimeout();
        };
    }, [requestId, dispatch, finalStatus, navigate]);


    useEffect(() => {
        return () => {
            dispatch(resetOtpState());
        };
    }, [dispatch]);


    const renderStatusInfo = () => {
         if (finalStatus === 'success') {
            return (
                <div className="flex items-center text-sm text-green-600 justify-center my-4 text-center px-4">
                    <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Verification Successful! Redirecting to Login...</span>
                </div>
            );
        }
         if (finalStatus === 'failed' || finalStatus === 'pending_timeout' || statusError) {
            const errorMessage = statusError || 'OTP Verification Failed or Timed Out.';
            return (
                <div className="flex items-center text-sm text-red-600 justify-center my-4 text-center px-4">
                    <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            );
         }
          if (otpError && !requestId && !finalStatus) {
             return (
                <div className="flex items-center text-sm text-red-600 justify-center my-4 text-center px-4">
                    <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{otpError}</span>
                </div>
             );
         }

         if (isCheckingStatus) {
            return (
                <div className="flex items-center text-sm text-yellow-600 justify-center my-4 text-center px-4">
                    <ClockIcon className="h-5 w-5 mr-2 animate-spin flex-shrink-0" />
                    <span>{otpMessage || 'Checking status...'}</span>
                </div>
            );
         }
         if (requestId && !isCheckingStatus && !finalStatus) {
             return (
                 <div className="flex items-center text-sm text-blue-600 justify-center my-4 text-center px-4">
                    <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{otpMessage || 'Processing verification... Please wait.'}</span>
                </div>
            );
         }
        if (!isSubmittingOtp && !requestId && !finalStatus) {
             return (
                <div className="flex items-center text-sm text-green-600 justify-center my-4 text-center px-4">
                    <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>
                        Enter the 4-digit code sent to{' '}
                        <span className="font-medium text-gray-800">{displayEmail || 'your email'}</span>.
                    </span>
                </div>
            );
        }
        return (
             <p className="mt-2 text-center text-sm text-gray-600">
                Please enter the verification code.
            </p>
        );
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 4) {
           dispatch(updateOtpValue(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (canSubmit && otpValue.length === 4 && displayEmail) {
            dispatch(verifyOtp({ email: displayEmail, otpValue: otpValue }));
        } else if (!displayEmail) {
             console.error("Cannot submit OTP: Email not found in state.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center mb-6">
                    <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
                    <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
                    Verify Your Account
                </h2>
                {renderStatusInfo()}
            </div>

            {!finalStatus && !(otpError && !requestId) && (
                 <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">

                        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                            <InputField
                                label="Verification Code"
                                type="text"
                                inputMode="numeric"
                                name="otp"
                                value={otpValue}
                                onChange={handleOtpChange}
                                required
                                placeholder="Enter 4-digit code"
                                maxLength={4}
                                disabled={isProcessing || !!requestId}
                                autoComplete="one-time-code"
                            />
                            <div>
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || otpValue.length !== 4 || isProcessing || !!requestId}
                                    isLoading={isProcessing}
                                    fullWidth
                                    className='cursor-pointer'
                                >
                                    {isCheckingStatus ? 'Checking...' : (requestId ? 'Processing...' : 'Verify Account')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OtpVerification;