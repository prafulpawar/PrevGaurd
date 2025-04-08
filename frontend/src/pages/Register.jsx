import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField';
import ImageUpload from '../components/forms/ImageUpload';
import Button from '../components/forms/Button';
import {
  updateFormData,
  setFormData,
  Ierror,
  isLoading,
  registerUser,
  clearError,
} from '../redux/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector(setFormData);
  const error = useSelector(Ierror);
  const isLoadingValue = useSelector(isLoading);
  const validationErrors = {};

  const handleChange = (e) => {
    dispatch(updateFormData({ field: e.target.name, value: e.target.value }));
    dispatch(clearError());
    
  };

  const handleImageChange = (e) => {
    dispatch(updateFormData({ field: 'image', value: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    formToSend.append('username', formData.username);
    formToSend.append('email', formData.email);
    formToSend.append('password', formData.password);
    formToSend.append('confirmPassword', formData.confirmPassword);
    if (formData.image) {
      formToSend.append('image', formData.image);
    }
    dispatch(registerUser(formToSend));
    navigate('/otp-verification')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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

            <InputField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              disabled={isLoadingValue}
              error={validationErrors?.username}
            />

            <InputField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              disabled={isLoadingValue}
              error={validationErrors?.email}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min 8 chars)"
              minLength="8"
              disabled={isLoadingValue}
              error={validationErrors?.password}
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              disabled={isLoadingValue}
              error={validationErrors?.confirmPassword}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture (Optional)
              </label>
              <ImageUpload name="image" onChange={handleImageChange} />
              {validationErrors?.profileImage && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.profileImage}
                </p>
              )}
            </div>

            <div>
              <Button type="submit" isLoading={isLoadingValue} fullWidth>
                Register
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-medium text-indigo-600 hover:text-indigo-500 ${
                isLoadingValue ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => {
                if (isLoadingValue) e.preventDefault();
              }}
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