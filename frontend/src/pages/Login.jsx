import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import useLoginForm from '../hooks/useLoginForm'; // Assuming path is correct
import InputField from '../components/forms/InputField'; // Assuming path is correct
import { useState } from 'react'; // Import useState for loading/error states

function Login() {
  const { formData, handleChange, resetForm } = useLoginForm({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for displaying login errors

  const handleSubmit = async (e) => { // Make handleSubmit async
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true); // Set loading state

    console.log('Attempting to log in User:', formData);

    try {
      // --- THIS IS WHERE YOUR LOGIN LOGIC GOES ---
      // Example: Replace with your actual API call
      const response = await fetch('/api/auth/login', { // Your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle non-2xx responses (e.g., 401 Unauthorized, 400 Bad Request)
        const errorData = await response.json(); // Or response.text() if error isn't JSON
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // If login is successful:
      const data = await response.json(); // Process login response (e.g., get JWT token)
      console.log('Login successful:', data);

      // Store token (e.g., in localStorage or context/state management)
      // localStorage.setItem('authToken', data.token);

      // resetForm(); // Optional: reset form after successful login
      navigate('/dashboard'); // Redirect to a protected route (e.g., dashboard)

      // --- END OF LOGIN LOGIC ---

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.'); // Set error message for display
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
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
            {/* Display Login Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <InputField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              disabled={isLoading} // Disable input when loading
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={isLoading} // Disable input when loading
            />

            {/* ... (Forgot Password link) ... */}
             <div className="flex items-center justify-between">
                 <div className="text-sm ml-auto"> {/* Push "Forgot password" to the right */}
                 <Link to="/forgot-password" // Create this route later
                     className={`font-medium text-indigo-600 hover:text-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => isLoading && e.preventDefault()} // Prevent navigation if loading
                 >
                     Forgot your password?
                 </Link>
                 </div>
             </div>

            <div>
              <button
                type="submit"
                disabled={isLoading} // Disable button when loading
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing In...' : 'Sign in'} {/* Show loading text */}
              </button>
            </div>
          </form>

          {/* ... (Separator and Register link) ... */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Not a member?{' '}
              <Link to="/register" className={`font-medium text-indigo-600 hover:text-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                 onClick={(e) => isLoading && e.preventDefault()} // Prevent navigation if loading
              >
                Register here
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Login;