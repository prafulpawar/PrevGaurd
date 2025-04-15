// SharedDataDashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../pages/Navbar'; // Adjust the import path if necessary
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhoneIcon, MapPinIcon, ScaleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSharedData, addSharedData, updateSharedData, deleteSharedData } from '../redux/slice/sharedDataSlice'; // Adjust the import path

ChartJS.register(ArcElement, Tooltip, Legend);

function SharedDataDashboard() {
  const dispatch = useDispatch();
  const { apps, loading, error, adding, addingError, updating, updatingError, deleting, deletingError } = useSelector((state) => state.sharedData);
  const [riskScore, setRiskScore] = useState(75);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newAppData, setNewAppData] = useState({
    appName: '',
    emailUsed: '',
    phoneUsed: false,
    locationAccess: false,
    notes: '',
  });
  const [updateAppData, setUpdateAppData] = useState({
    _id: '',
    appName: '',
    emailUsed: '',
    phoneUsed: false,
    locationAccess: false,
    notes: '',
  });
  const [selectedAppId, setSelectedAppId] = useState(null);

  useEffect(() => {
    dispatch(fetchSharedData());
  }, [dispatch]);

  // Add Modal Functions
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewAppData({
      appName: '',
      emailUsed: '',
      phoneUsed: false,
      locationAccess: false,
      notes: '',
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAppData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddApp = () => {
    dispatch(addSharedData(newAppData));
  };

  useEffect(() => {
    if (!adding && addingError) {
      console.error("Error adding data:", addingError);
      // Optionally display an error message
    }
    if (!adding && !addingError && isAddModalOpen) {
      handleCloseAddModal();
      setNewAppData({
        appName: '',
        emailUsed: '',
        phoneUsed: false,
        locationAccess: false,
        notes: '',
      });
    }
  }, [adding, addingError, isAddModalOpen]);

  // Update Modal Functions
  const handleOpenUpdateModal = (app) => {
    setUpdateAppData({ ...app });
    setIsUpdateModalOpen(true);
    setSelectedAppId(app._id);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateAppData({
      _id: '',
      appName: '',
      emailUsed: '',
      phoneUsed: false,
      locationAccess: false,
      notes: '',
    });
    setSelectedAppId(null);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateAppData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateApp = () => {
    if (selectedAppId) {
      dispatch(updateSharedData({ id: selectedAppId, updatedData: updateAppData }));
    }
  };

  useEffect(() => {
    if (!updating && updatingError) {
      console.error("Error updating data:", updatingError);
      // Optionally display an error message
    }
    if (!updating && !updatingError && isUpdateModalOpen) {
      handleCloseUpdateModal();
    }
  }, [updating, updatingError, isUpdateModalOpen]);

  // Delete Function
  const handleDeleteApp = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteSharedData(id));
    }
  };

  useEffect(() => {
    if (!deleting && deletingError) {
      console.error("Error deleting data:", deletingError);
      // Optionally display an error message
    }
  }, [deleting, deletingError]);

  const chartData = useMemo(() => {
    if (loading || apps.length === 0) {
      return null;
    }

    const phoneSharedCount = apps.filter(app => app.phoneUsed).length;
    const locationSharedCount = apps.filter(app => app.locationAccess).length;
    const emailSharedCount = apps.length;

    return {
      labels: ['Email Shared', 'Phone Shared', 'Location Shared'],
      datasets: [
        {
          label: '# of Apps Sharing Data',
          data: [emailSharedCount, phoneSharedCount, locationSharedCount],
          backgroundColor: [
            'rgba(99, 102, 241, 0.6)',
            'rgba(234, 179, 8, 0.6)',
            'rgba(16, 185, 129, 0.6)',
          ],
          borderColor: [
            'rgba(99, 102, 241, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(16, 185, 129, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [apps, loading]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data Sharing Overview',
        font: {
          size: 16
        }
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Shared Data Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Track applications where you've shared personal information.</p>
          </header>
          <p className="text-center text-gray-500">Loading shared data...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Shared Data Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Track applications where you've shared personal information.</p>
          </header>
          <p className="text-center text-red-500">Error loading shared data: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Shared Data Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Track applications where you've shared personal information.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
          <div className="md:col-span-1 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow flex items-center space-x-3 h-full">
            <ScaleIcon className="h-8 w-8 flex-shrink-0" />
            <div>
              <span className="block text-sm font-medium uppercase tracking-wider">Data Risk Score</span>
              <span className="block text-3xl font-bold">{loading || adding || updating || deleting ? '...' : `${riskScore}%`}</span>
            </div>
          </div>

          <div className="md:col-span-1 bg-white shadow rounded-lg p-4 min-h-[200px] flex flex-col justify-center">
            {chartData ? (
              <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-center text-gray-500">{loading ? 'Loading chart data...' : 'No app data to display chart.'}</p>
            )}
          </div>

          <div className="md:col-span-1 flex md:justify-end items-start">
            <button
              className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:{adding || updating || deleting}"
              onClick={handleOpenAddModal}
              disabled={adding || updating || deleting}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {adding ? 'Adding...' : 'Track New App'}
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracked Applications</h2>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {apps.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {apps.map((app) => (
                <li key={app._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-semibold text-indigo-600 truncate">{app.appName}</p>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      <button
                        title="Edit App"
                        className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
                        onClick={() => handleOpenUpdateModal(app)}
                        disabled={adding || updating || deleting}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        title="Remove App"
                        className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full"
                        onClick={() => handleDeleteApp(app._id)}
                        disabled={adding || updating || deleting}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-1 text-sm mb-2">
                    <p className="flex items-center text-gray-600">
                      <EyeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Email: {app.emailUsed}
                    </p>
                    <p className={`flex items-center ${app.phoneUsed ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                      <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      {app.phoneUsed ? 'Phone shared' : 'Phone not shared'}
                    </p>
                    <p className={`flex items-center ${app.locationAccess ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                      {app.locationAccess ? 'Location shared' : 'Location not shared'}
                    </p>
                  </div>

                  {app.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="flex items-start text-sm text-gray-700">
                        <InformationCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
                        <span className="font-medium mr-1">Notes:</span> {app.notes}
                      </p>
                    </div>
                  )}
                  {!app.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="flex items-center text-sm text-gray-400 italic">
                        <InformationCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5" aria-hidden="true" />
                        No notes added for this app.
                      </p>
                    </div>
                  )}

                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center p-10 text-gray-500">No apps tracked yet. Click "Track New App" to get started.</p>
          )}
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add New Application
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label htmlFor="appName" className="block text-gray-700 text-sm font-bold mb-2">App Name:</label>
                      <input type="text" id="appName" name="appName" value={newAppData.appName} onChange={handleAddInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="emailUsed" className="block text-gray-700 text-sm font-bold mb-2">Email Used:</label>
                      <input type="email" id="emailUsed" name="emailUsed" value={newAppData.emailUsed} onChange={handleAddInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                      <label className="inline-flex items-center">
                        <input type="checkbox" name="phoneUsed" checked={newAppData.phoneUsed} onChange={handleAddInputChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                        <span className="ml-2 text-gray-700 text-sm">Phone Shared</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="inline-flex items-center">
                        <input type="checkbox" name="locationAccess" checked={newAppData.locationAccess} onChange={handleAddInputChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                        <span className="ml-2 text-gray-700 text-sm">Location Access</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
                      <textarea id="notes" name="notes" value={newAppData.notes} onChange={handleAddInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    {addingError && <p className="text-red-500 text-sm">{addingError}</p>}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:{adding}"
                    onClick={handleAddApp}
                    disabled={adding}
                  >
                    {adding ? 'Adding...' : 'Add App'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseAddModal}
                    disabled={adding}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {isUpdateModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Edit Application
                  </h3>
                  <div className="mt-2">
                    <div className="mb-4">
                      <label htmlFor="appName" className="block text-gray-700 text-sm font-bold mb-2">App Name:</label>
                      <input type="text" id="appName" name="appName" value={updateAppData.appName} onChange={handleUpdateInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="emailUsed" className="block text-gray-700 text-sm font-bold mb-2">Email Used:</label>
                      <input type="email" id="emailUsed" name="emailUsed" value={updateAppData.emailUsed} onChange={handleUpdateInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                      <label className="inline-flex items-center">
                        <input type="checkbox" name="phoneUsed" checked={updateAppData.phoneUsed} onChange={handleUpdateInputChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                        <span className="ml-2 text-gray-700 text-sm">Phone Shared</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="inline-flex items-center">
                        <input type="checkbox" name="locationAccess" checked={updateAppData.locationAccess} onChange={handleUpdateInputChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                        <span className="ml-2 text-gray-700 text-sm">Location Access</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
                      <textarea id="notes" name="notes" value={updateAppData.notes} onChange={handleUpdateInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    {updatingError && <p className="text-red-500 text-sm">{updatingError}</p>}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:{updating}"
                    onClick={handleUpdateApp}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Update App'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseUpdateModal}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SharedDataDashboard;