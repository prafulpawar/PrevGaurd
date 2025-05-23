// src/pages/Profile.js
import React, { useEffect } from 'react';
import Navbar from '../pages/Navbar';
import { UserCircleIcon, KeyIcon, TrashIcon, FingerPrintIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../redux/slice/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    alert('Password change functionality not implemented yet.');
  };

  const handleAddPasskey = () => {
    alert('Add Passkey functionality not implemented yet.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion functionality not implemented yet.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center">
            <UserCircleIcon className="h-8 w-8 mr-2 text-gray-500" /> User Profile
          </h1>
        </header>

        <div className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <span className="block text-sm font-medium text-gray-500">Username</span>
                <p className="mt-1 text-md text-gray-900">{user?.username || 'N/A'}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Email Address</span>
                <p className="mt-1 text-md text-gray-900">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

         


        </div>
      </main>
    </div>
  );
}

export default Profile;