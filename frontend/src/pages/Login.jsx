// src/pages/Login.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import useLoginForm from '../hooks/useLoginForm';
import InputField from '../components/forms/InputField';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slice/authSlice';

function Login() {
  const { formData, handleChange } = useLoginForm({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
    .unwrap()
    .then(()=>{
      navigate('/')
    })
    .catch(()=>{});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a href="/" className="flex justify-center items-center mb-6">
          <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
        </a>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <InputField label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" disabled={isLoading} />
            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" disabled={isLoading} />
            <div className="flex items-center justify-between">
              <div className="text-sm ml-auto">
                <a href="/forgot-password" className={`font-medium text-indigo-600 hover:text-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>Forgot your password?</a>
              </div>
            </div>
            <div>
              <button type="submit" disabled={isLoading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isLoading ? 'Signing In...' : 'Sign in'}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Not a member?{' '}
            <a href="/register" className={`font-medium text-indigo-600 hover:text-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;