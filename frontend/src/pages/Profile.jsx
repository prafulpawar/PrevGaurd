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

          {/* <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-gray-800">Password</h3>
                <p className="text-sm text-gray-600 mt-1">Change your account password.</p>
                <button onClick={handleChangePassword} className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <KeyIcon className="h-5 w-5 mr-2 text-gray-400" /> Change Password
                </button>
              </div>

              <hr />

              <div>
                <h3 className="text-md font-medium text-gray-800">Passkeys (WebAuthn)</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your registered passkeys for passwordless login.</p>
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-gray-500 italic">No passkeys registered yet (or loading...).</div>
                  <button onClick={handleAddPasskey} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FingerPrintIcon className="h-5 w-5 mr-2" /> Add New Passkey
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border border-red-300">
            <h2 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-gray-800">Delete Account</h3>
                <p className="text-sm text-gray-600 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button onClick={handleDeleteAccount} className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <TrashIcon className="h-5 w-5 mr-2" /> Delete My Account
                </button>
              </div>
            </div>
          </div> */}


        </div>
      </main>
    </div>
  );
}

export default Profile;