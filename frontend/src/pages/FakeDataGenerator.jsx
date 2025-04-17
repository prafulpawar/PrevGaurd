import React, { useState } from 'react';
import Navbar from '../pages/Navbar';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';

import {
    updateFakeData,
    sendFakeData,
    saveFakeData,
    selectResponseData,
    selectInitialData,
    selectLoading,
    selectMessage,
    selectError
} from '../redux/slice/fakeDataSlice';

function FakeDataGenerator() {
    const [inputValue, setInputValue] = useState('');

    const fakeDataConfig = useSelector(selectInitialData);
    const responseData = useSelector(selectResponseData);
    const isLoading = useSelector(selectLoading);
    const message = useSelector(selectMessage);
    const hasError = useSelector(selectError);

    const dispatch = useDispatch();

    const handleChange = (field, checked) => {
        if (isLoading) return;
        dispatch(updateFakeData({ [field]: checked }));
    };

    const handleGenerate = () => {
        if (isLoading) return;
        dispatch(sendFakeData(fakeDataConfig));
    };

    const handleChangePersist = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmitPersistData = () => {
        if (isLoading) return;

        if (Object.keys(responseData).length === 0) {
            alert("Please generate data first before saving.");
            return;
        }
        if (!inputValue.trim()) {
            alert("Please enter a value for 'Save persist'.");
            return;
        }

        dispatch(saveFakeData({
            generatedData: responseData,
            savedBy: inputValue
        }));

        setInputValue('');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Fake Data Generator</h1>

                {message && (
                    <div className={`p-3 mb-4 rounded ${hasError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="w-full md:w-1/2 bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4">Select Fields to Generate</h2>

                        {['name', 'email', 'phone', 'pan', 'aadhar', 'address'].map((field) => (
                            <div key={field} className="flex items-center space-x-3 mb-3">
                                <input
                                    id={field}
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    checked={!!fakeDataConfig[field]}
                                    onChange={(e) => handleChange(field, e.target.checked)}
                                    disabled={isLoading}
                                />
                                <label htmlFor={field} className="capitalize text-gray-700">
                                    {field}
                                </label>
                            </div>
                        ))}

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className={`mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <SparklesIcon className="h-5 w-5 mr-2" />
                            {isLoading ? 'Generating...' : 'Generate Data'}
                        </button>
                    </div>

                    <div className="w-full md:w-1/2 bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4">Generated Output</h2>
                        {isLoading && !responseData.name && <p className="text-gray-500">Loading...</p>}

                        {!isLoading && Object.keys(responseData).length === 0 ? (
                            <p className="text-gray-500">No generated data</p>
                        ) : (
                            <>
                                <div className="space-y-2 border-b pb-4 mb-4">
                                    {Object.entries(responseData).map(([key, value]) => (
                                        value && (
                                            <p key={key} className="text-sm">
                                                <span className="font-semibold capitalize">{key}:</span> {String(value)}
                                            </p>
                                        )
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-md font-semibold mb-2">Save Generated Data</h3>
                                    <input
                                        type="text"
                                        placeholder="Saved By Name"
                                        className={`border p-2 rounded w-full mb-2 focus:ring-indigo-500 focus:border-indigo-500 ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        value={inputValue}
                                        onChange={handleChangePersist}
                                        disabled={isLoading}
                                    />
                                    <button
                                        className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleSubmitPersistData}
                                        disabled={isLoading || Object.keys(responseData).length === 0}
                                    >
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Saved Data (Example)</h2>
                    <ul className="space-y-2">
                        <li>
                            <p><span className="font-semibold">Name:</span> Jane Doe</p>
                            <p><span className="font-semibold">Email:</span> jane@example.com</p>
                            <p><span className="font-semibold">Saved By:</span> Admin</p>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default FakeDataGenerator;
