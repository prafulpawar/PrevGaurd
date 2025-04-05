import React, { useState, useEffect } from 'react';
import Navbar from '../pages/Navbar'; // Adjust path if necessary
import { SparklesIcon, ClipboardDocumentIcon, DocumentPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField'; // Assuming reusable component

// Placeholder for Faker.js generation - Implement actual logic
const generateFakeData = (options) => ({
  name: options.name ? `Fake Name ${Math.random().toString(36).substring(7)}` : '',
  email: options.email ? `fake_${Math.random().toString(36).substring(7)}@example.com` : '',
  phone: options.phone ? `+1-555-${Math.random().toString().slice(2, 5)}-${Math.random().toString().slice(2, 6)}` : '',
  pan: options.pan ? `FAKEPAN${Math.random().toString().slice(2, 7)}X` : '', // MOCK
  aadhar: options.aadhar ? `FAKE-AADHAR-${Math.random().toString().slice(2, 14)}` : '', // MOCK
  address: options.address ? '123 Fake St, Mocksville, FL 12345' : '',
});

// Mock presets
const mockPresets = [
    { id: 'p1', presetName: 'Basic Signup', options: { name: true, email: true, phone: false } },
    { id: 'p2', presetName: 'Full Profile (Mock)', options: { name: true, email: true, phone: true, pan: true, aadhar: true, address: true } },
];

function FakeDataGenerator() {
    const [options, setOptions] = useState({
        name: true, email: true, phone: true, pan: false, aadhar: false, address: false,
    });
    const [generatedData, setGeneratedData] = useState({});
    const [presets, setPresets] = useState([]);
    const [presetName, setPresetName] = useState('');

    // TODO: Fetch presets from API (GET /api/fake-data)
     useEffect(() => {
        setPresets(mockPresets); // Load mock data
     }, []);

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        setOptions(prev => ({ ...prev, [name]: checked }));
    };

    const handleGenerate = () => {
        setGeneratedData(generateFakeData(options));
    };

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!'); // TODO: Replace with a toast notification
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

     const handleSavePreset = () => {
        if (!presetName.trim()) {
            alert("Please enter a name for the preset.");
            return;
        }
        // TODO: Call API to save preset (POST /api/fake-data)
         const newPreset = { id: `p${Date.now()}`, presetName: presetName.trim(), options: { ...options } }; // Mock ID
         setPresets(prev => [...prev, newPreset]);
        console.log('Saving Preset:', newPreset);
         setPresetName(''); // Clear input
     };

     const handleDeletePreset = (id) => {
         // TODO: Call API to delete preset (DELETE /api/fake-data/:id)
        setPresets(prev => prev.filter(p => p.id !== id));
         console.log('Deleting Preset ID:', id);
     };

    const handleLoadPreset = (presetOptions) => {
         setOptions(presetOptions);
         setGeneratedData(generateFakeData(presetOptions)); // Optionally generate on load
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

                   {/* Generation Options */}
                    <div className="lg:col-span-1">
                         <div className="bg-white shadow rounded-lg p-6 sticky top-24"> {/* Sticky options column */}
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Generation Options</h3>
                             <div className="space-y-4">
                                {Object.keys(options).map(key => (
                                     <div key={key} className="relative flex items-start">
                                         <div className="flex h-5 items-center">
                                            <input
                                                 id={key}
                                                name={key}
                                                 type="checkbox"
                                                 checked={options[key]}
                                                 onChange={handleOptionChange}
                                                 className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                             />
                                         </div>
                                        <div className="ml-3 text-sm">
                                             <label htmlFor={key} className="font-medium text-gray-700 capitalize">{key}</label>
                                            {/* Add descriptions if needed */}
                                         </div>
                                    </div>
                                ))}
                            </div>
                             <button
                                onClick={handleGenerate}
                                className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                             >
                                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Generate Data
                            </button>
                         </div>
                    </div>

                     {/* Results & Presets */}
                     <div className="lg:col-span-2">
                       {/* Generated Data Display */}
                         <div className="bg-white shadow rounded-lg p-6 mb-8">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Generated Data</h3>
                           {Object.keys(generatedData).length === 0 ? (
                               <p className="text-gray-500 text-sm">Click "Generate Data" to create fake information based on your selections.</p>
                           ) : (
                             <dl className="space-y-4">
                                  {Object.entries(generatedData).map(([key, value]) => (
                                     value && ( // Only show if data was generated for this key
                                          <div key={key} className="sm:flex items-center justify-between">
                                             <dt className="text-sm font-medium text-gray-500 capitalize w-1/4">{key}</dt>
                                             <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:w-3/4 flex items-center">
                                                <span className="flex-grow mr-2 break-all">{value}</span>
                                                 <button onClick={() => handleCopyToClipboard(value)} title="Copy" className="p-1 text-gray-400 hover:text-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    <ClipboardDocumentIcon className="h-5 w-5" />
                                                </button>
                                             </dd>
                                         </div>
                                     )
                                 ))}
                             </dl>
                             )}
                         </div>

                         {/* Presets Section */}
                          <div className="bg-white shadow rounded-lg p-6">
                               <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Presets</h3>
                               {/* Save Preset Form */}
                                <div className="mb-6 pb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-end sm:space-x-3 space-y-3 sm:space-y-0">
                                     <InputField
                                        label="New Preset Name"
                                        name="presetName"
                                         value={presetName}
                                         onChange={(e) => setPresetName(e.target.value)}
                                         placeholder="e.g., 'Forum Signup'"
                                         containerClassName="flex-grow" // Tailwind class for InputField container if needed
                                    />
                                    <button
                                        onClick={handleSavePreset}
                                         className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                                     >
                                        <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        Save Current Options
                                    </button>
                                </div>

                                {presets.length > 0 ? (
                                    <ul className="space-y-3">
                                         {presets.map(preset => (
                                            <li key={preset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                                                 <span className="text-sm font-medium text-gray-900">{preset.presetName}</span>
                                                 <div className="space-x-2">
                                                     <button onClick={() => handleLoadPreset(preset.options)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Load</button>
                                                    <button onClick={() => handleDeletePreset(preset.id)} title="Delete Preset" className="text-red-500 hover:text-red-700">
                                                          <TrashIcon className="h-4 w-4"/>
                                                     </button>
                                                </div>
                                            </li>
                                        ))}
                                     </ul>
                                 ) : (
                                    <p className="text-gray-500 text-sm">No presets saved yet.</p>
                                 )}
                           </div>

                      </div>
                  </div>
             </main>
        </div>
    );
}

export default FakeDataGenerator;