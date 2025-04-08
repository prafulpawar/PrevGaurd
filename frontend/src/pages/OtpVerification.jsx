import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField';
import Button from '../components/forms/Button';
import { getemail } from '../redux/slice/authSlice';
import { useSelector ,useDispatch } from 'react-redux';
import {
    selectOtpValue,
    selectOtpError,
    selectIsLoading,
    selectOtpMessage,
    selectIsVerified,
    updateOtpValue
} from '../redux/slice/otpSlice';

function OtpVerification() {
    const dispatch = useDispatch()
    const staticDisplayEmail = useSelector(getemail);
    const staticOtpValue =     useSelector(selectOtpValue)

    const staticOtpError = null;
    const staticOtpMessage = null;
    const staticIsLoading = false;
    const staticIsVerified = false;

    const staticCanVerify = !staticIsLoading && !staticIsVerified;
    const staticCanResend = !staticIsLoading && !staticIsVerified;
    const staticOtpDeliveryStatus = 'sent';

    const renderStaticStatusInfo = () => {
        const status = staticOtpDeliveryStatus;

        if (staticIsVerified) {
            return (
                <div className="flex items-center text-sm text-green-600 justify-center my-4 text-center px-4">
                    <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Account Verified Successfully!</span>
                </div>
            );
        }
        if (status === 'sent') {
            return (
                <div className="flex items-center text-sm text-green-600 justify-center my-4 text-center px-4">
                    <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>
                        Enter the 4-digit code sent to{' '}
                        <span className="font-medium text-gray-800">{staticDisplayEmail || 'your email'}</span>.
                    </span>
                </div>
            );
        }
        if (status === 'pending_send') {
            return (
                <div className="flex items-center text-sm text-yellow-600 justify-center my-4 text-center px-4">
                    <ClockIcon className="h-5 w-5 mr-2 animate-spin flex-shrink-0" />
                    <span>Sending OTP...</span>
                </div>
            );
        }
        if (status === 'failed') {
            return (
                <div className="flex items-center text-sm text-red-600 justify-center my-4 text-center px-4">
                    <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>Failed to send OTP. Please try resending.</span>
                </div>
            );
        }
        return (
            <p className="mt-2 text-center text-sm text-gray-600">
                Please enter the verification code.
            </p>
        );
    };

    const hadleSubmit = (e) =>{
        dispatch(updateOtpValue({value:}))
    }

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
                {renderStaticStatusInfo()}
            </div>

            {!staticIsVerified && (
                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                        {staticOtpError && (
                            <div className="rounded-md bg-red-50 p-4 mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-800">{staticOtpError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {staticOtpMessage && !staticOtpError && (
                            <div className="rounded-md bg-blue-50 p-4 mb-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-blue-800">{staticOtpMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
                            <InputField
                                label="Verification Code"
                                type="text"
                                inputMode="numeric"
                                name="otp"
                                value={staticOtpValue}
                                onChange={hadleSubmit}
                                required
                                placeholder="Enter 4-digit code"
                                maxLength={4}
                                disabled={!staticCanVerify || staticIsLoading}
                                autoComplete="one-time-code"
                            />

                            <div>
                                <Button
                                    type="submit"
                                    disabled={!staticCanVerify || staticOtpValue.length !== 4 || staticIsLoading}
                                    isLoading={staticIsLoading}
                                    fullWidth
                                >
                                    Verify Account
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">Didn't receive the code?</p>
                            <Button
                                variant="link"
                                onClick={() => {}}
                                disabled={!staticCanResend || staticIsLoading}
                                className="mt-1"
                                fullWidth={false}
                            >
                                Resend OTP
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {staticIsVerified && (
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <Link to="/dashboard">
                        <Button variant="primary">
                            Proceed to Dashboard
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default OtpVerification;