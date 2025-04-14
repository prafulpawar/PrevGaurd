import React, { useState } from 'react';
import Navbar from '../pages/Navbar';
import { BellAlertIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField';
import { useSelector , useDispatch } from 'react-redux';

function BreachMonitor() {
    
    const handleSubmit = (e) => {
        e.preventDefault();
     
        console.log("Form submitted with email:", email);
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                 <header className="mb-8 text-center">
                     <BellAlertIcon className="mx-auto h-12 w-12 text-indigo-600" />
                    <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900">Breach Monitoring</h1>
                    <p className="mt-2 text-base text-gray-600">Check if your email address has been compromised in known data breaches.</p>
                      <p className="mt-1 text-xs text-gray-500">Powered by PrevGaurd.</p>
                </header>

                <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-8">
                     <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end sm:space-x-3 space-y-3 sm:space-y-0">
                          <InputField
                              label="Email Address to Check"
                              type="email"
                             name="email"
                             value={email}
                              onChange={(e) => setEmail(e.target.value)}
                             required
                              placeholder="enter@your.email"
                              containerClassName="flex-grow"
                              className="w-full"
                         />
                         <button
                              type="submit"
                             // Removed disabled prop logic
                              className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                         >
                            {/* Removed conditional text */}
                            Check for Breaches
                        </button>
                    </form>
                 </div>

                 {/* Removed conditional rendering block and renderResult call */}
                 {/* Placeholder for where results would appear - can be added back with static examples or when logic is reintroduced */}
                 {/*
                 <div className="mt-6">
                     <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex items-center">
                             <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                           </div>

                            <div className="ml-3">
                                 <h3 className="text-md font-medium text-green-800">Good news — No breaches found!</h3>
                                 <p className="text-sm text-green-700 mt-1">This email address was not found in any known public data breaches monitored by HaveIBeenPwned.</p>
                            </div>
                         </div>
                     </div>
                 </div>
                 */}

             </main>
        </div>
    );
}

export default BreachMonitor;