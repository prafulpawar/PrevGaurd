import React from 'react';
import Navbar from '../pages/Navbar';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleField,
  generateData,
  resettoggleField,
  SelectGeneratedData,
  SelectStatusData,
  SelectErrorData,
  SelectMainData,
} from '../redux/slice/fakeDataSlice';

function FakeDataGenerator() {
  const dispatch = useDispatch();
  const dataToGenerate = useSelector(SelectMainData);
  const generatedData = useSelector(SelectGeneratedData);
  const status = useSelector(SelectStatusData);
  const error = useSelector(SelectErrorData);

  const handleGenerateData = () => {
    dispatch(generateData(dataToGenerate));
    dispatch(resettoggleField());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Fake Data Generator</h1>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Fields to Generate</h2>


          {['name', 'email', 'phone', 'pan', 'aadhar', 'address'].map((field) => (
            <div key={field} className="flex items-center space-x-3 mb-2">
              <input
                id={field}
                type="checkbox"
                checked={dataToGenerate[field]}
                onChange={() => dispatch(toggleField(field))}
              />
              <label htmlFor={field} className="capitalize">{field}</label>
            </div>
          ))}


          <button
            onClick={handleGenerateData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded flex items-center"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            Generate Data
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Generated Output</h2>
          {status === 'loading' && <p className="text-yellow-600">Generating...</p>}
          {status === 'failed' && <p className="text-red-600">Error: {error}</p>}
          {status === 'succeeded' && (
            <div className="space-y-2">
              {Object.entries(generatedData).map(([key, value]) => (
                <p key={key}>
                  <span className="font-semibold capitalize">{key}:</span> {value}
                </p>
              ))}
            </div>
          )}
        </div>
        
      </main>
    </div>
  );
}

export default FakeDataGenerator;
