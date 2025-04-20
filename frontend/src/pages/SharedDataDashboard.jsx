import React, { useState, useEffect } from 'react';
import Navbar from '../pages/Navbar'; 
import { PlusIcon, PencilIcon, PhoneIcon, MapPinIcon, ScaleIcon, InformationCircleIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllShareData,
    deleteAnSahreData,
    resetShareStatus, 
    selectError,
    selectLoading,
    selectSucess,
    selectSuccessData,
    selectMessage,
    addAnShareData,
    updateAnShareData,
    selectDataRisk
} from '../redux/slice/shareSlice'; 


function SharedDataDashboard() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentItemToUpdate, setCurrentItemToUpdate] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
  

  
    const [formData, setFormData] = useState({
        appName: '',
        emailUsed: '',
        phoneUsed: '',
        locationAccess: '',
        notes: ''
    });

   
    const [updateFormData, setUpdateFormData] = useState({
        _id: '',
        appName: '',
        emailUsed: '',
        phoneUsed: '',
        locationAccess: '',
        notes: ''
    });

    const dispatch = useDispatch();
    const isLoading = useSelector(selectLoading);
    const isSuccess = useSelector(selectSucess); 
    const isError = useSelector(selectError);
    const successData = useSelector(selectSuccessData); 
    const message = useSelector(selectMessage);
    const riskScore = useSelector(selectDataRisk)

    const applications = successData?.data || [];
  
    useEffect(() => {
        dispatch(getAllShareData());
    }, [dispatch]);

    useEffect(() => {
        let timer;
        if ((isSuccess || isError) && message) {
            timer = setTimeout(() => {
                
                 dispatch(resetShareStatus()); 
            }, 50); 
        }
        
        return () => clearTimeout(timer);
    }, [isSuccess, isError, message, dispatch]);


   
    const handleOpenAddModal = () => {
        setFormData({ appName: '', emailUsed: '', phoneUsed: '', locationAccess: '', notes: '' });
        dispatch(resetShareStatus()); 
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleOpenUpdateModal = (item) => {

        if (!item) return;
        setCurrentItemToUpdate(item);
        setUpdateFormData({
            _id: item._id,
            appName: item.appName || '',
            emailUsed: item.emailUsed || '',
            phoneUsed: item.phoneUsed || '',
            locationAccess: item.locationAccess === 'yes' ? 'yes' : '', 
            notes: item.notes || ''
        });
        dispatch(resetShareStatus());
        setIsUpdateModalOpen(true);



    };
    
    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setCurrentItemToUpdate(null);
    };



    //  --  START Delete Operation
    const handleDeleteClick = (e, item) => {
        e.stopPropagation(); 
        setItemToDelete(item);
        dispatch(resetShareStatus());
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };
    const handleConfirmDelete = () => {
        if (!itemToDelete || !itemToDelete._id) return;
        dispatch(deleteAnSahreData(itemToDelete._id)); 
        handleCloseDeleteModal();
    };
    //--   END Delete Operation

  
    const handleAddFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                   ? (name === 'locationAccess' ? (checked ? 'yes' : '') : checked) 
                   : value
        }));



    };

    const handleUpdateFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdateFormData(prev => ({
            ...prev,
             [name]: type === 'checkbox'
                   ? (name === 'locationAccess' ? (checked ? 'yes' : '') : checked) 
                   : value
        }));
    };

    //-- START Send Operation
   
   // ... (previous code) ...

    //-- START Send Operation

    const handleAddSubmit = async (e) => { 
        e.preventDefault();
        const payload = { ...formData };
        if (!payload.locationAccess) {
            payload.locationAccess = 'no';
        }

        try {
           
            await dispatch(addAnShareData(payload)).unwrap(); 

         
            handleCloseAddModal();

          
            dispatch(getAllShareData());

        } catch (error) {
           
            console.error("Failed to add data: ", error);
           
        }
    };

    //-- End Send Opreation


    //-- Start Update Operation --> Shared Data
    const handleUpdateSubmit = async (e) => { 
        e.preventDefault();
        if (!currentItemToUpdate) return;
        const payload = { ...updateFormData };
         if (!payload.locationAccess) {
             payload.locationAccess = 'no';
         }

        try {
          
             await dispatch(updateAnShareData(payload)).unwrap(); 

            
             handleCloseUpdateModal();

          
             dispatch(getAllShareData());

        } catch (error) {
          
            console.error("Failed to update data: ", error);
           
        }
    };
    //-- End Update Opration --> Shared Data

   



    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Shared Data Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600">Track applications where you've shared personal information.</p>
                </header>

              
                {isLoading && !isAddModalOpen && !isUpdateModalOpen && !isDeleteModalOpen && !message && (
                    <div className='p-4 mb-4 rounded-md bg-blue-100 text-blue-700 border border-blue-300'>
                        Loading tracked applications...
                    </div>
                )}
                
                 {isLoading && message && (message.toLowerCase().includes('deleting') || message.toLowerCase().includes('saving') || message.toLowerCase().includes('updating')) && (
                    <div className='p-4 mb-4 rounded-md bg-blue-100 text-blue-700 border border-blue-300'>
                         {message}...
                    </div>
                 )}
                {isError && message && (
                    <div className='p-4 mb-4 rounded-md bg-red-100 text-red-700 border border-red-300 font-medium'>
                        Error: {message}
                    </div>
                )}
             
                {isSuccess && message && !isLoading && (
                    <div className='p-4 mb-4 rounded-md bg-green-100 text-green-700 border border-green-300 font-medium'>
                        {message}
                    </div>
                )}

            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
                    {/* Risk Score */}
                    <div className="md:col-span-1 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow flex items-center space-x-3 h-full min-h-[100px]">
                        <ScaleIcon className="h-8 w-8 flex-shrink-0" />
                        <div>
                            <span className="block text-sm font-medium uppercase tracking-wider">Data Risk Score</span>
                            <span className="block text-3xl font-bold">{riskScore}%</span>
                        </div>
                    </div>

                  
                    {/* <div className="md:col-span-1 bg-white shadow rounded-lg p-4 min-h-[150px] flex flex-col justify-center items-center text-center">
                        <InformationCircleIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Chart data will be displayed here.</p>
                        <p className="text-xs text-gray-400">(Insights based on shared data types)</p>
                    </div> */}

                   
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
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul role="list" className="divide-y divide-gray-200">
                        {applications.length > 0 ? (
                            applications.map((item) => (
                                <li
                                    key={item._id}
                                    onClick={() => handleOpenUpdateModal(item)}
                                    className="group px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out relative"
                                >
                                    <div className="flex items-center justify-between">
                                       
                                        <div className="truncate flex-1 mr-4">
                                            <p className="text-lg font-medium text-indigo-600 truncate">{item.appName || 'N/A'}</p>
                                            <p className="text-sm text-gray-600 truncate">{item.emailUsed || 'No email recorded'}</p>
                                            <div className="mt-2 flex items-center flex-wrap gap-2">
                                                {item.phoneUsed && (
                                                    <span title={`Phone Shared: ${item.phoneUsed}`} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        <PhoneIcon className="h-4 w-4 mr-1" /> Phone Provided
                                                    </span>
                                                )}
                                                {item.locationAccess === 'yes' && (
                                                    <span title="Location Access Granted" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        <MapPinIcon className="h-4 w-4 mr-1" /> Location Access
                                                    </span>
                                                )}
                                              
                                            </div>
                                             {item.notes && (
                                                <p className="mt-1 text-xs text-gray-500 italic truncate">Notes: {item.notes}</p>
                                             )}
                                        </div>

                                       
                                        <div className="ml-2 flex-shrink-0 flex items-center"> 
                                            <button
                                                onClick={(e) => handleDeleteClick(e, item)}
                                                title="Delete"
                                                className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" // Group hover effect
                                            >
                                                 <span className="sr-only">Delete {item.appName}</span>
                                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                           !isLoading && !isError && applications.length === 0 && ( 
                             <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                No applications tracked yet. Click "Track New App" to get started.
                             </li>
                           )
                        )}
                        
                         {!isLoading && isError && applications.length === 0 && (
                             <li className="px-4 py-4 sm:px-6 text-center text-red-500">
                                Failed to load applications. Please try again later.
                             </li>
                          )}
                    </ul>
                </div>

               
                {isAddModalOpen && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                               
                                 <form onSubmit={handleAddSubmit}>
                                   
                                    <div className="bg-white px-4 pt-5 sm:p-6 flex justify-between items-start">
                                         <div className="flex items-center">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 sm:mx-0">
                                                 <PlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            </div>
                                            <div className="ml-4 text-left">
                                                 <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Application Tracking</h3>
                                            </div>
                                         </div>
                                         <button type="button" className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={handleCloseAddModal} > <XMarkIcon className="h-6 w-6" /> </button>
                                     </div>
                                  
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pt-0 sm:pb-4">
                                         <div className="mt-6 space-y-4">
                                             
                                              <div>
                                                    <label htmlFor="addAppName" className="block text-sm font-medium text-gray-700">App Name <span className="text-red-500">*</span></label>
                                                    <input type="text" id="addAppName" name="appName" value={formData.appName} onChange={handleAddFormChange} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/>
                                              </div>
                                            
                                               <div>
                                                 <label htmlFor="addEmailUsed" className="block text-sm font-medium text-gray-700">Email Used</label>
                                                 <input type="email" id="addEmailUsed" name="emailUsed" value={formData.emailUsed} onChange={handleAddFormChange} className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/>
                                             </div>
                                             <div>
                                                 <label htmlFor="addPhoneUsed" className="block text-sm font-medium text-gray-700">Phone Used</label>
                                                 <input type="tel" id="addPhoneUsed" name="phoneUsed" value={formData.phoneUsed} onChange={handleAddFormChange} placeholder="e.g., 9993291555" className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/>
                                             </div>
                                              <div className="flex items-start">
                                                 <div className="flex items-center h-5">
                                                     <input id="addLocationAccess" name="locationAccess" type="checkbox" checked={formData.locationAccess === 'yes'} onChange={handleAddFormChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                                                 </div>
                                                 <div className="ml-3 text-sm">
                                                     <label htmlFor="addLocationAccess" className="font-medium text-gray-700">Location Access Granted</label>
                                                     <p className="text-gray-500 text-xs">Does the app have access to your location?</p>
                                                 </div>
                                              </div>
                                             <div>
                                                 <label htmlFor="addNotes" className="block text-sm font-medium text-gray-700">Notes</label>
                                                 <textarea id="addNotes" name="notes" rows={3} value={formData.notes} onChange={handleAddFormChange} className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                                             </div>
                                        </div>
                                     </div>
                                      
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>
                                             
                                            {isLoading ? 'Saving...' : 'Save Application'}
                                         </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={handleCloseAddModal} disabled={isLoading}>
                                            Cancel
                                         </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

              
                {isUpdateModalOpen && currentItemToUpdate && (
                     <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                           
                               <form onSubmit={handleUpdateSubmit}>
                                    
                                    <div className="bg-white px-4 pt-5 sm:p-6 flex justify-between items-start">
                                         <div className="flex items-center">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 sm:mx-0">
                                                <PencilIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                             </div>
                                             <div className="ml-4 text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Application Tracking</h3>
                                             </div>
                                        </div>
                                         <button type="button" className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={handleCloseUpdateModal} > <XMarkIcon className="h-6 w-6" /> </button>
                                    </div>
                                  
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pt-0 sm:pb-4">
                                          <div className="mt-6 space-y-4">
                                            
                                             <div>
                                                  <label htmlFor="updateAppName" className="block text-sm font-medium text-gray-700">App Name <span className="text-red-500">*</span></label>
                                                  <input type="text" id="updateAppName" name="appName" value={updateFormData.appName} onChange={handleUpdateFormChange} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/>
                                             </div>
                                           
                                              <div>
                                                 <label htmlFor="updateEmailUsed" className="block text-sm font-medium text-gray-700">Email Used</label>
                                                 <input type="email" id="updateEmailUsed" name="emailUsed" value={updateFormData.emailUsed} onChange={handleUpdateFormChange} className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/>
                                            </div>
                                            <div>
                                                  <label htmlFor="updatePhoneUsed" className="block text-sm font-medium text-gray-700">Phone Used</label>
                                                  <input type="tel" id="updatePhoneUsed" name="phoneUsed" value={updateFormData.phoneUsed} onChange={handleUpdateFormChange} placeholder="e.g., 9993291555" className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/>
                                            </div>
                                            <div className="flex items-start">
                                                 <div className="flex items-center h-5">
                                                      <input id="updateLocationAccess" name="locationAccess" type="checkbox" checked={updateFormData.locationAccess === 'yes'} onChange={handleUpdateFormChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                                                 </div>
                                                 <div className="ml-3 text-sm">
                                                      <label htmlFor="updateLocationAccess" className="font-medium text-gray-700">Location Access Granted</label>
                                                 </div>
                                            </div>
                                            <div>
                                                 <label htmlFor="updateNotes" className="block text-sm font-medium text-gray-700">Notes</label>
                                                 <textarea id="updateNotes" name="notes" rows={3} value={updateFormData.notes} onChange={handleUpdateFormChange} className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                                             </div>
                                        </div>
                                    </div>
                                   
                                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>
                                              
                                              {isLoading ? 'Updating...' : 'Update Application'}
                                          </button>
                                          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={handleCloseUpdateModal} disabled={isLoading}>
                                             Cancel
                                           </button>
                                      </div>
                                 </form>
                             </div>
                         </div>
                    </div>
                )}

               
                 {isDeleteModalOpen && itemToDelete && (
                    <div className="fixed z-20 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                           <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                           <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                           <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                {/* Modal Header */}
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                     <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                             <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                        </div>
                                         <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-delete-title">Delete Application Tracking</h3>
                                            <div className="mt-2">
                                                 <p className="text-sm text-gray-500">
                                                      Are you sure you want to delete the entry for{' '}
                                                      <strong className="font-medium text-gray-700">{itemToDelete.appName || 'this application'}</strong>?
                                                      This action cannot be undone.
                                                 </p>
                                             </div>
                                        </div>
                                     </div>
                                </div>
                             
                               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                   <button
                                       type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                        onClick={handleConfirmDelete}
                                        disabled={isLoading} 
                                    >
                                       {isLoading ? 'Deleting...' : 'Delete'}
                                    </button>
                                   <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                                        onClick={handleCloseDeleteModal}
                                        disabled={isLoading} 
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