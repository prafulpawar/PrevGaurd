// FakeDataGenerator.js
import React from 'react';
import Navbar from '../pages/Navbar';
import { SparklesIcon, ClipboardDocumentIcon, DocumentPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField';
import { useDispatch, useSelector } from 'react-redux';

import { toggleField, generateData } from '../redux/slice/fakeDataSlice';

function FakeDataGenerator() {
    const dispatch = useDispatch();
   
    const dataToGenerate = useSelector((state) => state.fake.data);
     console.log(dataToGenerate)
    

    const handleGenerateData = () => {
        console.log(dataToGenerate)
        dispatch(generateData(dataToGenerate));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Fake Data Generator</h1>
                    <p className="mt-2 text-sm text-gray-600">Create temporary identities to protect your privacy online.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-6 sticky top-24">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Generation Options</h3>

                            <div className="space-y-4">
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="name"
                                            name="name"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={() => dispatch(toggleField('name'))}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="name" className="font-medium text-gray-700 capitalize">name</label>
                                    </div>
                                </div>
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="email"
                                            name="email"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={() => dispatch(toggleField('email'))}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="email" className="font-medium text-gray-700 capitalize">email</label>
                                    </div>
                                </div>
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={() => dispatch(toggleField('phone'))}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="phone" className="font-medium text-gray-700 capitalize">phone</label>
                                    </div>
                                </div>
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="pan"
                                            name="pan"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={() => dispatch(toggleField('pan'))}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="pan" className="font-medium text-gray-700 capitalize">pan</label>
                                    </div>
                                </div>
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="aadhar"
                                            name="aadhar"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={() => dispatch(toggleField('addhar'))}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="aadhar" className="font-medium text-gray-700 capitalize">aadhar</label>
                                    </div>
                                </div>
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="address"
                                            name="address"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            onChange={() => dispatch(toggleField('address'))}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="address" className="font-medium text-gray-700 capitalize">address</label>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={handleGenerateData}
                            >
                                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Generate Data
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Generated Data</h3>
                            <p className="text-gray-500 text-sm">Click "Generate Data" to create fake information based on your selections.</p>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Presets</h3>
                            <div className="mb-6 pb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-end sm:space-x-3 space-y-3 sm:space-y-0">
                                <InputField
                                    label="New Preset Name"
                                    name="presetName"
                                    placeholder="e.g., 'Forum Signup'"
                                    containerClassName="flex-grow"
                                    // value={presetName}
                                    // onChange={.handlePresetNameChange}
                                />
                                <button
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                                >
                                    <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    Save Current Options
                                </button>
                            </div>

                            <ul className="space-y-3">
                                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                                    <span className="text-sm font-medium text-gray-900">Basic Signup</span>
                                    <div className="space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Load</button>
                                        <button title="Delete Preset" className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                                <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                                    <span className="text-sm font-medium text-gray-900">Full Profile (Mock)</span>
                                    <div className="space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Load</button>
                                        <button title="Delete Preset" className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default FakeDataGenerator;