import useLoginForm from '../hooks/useLoginForm';
import InputField from '../components/forms/InputField';
 
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline'; // For logo

function Login() {
  const { formData, handleChange, resetForm } = useLoginForm({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Use navigate if needed for post-login redirect

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in User:', formData);
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Brand */}
        <Link to="/" className="flex justify-center items-center mb-6">
            <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="you@example.com" 
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            {/* Optional: Remember me & Forgot Password */}
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                 <input
                   id="remember-me"
                   name="remember-me"
                   type="checkbox"
                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                 />
                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                   Remember me
                 </label>
               </div> */}

              <div className="text-sm ml-auto"> {/* Push "Forgot password" to the right */}
                <Link to="/forgot-password" // Create this route later
                   className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Separator */}
          {/* <div className="mt-6">
             <div className="relative">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-300" />
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
               </div>
             </div> */}
            {/* Add Social Login Buttons here if needed */}
          {/* </div> */}

          <p className="mt-6 text-center text-sm text-gray-600">
            Not a member?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;