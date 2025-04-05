import React, { useState } from 'react'; // Import useState for loading/error
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import useForm from "../hooks/useForm"; // Assuming path is correct
import InputField from "../components/forms/InputField"; // Assuming path is correct
import ImageUpload from "../components/forms/ImageUpload"; // Assuming path is correct

const Register = () => {
  // No need to destructure setFormData if handleChange handles everything
  const { formData, handleChange, resetForm } = useForm({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null, // Store the File object here
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // For field-specific errors

  // Remove the redundant handleImageChange handler

  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setError(null); // Clear general errors
    setValidationErrors({}); // Clear validation errors
    setIsLoading(true);

    // --- Basic Client-Side Validation ---
    let currentErrors = {};
    if (formData.password !== formData.confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match!";
    }
    if (formData.password.length < 8) {
        currentErrors.password = "Password must be at least 8 characters long.";
    }
    // Add more validation as needed (e.g., username format, email format)

    if (Object.keys(currentErrors).length > 0) {
        setValidationErrors(currentErrors);
        setIsLoading(false);
        return; // Stop submission if validation fails
    }
    // --- End Validation ---


    // Prepare data for API
    const registrationData = new FormData(); // Use FormData for file uploads
    registrationData.append('username', formData.username);
    registrationData.append('email', formData.email);
    registrationData.append('password', formData.password);
    if (formData.image instanceof File) { // Ensure it's a file before appending
        registrationData.append('profileImage', formData.image, formData.image.name); // Key needs to match backend
    }

    console.log('Sending registration data...'); // Log before sending

    try {
        // --- ACTUAL REGISTRATION API CALL ---
        const response = await fetch('/api/auth/register', { // Your registration endpoint
            method: 'POST',
            body: registrationData, // Send FormData directly, no 'Content-Type' header needed for FormData with fetch
        });

        if (!response.ok) {
            const errorData = await response.json(); // Or response.text()
            // Handle specific field errors from backend if available
            if (response.status === 400 && errorData.errors) {
                 setValidationErrors(errorData.errors); // Assuming backend returns errors keyed by field name
            } else {
                setError(errorData.message || `Registration failed: ${response.statusText}`);
            }
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Registration successful:', result);

        // Optional: Show success message briefly?
        // resetForm(); // Reset form on success
        navigate('/login', { state: { registrationSuccess: true } }); // Redirect to login, maybe pass success state

        // --- END API CALL ---

    } catch (err) {
        console.error('Registration failed:', err);
        // Error state might already be set if it was an HTTP error
        if (!error && !Object.keys(validationErrors).length > 0) {
            setError(err.message || 'An unexpected error occurred during registration.');
        }
    } finally {
        setIsLoading(false);
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
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Use 'multipart/form-data' is automatically handled by browser when using FormData with fetch */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
             {/* Display General Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                 <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <InputField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              disabled={isLoading}
            />
             {validationErrors.username && <p className="text-xs text-red-600 mt-1">{validationErrors.username}</p>}


            <InputField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              disabled={isLoading}
            />
             {validationErrors.email && <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>}


            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min 8 chars)"
              minLength="8" // HTML5 validation hint
              disabled={isLoading}
              // Aria describedby could link to error message below for accessibility
            />
             {validationErrors.password && <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>}


            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              disabled={isLoading}
            />
             {validationErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>}


            {/* Profile Picture Upload */}
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture (Optional)
                 </label>
                 <ImageUpload
                    name="image" // Must match the key in useForm initialState
                    onChange={handleChange} // Directly use the handler from useForm
                    // Pass existing image URL for preview if applicable and if ImageUpload supports it
                    // currentImageUrl={/* logic to create preview URL from formData.image */}
                 />
                 {/* You might want to display the selected filename here */}
                 {formData.image && <p className="text-xs text-gray-500 mt-1">Selected: {formData.image.name}</p>}
                 {validationErrors.profileImage && <p className="text-xs text-red-600 mt-1">{validationErrors.profileImage}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
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