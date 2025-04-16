import React from 'react';
import Navbar from '../pages/Navbar';
import { SparklesIcon } from '@heroicons/react/24/outline';




function FakeDataGenerator() {




  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Fake Data Generator</h1>

        <div className="flex">
          <div className="w-1/2 bg-white p-6 rounded shadow mr-4">
            <h2 className="text-lg font-semibold mb-4">Select Fields to Generate</h2>


            {['name', 'email', 'phone', 'pan', 'aadhar', 'address'].map((field) => (
              <div key={field} className="flex items-center space-x-3 mb-2">
                <input id={field} type="checkbox" />
                <label htmlFor={field} className="capitalize">{field}</label>
              </div>
            ))}










            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate Data
            </button>
          </div>






          <div className="w-1/2 bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Generated Output</h2>
            <div className="space-y-2">
              {/* Static placeholder data */}
              <p><span className="font-semibold capitalize">name:</span> John Doe</p>
              <p><span className="font-semibold capitalize">email:</span> john@example.com</p>
            </div>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Save persist"
                className="border p-2 rounded w-full mb-2"
              />
              <button className="bg-green-500 text-white p-2 rounded">Save</button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Saved Data</h2>
          <ul className="space-y-2">
            <li>
              <p>Name: Jane Doe</p>
              <p>Email: jane@example.com</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default FakeDataGenerator;
