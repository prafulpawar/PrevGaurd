import React, { useState, useEffect } from 'react';
import Navbar from '../pages/Navbar'; 
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhoneIcon, MapPinIcon, ScaleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShareData, selectError, selectLoading, selectSucess , selectSuccessData, selectMessage } from '../redux/slice/shareSlice';


function SharedDataDashboard() {
  const [riskScore, setRiskScore] = useState(75);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

   const dispatch      = useDispatch();
  const showselectError   = useSelector(selectError);
  const showselectSucess  = useSelector(selectSucess);
  const showselectLoading = useSelector(selectLoading); 
  const showsucessData    = useSelector(selectSuccessData);
  const showMessage       = useSelector(selectMessage)

  console.log(showsucessData)
  useEffect(() => {
      dispatch(getAllShareData())
  }, []);

  // Add Modal Functions
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Update Modal Functions
  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Shared Data Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Track applications where you've shared personal information.</p>
        </header>

         {
              showselectError === true ? (<div className=' p-5 m-2 rounded-md bg-red-400 font-bold text-white'>
                  {showMessage}
              </div>) : (<>   </>)
         }



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
          <div className="md:col-span-1 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow flex items-center space-x-3 h-full">
            <ScaleIcon className="h-8 w-8 flex-shrink-0" />
            <div>
              <span className="block text-sm font-medium uppercase tracking-wider">Data Risk Score</span>
              <span className="block text-3xl font-bold">{riskScore}%</span>
            </div>
          </div>

          <div className="md:col-span-1 bg-white shadow rounded-lg p-4 min-h-[200px] flex flex-col justify-center">
            <p className="text-center text-gray-500">Chart data will be displayed here.</p>
          </div>

          <div className="md:col-span-1 flex md:justify-end items-start">
            <button
              className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleOpenAddModal}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Track New App
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracked Applications</h2>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <p className="text-center p-10 text-gray-500">Application data will be listed here.</p>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto top-25">
            <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0"> {/* Changed items-end to items-center and removed pt-4 pb-20 */}
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
                  <div className="mt-5 sm:mt-4">
                    <div className="mb-4">
                      <label htmlFor="appName" className="block text-gray-700 text-sm font-bold mb-2">App Name:</label>
                      <input type="text" id="appName" name="appName" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="emailUsed" className="block text-gray-700 text-sm font-bold mb-2">Email Used:</label>
                      <input type="email" id="emailUsed" name="emailUsed" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                      <label className="inline-flex items-center">
                        <input type="checkbox" name="phoneUsed" className="form-checkbox h-5 w-5 text-indigo-600" />
                        <span className="ml-2 text-gray-700 text-sm">Phone Shared</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="inline-flex items-center">
                        <input type="checkbox" name="locationAccess" className="form-checkbox h-5 w-5 text-indigo-600" />
                        <span className="ml-2 text-gray-700 text-sm">Location Access</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
                      <textarea id="notes" name="notes" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                    >
                      Submit
                    </button>
                </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseAddModal}
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
          <div className="fixed z-10 inset-0  overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"> {/* Changed items-end to items-center here as well for consistency if you decide to use it */}
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
                    <p className="text-sm text-gray-500">
                      Edit application form will be here.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseUpdateModal}
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