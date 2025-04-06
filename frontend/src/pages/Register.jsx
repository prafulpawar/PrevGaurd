// Register.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import InputField from "../components/forms/InputField";
import ImageUpload from "../components/forms/ImageUpload";
import Button from '../components/forms/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
    registerUser,
    selectAuthLoading,
    selectAuthError,
    updateRegisterFormData,
    selectRegisterFormData,
    clearAuthError, // Import action to clear error
} from '../redux/slice/authSlice'; // Adjust path as needed

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const formData = useSelector(selectRegisterFormData);
    const [validationErrors, setValidationErrors] = useState({});

     // Clear registration error when component mounts or unmounts
     useEffect(() => {
        // Clear error when component mounts
        dispatch(clearAuthError());
        // Optional: Clear error when component unmounts
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        // Clear validation error for the field being changed
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
        // Clear global auth error when user starts typing again
        if (error) {
            dispatch(clearAuthError());
        }
        dispatch(updateRegisterFormData({ name, value: type === 'file' ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({}); // Reset validation errors
        dispatch(clearAuthError()); // Clear previous API error

        let currentErrors = {};
        // Basic Validations (Add more as needed)
        if (!formData.username.trim()) currentErrors.username = 'Username is required.';
        if (!formData.email.trim()) currentErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) currentErrors.email = 'Email is invalid.';
        if (!formData.password) currentErrors.password = 'Password is required.';
        else if (formData.password.length < 8) currentErrors.password = 'Password must be at least 8 characters long.';
        if (formData.password !== formData.confirmPassword) currentErrors.confirmPassword = 'Passwords do not match!';


        if (Object.keys(currentErrors).length > 0) {
            setValidationErrors(currentErrors);
            return;
        }

        const registrationData = new FormData();
        registrationData.append('username', formData.username);
        registrationData.append('email', formData.email);
        registrationData.append('password', formData.password);
        if (formData.image instanceof File) {
            // Ensure the backend expects 'profileImage' as the key
            registrationData.append('profileImage', formData.image, formData.image.name);
        }

        try {
            // Dispatch and wait for the result using unwrap()
            // unwrap() will automatically throw an error if the thunk is rejected
            await dispatch(registerUser(registrationData)).unwrap();

            // Navigate ONLY on successful registration (fulfilled state)
            navigate('/otp-verification');

        } catch (rejectedValueOrSerializedError) {
            // Error is already set in the Redux state by the rejected reducer
            // You could log it here for debugging if needed
            console.error('Registration failed:', rejectedValueOrSerializedError);
            // If the error payload is a string, it's already in state.error
            // If it's an object, you might need to parse it, but rejectWithValue should handle strings.
            // No navigation on failure
        }
    };

    // ... rest of the component remains largely the same ...
    // Make sure to display validationErrors correctly under each field

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* ... Header ... */}
             <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center mb-6">
                    <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
                    <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            </div>


            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {/* Display Redux error (API errors) */}
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
                            error={validationErrors.username} // Pass validation error
                        />
                        {/* Removed duplicate error display */}

                        <InputField
                            label="Email address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            disabled={isLoading}
                            error={validationErrors.email} // Pass validation error
                        />
                        {/* Removed duplicate error display */}

                         <InputField
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password (min 8 chars)"
                            minLength="8"
                            disabled={isLoading}
                            error={validationErrors.password} // Pass validation error
                        />
                        {/* Removed duplicate error display */}

                        <InputField
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-enter your password"
                            disabled={isLoading}
                             error={validationErrors.confirmPassword} // Pass validation error
                        />
                        {/* Removed duplicate error display */}


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Picture (Optional)
                            </label>
                            <ImageUpload name="image" onChange={handleChange} />
                            {formData.image && (
                                <p className="text-xs text-gray-500 mt-1">Selected: {formData.image.name}</p>
                            )}
                             {/* Add validation error display if needed */}
                             {validationErrors.profileImage && (
                                <p className="text-xs text-red-600 mt-1">{validationErrors.profileImage}</p>
                            )}
                        </div>

                        <div>
                            <Button type="submit" isLoading={isLoading} disabled={isLoading} fullWidth>
                                {isLoading ? 'Registering...' : 'Register'}
                            </Button>
                        </div>
                    </form>

                     <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className={`font-medium text-indigo-600 hover:text-indigo-500 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
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