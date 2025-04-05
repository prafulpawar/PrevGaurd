// src/pages/Register.jsx (or wherever your Register component lives)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import useForm from "../hooks/useForm"; // Adjust path if needed
import InputField from "../components/forms/InputField"; // Adjust path
import ImageUpload from "../components/forms/ImageUpload"; // Adjust path
import Button from '../components/forms/Button'; // Assuming you use the reusable Button

const Register = () => {
  const { formData, handleChange, resetForm } = useForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    setIsLoading(true);

    // --- Client-Side Validation ---
    let currentErrors = {};
    if (formData.password !== formData.confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match!";
    }
    if (formData.password.length < 8) {
        currentErrors.password = "Password must be at least 8 characters long.";
    }
    // Add more validation as needed

    if (Object.keys(currentErrors).length > 0) {
        setValidationErrors(currentErrors);
        setIsLoading(false);
        return;
    }
    // --- End Validation ---

    const registrationData = new FormData();
    registrationData.append('username', formData.username);
    registrationData.append('email', formData.email);
    registrationData.append('password', formData.password);
    if (formData.image instanceof File) {
        registrationData.append('profileImage', formData.image, formData.image.name);
    }

    console.log('Sending registration data...');

    try {
        // --- ACTUAL REGISTRATION API CALL ---
        const response = await fetch('/api/auth/register', { // Replace with your endpoint
            method: 'POST',
            body: registrationData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 && errorData.errors) {
                 setValidationErrors(errorData.errors);
            } else {
                setError(errorData.message || `Registration failed: ${response.statusText}`);
            }
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Registration successful:', result);

        // --- *** REDIRECTION CHANGE HERE *** ---
        // Instead of navigating to login, navigate to profile.
        // NOTE: This assumes successful registration *also* logs the user in OR
        // that the profile page doesn't strictly require immediate authentication
        // OR that you might implement an OTP step next.
        // If OTP is needed, you would navigate to '/otp-verification' first.
        navigate('/profile');
        // No need to pass state unless the profile page specifically needs it.
        // navigate('/profile', { state: { registrationSuccess: true } }); // <-- Alternative if needed

        // Consider if resetForm() is desired here or handled by leaving the page.
        // resetForm();

    } catch (err) {
        console.error('Registration failed:', err);
        if (!error && !Object.keys(validationErrors).length > 0) {
            setError(err.message || 'An unexpected error occurred during registration.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  // --- Return JSX (using Button component for consistency) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
         {/* Logo and Brand */}
         <Link to="/" className="flex justify-center items-center mb-6">
            <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                 <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Choose a username" disabled={isLoading} />
            {validationErrors.username && <p className="text-xs text-red-600 mt-1">{validationErrors.username}</p>}

            <InputField label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" disabled={isLoading} />
            {validationErrors.email && <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>}

            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password (min 8 chars)" minLength="8" disabled={isLoading} />
            {validationErrors.password && <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>}

            <InputField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter your password" disabled={isLoading} />
            {validationErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>}

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture (Optional)
                 </label>
                 <ImageUpload name="image" onChange={handleChange} />
                 {formData.image && <p className="text-xs text-gray-500 mt-1">Selected: {formData.image.name}</p>}
                 {validationErrors.profileImage && <p className="text-xs text-red-600 mt-1">{validationErrors.profileImage}</p>}
            </div>

            <div>
              {/* Using the reusable Button component */}
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                fullWidth // Ensure it takes full width like the original button
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
             <Link to="/login" className={`font-medium text-indigo-600 hover:text-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => isLoading && e.preventDefault()}
             >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;