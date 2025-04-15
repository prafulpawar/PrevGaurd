// src/pages/FakeDataGenerator.js
import React from 'react';
import Navbar from './Navbar';
import { SparklesIcon, ClipboardDocumentIcon, DocumentPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import InputField from '../components/forms/InputField';
import { useSelector, useDispatch } from 'react-redux';
import {
  generateFakeDataAsync,
  selectGeneratedData,
  selectGenerationOptions,
  setGenerationOption,
  saveFakeDataAsync,
  selectSavedData,
  deleteFakeDataAsync,
  selectGenerateStatus,
  selectGenerateError,
  selectSaveStatus,
  selectSaveError,
  selectDeleteStatus,
  selectDeleteError,
} from '../redux/slice/fakeDataSlice';

function FakeDataGenerator() {
  const dispatch = useDispatch();
  const generatedData = useSelector(selectGeneratedData);
  const generationOptions = useSelector(selectGenerationOptions);
  const savedData = useSelector(selectSavedData);
  const generateStatus = useSelector(selectGenerateStatus);
  const generateError = useSelector(selectGenerateError);
  const saveStatus = useSelector(selectSaveStatus);
  const saveError = useSelector(selectSaveError);
  const deleteStatus = useSelector(selectDeleteStatus);
  const deleteError = useSelector(selectDeleteError);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    dispatch(setGenerationOption({ name, checked }));
  };

  const handleGenerateData = () => {
    dispatch(generateFakeDataAsync(generationOptions));
  };

  const handleSaveData = () => {
    if (generatedData) {
      dispatch(saveFakeDataAsync(generatedData));
    }
  };

  const handleDeleteData = (id) => {
    dispatch(deleteFakeDataAsync(id));
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
                      checked={generationOptions.name}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                      checked={generationOptions.email}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                      checked={generationOptions.phone}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                      checked={generationOptions.pan}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                      checked={generationOptions.aadhar}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                      checked={generationOptions.address}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="address" className="font-medium text-gray-700 capitalize">address</label>
                  </div>
                </div>
              </div>
              <button
                onClick={handleGenerateData}
                disabled={generateStatus === 'loading'}
                className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                {generateStatus === 'loading' ? 'Generating...' : 'Generate Data'}
              </button>
              {generateError && <p className="mt-2 text-red-500 text-sm">{generateError}</p>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Generated Data</h3>
              {generateStatus === 'succeeded' && generatedData ? (
                <div>
                  <pre className="bg-gray-100 p-4 rounded-md text-sm font-mono">
                    {JSON.stringify(generatedData, null, 2)}
                  </pre>
                  <button
                    onClick={handleSaveData}
                    disabled={saveStatus === 'loading'}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ClipboardDocumentIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {saveStatus === 'loading' ? 'Saving...' : 'Save Data'}
                  </button>
                  {saveError && <p className="mt-2 text-red-500 text-sm">{saveError}</p>}
                  {saveStatus === 'succeeded' && <p className="mt-2 text-green-500 text-sm">Data Saved Successfully!</p>}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Click "Generate Data" to create fake information based on your selections.</p>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Saved Data</h3>
              {savedData.length === 0 ? (
                <p className="text-gray-500 text-sm">No data has been saved yet.</p>
              ) : (
                <ul className="space-y-3">
                  {savedData.map((item) => (
                    <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100">
                      <div>
                        {Object.entries(item)
                          .filter(([key, value]) => key !== 'id')
                          .map(([key, value]) => (
                            <p key={key} className="text-sm text-gray-900">
                              <span className="font-medium capitalize">{key}:</span> {value}
                            </p>
                          ))}
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleDeleteData(item.id)}
                          disabled={deleteStatus === 'loading'}
                          title="Delete Saved Data"
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {deleteError && <p className="mt-2 text-red-500 text-sm">{deleteError}</p>}
              {deleteStatus === 'succeeded' && <p className="mt-2 text-green-500 text-sm">Data Deleted!</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FakeDataGenerator;