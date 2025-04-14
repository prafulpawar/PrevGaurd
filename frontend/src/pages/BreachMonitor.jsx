import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../pages/Navbar'; // Adjust path if needed
import { BellAlertIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField'; // Adjust path if needed

// Import actions and selectors from your slice
import {
    fetchBreachData,
    selectBreachIsLoading,
    selectBreachError,
    selectBreachData,
    // You might not need updateEmailValue directly here if fetch handles it
    // updateEmailValue,
    // selectBreachEmail // Use if you want input controlled by Redux state
} from '../redux/slice/breachSlice'; // Adjust path to your slice file

function BreachMonitor() {
    // Local state for the input field
    const [email, setEmail] = useState('');

    // Redux hooks
    const dispatch = useDispatch();
    const isLoading = useSelector(selectBreachIsLoading);
    const error = useSelector(selectBreachError);
    const data = useSelector(selectBreachData);
    // Optional: get email from redux if you want input controlled by it
    // const storedEmail = useSelector(selectBreachEmail);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || isLoading) return; // Prevent submission if no email or already loading

        // Dispatch the async thunk with the email from local state
        dispatch(fetchBreachData(email));

        // Optional: If you ALSO want to store the submitted email using updateEmailValue
        // dispatch(updateEmailValue(email)); // But fetchBreachData already resets state

        console.log("Form submitted, dispatching fetchBreachData for:", email);
    };

    // Helper function to render results (customize based on your actual data structure)
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

        // Check if data is not null/undefined AFTER loading/error checks
        if (data !== null && data !== undefined) {
            // --- SUCCESS CASE ---
            // Customize this part based on how your API returns data
            // Example 1: API returns an array of breaches, or empty array/null if none
            if (Array.isArray(data) && data.length > 0) {
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
                                    {/* Map over your breach data - Adjust 'breach.Name' based on your API response */}
                                    {data.map((breach, index) => (
                                        <li key={index}>{breach.Name || `Breach ${index + 1}`}</li>
                                    ))}
                                </ul>
                                <p className="text-xs text-yellow-600 mt-2">It's recommended to change your password for affected services.</p>
                            </div>
                        </div>
                    </div>
                );
            } else {
                // Example 2: API returns null, empty array, or specific object indicating no breaches
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

        // Initial state or after reset (no data, no error, not loading)
        return null; // Or render a placeholder message like "Enter an email to check."
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <BellAlertIcon className="mx-auto h-12 w-12 text-indigo-600" />
                    <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900">Breach Monitoring</h1>
                    <p className="mt-2 text-base text-gray-600">Check if your email address has been compromised in known data breaches.</p>
                    <p className="mt-1 text-xs text-gray-500">Powered by PrevGaurd.</p> {/* Ensure PrevGaurd is correct */}
                </header>

                <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-8">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end sm:space-x-3 space-y-3 sm:space-y-0">
                        <InputField
                            label="Email Address to Check"
                            type="email"
                            name="email"
                            value={email} // Controlled by local state
                            onChange={(e) => setEmail(e.target.value)} // Update local state
                            required
                            placeholder="enter@your.email"
                            containerClassName="flex-grow"
                            className="w-full"
                            disabled={isLoading} // Disable input while loading
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !email} // Disable button if loading or email is empty
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

                {/* Render loading, error, or results */}
                {renderResult()}

            </main>
        </div>
    );
}

export default BreachMonitor;