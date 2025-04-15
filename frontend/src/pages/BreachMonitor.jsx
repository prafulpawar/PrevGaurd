import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../pages/Navbar';
import { BellAlertIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField'; 


import {
    fetchBreachData,
    selectBreachIsLoading,
    selectBreachError,
    selectBreachData,
    
} from '../redux/slice/breachSlice'; 

function BreachMonitor() {

    const [email, setEmail] = useState('');

    // Redux hooks
    const dispatch = useDispatch();
    const isLoading = useSelector(selectBreachIsLoading);
    const error = useSelector(selectBreachError);
    const data = useSelector(selectBreachData);
   

   
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || isLoading) return; 

      
        dispatch(fetchBreachData(email));

        console.log("Form submitted, dispatching fetchBreachData for:", email);
    };

 
    const renderResult = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center mt-6 text-gray-600">
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-3" />
                    <span>Checking for breaches...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-md font-medium text-red-800">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{typeof error === 'string' ? error : 'An unknown error occurred.'}</p>
                        </div>
                    </div>
                </div>
            );
        }

     
        if (data !== null && data !== undefined) {
          
            if (data.BreachData && data.BreachData.breaches && Array.isArray(data.BreachData.breaches) && data.BreachData.breaches.length > 0) {
                return (
                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <InformationCircleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-md font-medium text-yellow-800">Breaches Found!</h3>
                                <p className="text-sm text-yellow-700 mt-1">This email address was found in the following known data breaches:</p>
                                <ul className="list-disc pl-5 mt-2 text-sm text-yellow-700">
                                    {data.BreachData.breaches.map((breachList, index) => (
                                        <li key={index}>
                                            {breachList.join(', ')}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs text-yellow-600 mt-2">It's recommended to change your password for affected services.</p>
                            </div>
                        </div>
                    </div>
                );
            } else {
               
                return (
                    <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-md font-medium text-green-800">Good news — No breaches found!</h3>
                                <p className="text-sm text-green-700 mt-1">This email address was not found in the known data breaches we checked.</p>
                            </div>
                        </div>
                    </div>
                );
            }
        }

      
        return null;
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
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !email} 
                            className={`inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white whitespace-nowrap ${
                                (isLoading || !email)
                                    ? 'bg-indigo-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                                    Checking...
                                </>
                            ) : (
                                'Check for Breaches'
                            )}
                        </button>
                    </form>
                </div>

              
                {renderResult()}

            </main>
        </div>
    );
}

export default BreachMonitor;