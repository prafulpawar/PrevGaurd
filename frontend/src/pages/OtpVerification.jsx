import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline'; 

import InputField from '../components/forms/InputField'; 
import Button from '../components/forms/Button';


function OtpVerification() {
 
  const [otpValue, setOtpValue] = useState('');


 
  const displayEmail = 'your email address';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
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
      
          <span className="font-medium text-gray-800">{displayEmail}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
     
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
         

            <InputField
              label="Verification Code"
              type="text"
              inputMode="numeric"
              name="otp"
              value={otpValue} 
              onChange={(e) => setOtpValue(e.target.value)} 
              required
              placeholder="Enter 6-digit code"
              maxLength={6}
             
            />

            <div>
              <Button
                type="submit"
               
              >
                Verify Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <Button
              variant="link"
           
              onClick={() => console.log('Resend OTP clicked (UI only)')} 
             
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