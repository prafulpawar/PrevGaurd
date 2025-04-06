import React, { useState } from 'react';
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
} from '../redux/slice/authSlice';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const formData = useSelector(selectRegisterFormData);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        dispatch(updateRegisterFormData({ name, value: type === 'file' ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        let currentErrors = {};
        if (formData.password !== formData.confirmPassword) {
            currentErrors.confirmPassword = 'Passwords do not match!';
        }
        if (formData.password.length < 8) {
            currentErrors.password = 'Password must be at least 8 characters long.';
        }

        if (Object.keys(currentErrors).length > 0) {
            setValidationErrors(currentErrors);
            return;
        }

        const registrationData = new FormData();
       
        registrationData.append('username', formData.username);
        registrationData.append('email', formData.email);
        registrationData.append('password', formData.password);
        if (formData.image instanceof File) {
            registrationData.append('profileImage', formData.image, formData.image.name);
        }

        
        dispatch(registerUser(registrationData));
        // navigate('/otp-verification')
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                        {validationErrors.username && (
                            <p className="text-xs text-red-600 mt-1">{validationErrors.username}</p>
                        )}

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
                        {validationErrors.email && (
                            <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                        )}

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
                        />
                        {validationErrors.password && (
                            <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
                        )}

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
                        {validationErrors.confirmPassword && (
                            <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Picture (Optional)
                            </label>
                            <ImageUpload name="image" onChange={handleChange} />
                            {formData.image && (
                                <p className="text-xs text-gray-500 mt-1">Selected: {formData.image.name}</p>
                            )}
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