import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../pages/Navbar';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PhoneIcon, MapPinIcon, ScaleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const mockApps = [
    { id: 1, appName: 'Example Social Media', emailUsed: 'user@example.com', phoneUsed: true, locationAccess: true, notes: 'Standard signup, connected other social accounts.' },
    { id: 2, appName: 'Online Store XYZ', emailUsed: 'user@example.com', phoneUsed: false, locationAccess: false, notes: 'Guest checkout only, no account created.' },
    { id: 3, appName: 'Map Service App', emailUsed: 'another@example.com', phoneUsed: true, locationAccess: true, notes: '' },
    { id: 4, appName: 'Gaming Platform', emailUsed: 'gamer@example.com', phoneUsed: false, locationAccess: true, notes: 'Location used for regional matchmaking.' },
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

    const chartData = useMemo(() => {
        if (isLoading || sharedApps.length === 0) {
            return null;
        }

        const phoneSharedCount = sharedApps.filter(app => app.phoneUsed).length;
        const locationSharedCount = sharedApps.filter(app => app.locationAccess).length;
        const emailSharedCount = sharedApps.length;

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
    }, [sharedApps, isLoading]);

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
                            <span className="block text-3xl font-bold">{isLoading ? '...' : `${riskScore}%`}</span>
                        </div>
                    </div>

                    <div className="md:col-span-1 bg-white shadow rounded-lg p-4 min-h-[200px] flex flex-col justify-center">
                        {isLoading ? (
                            <p className="text-center text-gray-500">Loading chart data...</p>
                        ) : chartData ? (
                            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                                <Doughnut data={chartData} options={chartOptions} />
                            </div>
                        ) : (
                             <p className="text-center text-gray-500">No app data to display chart.</p>
                        )}
                    </div>

                    <div className="md:col-span-1 flex md:justify-end items-start">
                        <button
                            className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Track New App
                        </button>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracked Applications</h2>
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    {isLoading ? (
                        <p className="text-center p-10 text-gray-500">Loading tracked apps...</p>
                    ) : sharedApps.length > 0 ? (
                        <ul role="list" className="divide-y divide-gray-200">
                            {sharedApps.map((app) => (
                                <li key={app.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-lg font-semibold text-indigo-600 truncate">{app.appName}</p>
                                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                                            <button title="Edit App" className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button title="Remove App" className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full">
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
            </main>
        </div>
    );
}

export default SharedDataDashboard;