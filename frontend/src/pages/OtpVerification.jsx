// src/pages/OtpVerification.js (UI Only)

import React from 'react'; // Basic React import
import { Link } from 'react-router-dom'; // Keep Link for navigation structure
import { ShieldCheckIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'; // Icons for UI
import InputField from '../components/forms/InputField'; // Reusable Input component

function OtpVerification() {
  
    const staticDisplayEmail = 'user@example.com';
    const staticOtpValue = ''; // Example: '' or '1234'
    const staticOtpError = null; // Example: null or 'Invalid OTP code. Please try again.'
    const staticOtpMessage = null; // Example: null or 'A new OTP has been sent.'
    const staticIsLoading = false; // Example: true (shows button loading state), false
    const staticIsCheckingOtpStatus = false; // Example: true (disables inputs during hypothetical polling)
    const staticIsVerified = false; // Example: true (could hide form, show success message), false
    const staticCanVerify = true; // Example: true (enables verify button), false
    const staticCanResend = true; // Example: true (enables resend button), false
    const staticOtpDeliveryStatus = 'sent'; // Example status: 'sent', 'pending_send', 'failed'

    // --- Simplified Static Status Info Renderer ---
    const renderStaticStatusInfo = () => {
        // Manually set which status to display for UI preview
        const status = staticOtpDeliveryStatus; // Use the placeholder

        if (status === 'sent' && !staticIsVerified) {
             return (
                 <div className="flex items-center text-sm text-green-600 justify-center my-4 text-center px-4">
                     <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                     <span>
                         Enter the 4-digit code sent to{' '}
                         <span className="font-medium text-gray-800">{staticDisplayEmail}</span>.
                     </span>
                 </div>
             );
        }
        if (status === 'pending_send' && !staticIsVerified) {
             return (
                 <div className="flex items-center text-sm text-yellow-600 justify-center my-4 text-center px-4">
                     <ClockIcon className="h-5 w-5 mr-2 animate-spin flex-shrink-0" />
                     <span>Waiting for OTP to be sent...</span>
                 </div>
             );
        }
         if (status === 'failed' && !staticIsVerified) {
              return (
                  <div className="flex items-center text-sm text-red-600 justify-center my-4 text-center px-4">
                      <XCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>Failed to send OTP. Please try resending.</span>
                  </div>
              );
         }
         if (staticIsVerified) {
            return (
                 <div className="flex items-center text-sm text-green-600 justify-center my-4 text-center px-4">
                     <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                     <span>Account Verified Successfully!</span>
                     {/* Optionally add a link/button to proceed */}
                 </div>
            );
         }
        // Default message if no specific status matches or verification is done
        if (!staticIsVerified) {
             return (
                  <p className="mt-2 text-center text-sm text-gray-600">
                         Please enter the verification code.
                     </p>
             );
        }
        return null; // Return null if verified and no specific message needed
    };

    // --- Component Render ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Header */}
             <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center mb-6">
                    <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
                    <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
                </Link>
                 <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
                    Verify Your Account
                </h2>
                 {/* Display static status or description */}
                 {renderStaticStatusInfo()}
            </div>

            {/* Form Area */}
            {!staticIsVerified && ( // Only show the form if not verified
                 <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                        {/* Display Static Error Example */}
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

                         {/* Display Static Message Example (e.g., for OTP resent) */}
                        {staticOtpMessage && !staticOtpError && (
                             <div className="rounded-md bg-blue-50 p-4 mb-4">
                                 <div className="flex">
                                     {/* Optional: Add an icon like InformationCircleIcon */}
                                     <div className="ml-3">
                                         <p className="text-sm font-medium text-blue-800">{staticOtpMessage}</p>
                                     </div>
                                 </div>
                             </div>
                        )}

                         {/* Form with no logic */}
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
                            <InputField
                                label="Verification Code"
                                type="text"
                                inputMode="numeric" // Hint for mobile keyboards
                                name="otp" // Still useful for semantics/testing
                                value={staticOtpValue} // Use static value
                                onChange={() => {}} // No-op function: Does nothing
                                required // HTML5 validation hint
                                placeholder="Enter 4-digit code"
                                maxLength={4} // Enforce length visually
                                // Disable based on static flags
                                disabled={!staticCanVerify || staticIsLoading || staticIsCheckingOtpStatus}
                                autoComplete="one-time-code" // Helps password managers/browsers
                            />

                            <div>
                                <Button
                                    type="submit"
                                    // Disable based on static flags and input length
                                    disabled={!staticCanVerify || staticOtpValue.length !== 4 || staticIsLoading || staticIsCheckingOtpStatus}
                                    isLoading={staticIsLoading} // Pass static loading state to Button
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
                                onClick={() => {}} // No-op function: Does nothing
                                // Disable based on static flags
                                disabled={!staticCanResend || staticIsLoading || staticIsCheckingOtpStatus}
                                isLoading={staticIsLoading && !staticCanVerify } // Show loading maybe only if main action isn't also loading? Or just use staticIsLoading
                                className="mt-1"
                                fullWidth={false} // Link buttons typically aren't full width
                            >
                                Resend OTP
                            </Button>
                        </div>

                    </div>
                </div>
            )}
            {/* You could add a section here to show if staticIsVerified is true */}
            {staticIsVerified && (
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-center">
                     {/* Optional: Add a button/link to navigate away after verification */}
                     <Link to="/dashboard"> {/* Example destination */}
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