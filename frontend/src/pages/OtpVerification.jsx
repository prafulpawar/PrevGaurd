// src/pages/OtpVerification.jsx (or wherever your pages live)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'; // Icons
import useOtpForm from '../hooks/useOtpForm'; // Adjust path if needed
import InputField from '../components/forms/InputField'; // Adjust path
import Button from '../components/forms/Button'; // Adjust path

const RESEND_COOLDOWN_SECONDS = 60; // Cooldown time in seconds

function OtpVerification() {
  const { formData, handleChange, resetForm } = useOtpForm({ otp: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Attempt to get email from navigation state (passed from Register page)
  const email = location.state?.email;

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false); // Start as false until cooldown expires or initially

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Brand */}
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
          <span className="font-medium text-gray-800">{email || 'your email address'}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Display General Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <InputField
              label="Verification Code"
              type="text" // Use text to allow pasting, could use "tel"
              inputMode="numeric" // Hint for numeric keyboard on mobile
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              placeholder="Enter 6-digit code"
              maxLength={6} // Enforce length
              disabled={isLoading || isResending}
             
            />

            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading || isResending || !formData.otp || formData.otp.length < 6}
              >
                Verify Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <Button
              variant="link"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading || isResending || !email}
              className="mt-1"
              fullWidth={false} // Don't make link full width
            >
              {isResending ? 'Sending...' :
               canResend ? 'Resend OTP' :
               `Resend OTP in ${resendCooldown}s`}
            </Button>
          </div>

           

        </div>
      </div>
    </div>
  );
}

export default OtpVerification;