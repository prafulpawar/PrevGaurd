import React, { useState, useEffect } from 'react';
import Navbar from '../pages/Navbar';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhoneIcon, MapPinIcon, ScaleIcon } from '@heroicons/react/24/outline';


const mockApps = [
    { id: 1, appName: 'Example Social Media', emailUsed: 'user@example.com', phoneUsed: true, locationAccess: true, notes: 'Standard signup' },
    { id: 2, appName: 'Online Store XYZ', emailUsed: 'user@example.com', phoneUsed: false, locationAccess: false, notes: 'Guest checkout only' },
    { id: 3, appName: 'Map Service App', emailUsed: 'another@example.com', phoneUsed: true, locationAccess: true, notes: '' },
];

function SharedDataDashboard() {
    const [sharedApps, setSharedApps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [riskScore, setRiskScore] = useState(75);

    useEffect(() => {
        setTimeout(() => {
            setSharedApps(mockApps);
            setIsLoading(false);
        }, 1000);
    }, []);


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Shared Data Dashboard</h1>
                     <p className="mt-2 text-sm text-gray-600">Track applications where you've shared personal information.</p>
                </header>

                <div className="mb-6 md:flex md:items-center md:justify-between">
                   <div className="mb-4 md:mb-0 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow flex items-center space-x-3">
                         <ScaleIcon className="h-8 w-8"/>
                         <div>
                            <span className="block text-sm font-medium uppercase tracking-wider">Data Risk Score</span>
                            <span className="block text-3xl font-bold">{isLoading ? '...' : riskScore}%</span>
                         </div>
                   </div>
                    <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Track New App
                    </button>
                </div>


                 <div className="bg-white shadow overflow-hidden rounded-lg">
                   {isLoading ? (
                        <p className="text-center p-10 text-gray-500">Loading tracked apps...</p>
                    ) : sharedApps.length > 0 ? (
                         <ul role="list" className="divide-y divide-gray-200">
                           {sharedApps.map((app) => (
                                <li key={app.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-semibold text-indigo-600 truncate">{app.appName}</p>
                                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                                             <button className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full">
                                                  <PencilIcon className="h-5 w-5"/>
                                             </button>
                                            <button className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full">
                                                 <TrashIcon className="h-5 w-5"/>
                                             </button>
                                         </div>
                                     </div>
                                     <div className="mt-2 sm:flex sm:justify-between">
                                         <div className="sm:flex">
                                             <p className="flex items-center text-sm text-gray-500">
                                                 <EyeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                {app.emailUsed}
                                            </p>
                                             <p className={`mt-2 flex items-center text-sm ${app.phoneUsed ? 'text-gray-500' : 'text-gray-400 italic'} sm:mt-0 sm:ml-6`}>
                                                 <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                 {app.phoneUsed ? 'Phone shared' : 'Phone not shared'}
                                            </p>
                                            <p className={`mt-2 flex items-center text-sm ${app.locationAccess ? 'text-gray-500' : 'text-gray-400 italic'} sm:mt-0 sm:ml-6`}>
                                                 <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                 {app.locationAccess ? 'Location shared' : 'Location not shared'}
                                            </p>
                                         </div>
                                     </div>
                                 </li>
                             ))}
                         </ul>
                    ) : (
                       <p className="text-center p-10 text-gray-500">No apps tracked yet. Click "Track New App" to get started.</p>
                    )}
                  </div>


            </main>
        </div>
    );
}

export default SharedDataDashboard;