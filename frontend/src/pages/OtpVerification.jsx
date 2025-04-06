// src/pages/OtpVerification.js (UI Only)
import React from 'react'; // Removed useState, useEffect, useRef
import { Link } from 'react-router-dom'; // Keep Link for navigation structure
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField';
import Button from '../components/forms/Button';
// Removed: useNavigate, useDispatch, useSelector
// Removed: Redux imports (verifyOtp, resendOtp, checkOtpStatus, selectors, clearOtpError)
// Removed: Constants (POLLING_INTERVAL, MAX_POLLING_ATTEMPTS)

function OtpVerification() {
    // Removed: otpValue state
    // Removed: dispatch, navigate
    // Removed: pollingIntervalRef, pollingAttemptsRef
    // Removed: All Redux selectors (user, isVerified, isLoading, errors, messages, status etc.)
    // Removed: All useEffect hooks
    // Removed: handleOtpChange, handleSubmit, handleResendOtp, renderStatusInfo functions

    // Static placeholder values for display
    const staticDisplayEmail = 'user@example.com';
    const staticOtpValue = ''; // Or '12' for partial input example
    const staticOtpError = null; // Or 'Static: Invalid OTP'
    const staticOtpMessage = null; // Or 'Static: OTP Resent'
    const staticIsLoading = false;
    const staticIsCheckingOtpStatus = false; // Static polling indicator example
    const staticIsVerified = false;
    const staticCanVerify = true; // Example: Assume OTP can be verified in this static view
    const staticOtpDeliveryStatus = 'sent'; // Example status: 'sent', 'pending_send', 'failed', etc.

    // Simplified Static Status Info (example)
    const renderStaticStatusInfo = () => {
        // You can manually set which status to display for UI preview
        const status = staticOtpDeliveryStatus;

        if (status === 'sent') {
             return ( <div className="flex items-center text-sm text-green-600 justify-center mb-4"> <CheckCircleIcon className="h-5 w-5 mr-2" /> OTP Sent! Please check {staticDisplayEmail}. </div> );
        }
        if (status === 'pending_send') {
             return ( <div className="flex items-center text-sm text-yellow-600 justify-center mb-4"> <ClockIcon className="h-5 w-5 mr-2 animate-spin" /> Waiting for OTP to be sent... </div> );
        }
        // Add other static status examples if needed
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Header */}
             <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center mb-6">
                    <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
                    <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
                </Link>
                 <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Verify Your Account
                </h2>
                 {/* Display static status or description */}
                 {renderStaticStatusInfo()}
                 {staticOtpDeliveryStatus !== 'sent' && !staticIsVerified && (
                     <p className="mt-2 text-center text-sm text-gray-600">
                         Enter the 4-digit code sent to
                         <br />
                         <span className="font-medium text-gray-800">{staticDisplayEmail}</span>
                     </p>
                 )}
            </div>


            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                    {/* Display Static Error Example */}
                    {staticOtpError && ( <div className="rounded-md bg-red-50 p-4 mb-4"> <div className="flex"> <div className="flex-shrink-0"> <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" /> </div> <div className="ml-3"> <p className="text-sm font-medium text-red-800">{staticOtpError}</p> </div> </div> </div> )}
                     {/* Display Static Message Example */}
                    {staticOtpMessage && !staticOtpError && ( <div className="rounded-md bg-blue-50 p-4 mb-4"> <p className="text-sm font-medium text-blue-800">{staticOtpMessage}</p> </div> )}

                     {/* Removed onSubmit logic */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
                        <InputField
                            label="Verification Code"
                            type="text"
                            inputMode="numeric"
                            name="otp"
                            value={staticOtpValue} // Use static value
                            onChange={() => {}} // No-op function
                            required
                            placeholder="Enter 4-digit code"
                            maxLength={4} // Keep 4-digit length
                            disabled={!staticCanVerify || staticIsLoading || staticIsCheckingOtpStatus} // Use static values
                            autoComplete="one-time-code"
                        />

                        <div>
                            {/* Removed isLoading prop and dynamic disabled */}
                            <Button
                                type="submit"
                                disabled={!staticCanVerify || staticOtpValue.length !== 4 || staticIsLoading || staticIsCheckingOtpStatus} // Use static values
                                fullWidth
                            >
                                Verify Account
                            </Button>
                        </div>
                    </form>

                    {/* Resend button section */}
                     <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">Didn't receive the code?</p>
                        <Button
                            variant="link"
                            onClick={() => {}} // No-op function
                            disabled={staticIsLoading || staticIsCheckingOtpStatus} // Use static values
                            className="mt-1"
                            fullWidth={false}
                        >
                            Resend OTP
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default OtpVerification;