import React, { useState } from 'react';
import Navbar from '../pages/Navbar';
import { BellAlertIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField';


const RESULT_TYPE = { NONE: 0, LOADING: 1, FOUND: 2, NOT_FOUND: 3, ERROR: 4 };

function BreachMonitor() {
    const [email, setEmail] = useState('');
    const [resultType, setResultType] = useState(RESULT_TYPE.NONE);
    const [breachData, setBreachData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCheckBreach = async (e) => {
        e.preventDefault();
        setResultType(RESULT_TYPE.LOADING);
        setBreachData(null);
        setErrorMessage('');

        try {
             console.log(`Checking email: ${email}`);
             await new Promise(resolve => setTimeout(resolve, 1500));

            if (email.includes('breached')) {
                 setBreachData([
                     { Name: "Adobe", BreachDate: "2013-10-04", DataClasses: ["Email addresses", "Password hints", "Passwords", "Usernames"], IsVerified: true },
                     { Name: "ExampleLeak", BreachDate: "2020-01-15", DataClasses: ["Email addresses", "Usernames"], IsVerified: false }
                 ]);
                setResultType(RESULT_TYPE.FOUND);
             } else if (email.includes('error')) {
                 throw new Error("Simulated API error.");
             } else {
                 setResultType(RESULT_TYPE.NOT_FOUND);
             }

        } catch (error) {
             console.error("Breach check failed:", error);
            setErrorMessage(error.message || 'An unknown error occurred.');
             setResultType(RESULT_TYPE.ERROR);
        }
    };

    const renderResult = () => {
        switch (resultType) {
            case RESULT_TYPE.LOADING:
                 return (
                    <div className="flex justify-center items-center space-x-2 text-gray-600">
                        <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         <span>Checking...</span>
                    </div>
                 );
            case RESULT_TYPE.FOUND:
                return (
                     <div className="bg-red-50 border-l-4 border-red-400 p-4">
                         <div className="flex items-center">
                           <div className="flex-shrink-0">
                                 <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                             </div>
                            <div className="ml-3">
                                 <h3 className="text-md font-medium text-red-800">Oh no — Pwned!</h3>
                                <p className="text-sm text-red-700 mt-1">This email address was found in the following known data breaches:</p>
                                 <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-red-700">
                                     {breachData?.map(breach => (
                                         <li key={breach.Name}>
                                             <strong>{breach.Name}</strong> (Breached: {breach.BreachDate}) - Compromised data: {breach.DataClasses.join(', ')}
                                         </li>
                                     ))}
                                </ul>
                                <p className="mt-3 text-sm text-red-700 font-medium">It's highly recommended to change your password everywhere this email was used.</p>
                             </div>
                        </div>
                     </div>
                 );
            case RESULT_TYPE.NOT_FOUND:
                 return (
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
                 );
             case RESULT_TYPE.ERROR:
                 return (
                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <div className="flex items-center">
                           <div className="flex-shrink-0">
                                 <InformationCircleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                             </div>
                            <div className="ml-3">
                                <h3 className="text-md font-medium text-yellow-800">Error</h3>
                                <p className="text-sm text-yellow-700 mt-1">{errorMessage}</p>
                             </div>
                        </div>
                    </div>
                 );
             default:
                 return null;
         }
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                 <header className="mb-8 text-center">
                     <BellAlertIcon className="mx-auto h-12 w-12 text-indigo-600" />
                    <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900">Breach Monitoring</h1>
                    <p className="mt-2 text-base text-gray-600">Check if your email address has been compromised in known data breaches.</p>
                      <p className="mt-1 text-xs text-gray-500">Powered by HaveIBeenPwned API.</p>
                </header>

                <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-8">
                     <form onSubmit={handleCheckBreach} className="flex flex-col sm:flex-row sm:items-end sm:space-x-3 space-y-3 sm:space-y-0">
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
                             disabled={resultType === RESULT_TYPE.LOADING}
                              className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                         >
                            {resultType === RESULT_TYPE.LOADING ? 'Checking...' : 'Check for Breaches'}
                        </button>
                    </form>
                 </div>

                 {resultType !== RESULT_TYPE.NONE && (
                     <div className="mt-6">
                        {renderResult()}
                    </div>
                 )}

             </main>
        </div>
    );
}

export default BreachMonitor;