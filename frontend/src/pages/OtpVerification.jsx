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

  // --- Cooldown Timer Effect ---
  useEffect(() => {
    let timerId;
    if (resendCooldown > 0) {
      setCanResend(false); // Cannot resend during cooldown
      timerId = setInterval(() => {
        setResendCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    } else {
      setCanResend(true); // Can resend when cooldown reaches 0
    }

    // Cleanup function to clear interval when component unmounts or cooldown changes
    return () => clearInterval(timerId);
  }, [resendCooldown]);

  // --- Initial Resend Availability ---
  // Allow resend immediately on load OR after first cooldown completes
   useEffect(() => {
     if (resendCooldown === 0) {
       setCanResend(true);
     }
   }, []); // Run only once on mount

  // --- Handler Functions ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length < 6) { // Basic validation (adjust length if needed)
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setError(null);
    setIsLoading(true);

    console.log('Verifying OTP:', { email: email || 'unknown', otp: formData.otp });

    try {
      // --- API CALL: VERIFY OTP ---
      // Replace with your actual API endpoint and logic
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, otp: formData.otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Verification failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('OTP Verification successful:', result);

      // Clear form, potentially show success message
      resetForm();
      // Redirect to login or dashboard after successful verification
      navigate('/login', { state: { verificationSuccess: true } }); // Or '/dashboard' if auto-login

    } catch (err) {
      console.error('OTP Verification failed:', err);
      setError(err.message || 'Invalid or expired OTP. Please try again.');
      resetForm(); // Clear potentially wrong OTP
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending || !email) {
         if (!email) setError("Cannot resend OTP: Email address is missing.");
         return; // Don't resend if on cooldown, already resending, or no email
    }
    setError(null);
    setIsResending(true); // Use separate loading state for resend

    console.log('Requesting OTP resend for:', email);

    try {
      // --- API CALL: RESEND OTP ---
      // Replace with your actual API endpoint and logic
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to resend OTP: ${response.statusText}`);
      }

      console.log('OTP Resend request successful');
      // Start the cooldown timer
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setCanResend(false); // Disable immediately after successful request

    } catch (err) {
      console.error('OTP Resend failed:', err);
      setError(err.message || 'Could not resend OTP. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  // --- Component Rendering ---
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