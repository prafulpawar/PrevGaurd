import React, { useState } from 'react';
import Navbar from '../pages/Navbar';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { updateFackData, sendFackData, selectResponseData, updatePersistData  ,saveFackData}  from '../redux/slice/fakeDataSlice';
import { selectInitialData } from '../redux/slice/fakeDataSlice';
function FakeDataGenerator() {
  const [inputValue, setInputValue] = useState('');
  const fackData = useSelector(selectInitialData);

  const responseData = useSelector(selectResponseData);
  const dispatch = useDispatch();

  const handleChange = (field, checked) => {
    dispatch(updateFackData({ [field]: checked }))
  }

  const handleGenerate = () => {
    dispatch(sendFackData(fackData))
  };

  const handleChangePersist = (e) => {
    setInputValue(e.target.value);
  }
  const handleSubmitPersistData = () => {
    dispatch(updatePersistData(inputValue)); // 👈 This runs FIRST
    dispatch(saveFackData(responseData));   // 👈 This runs SECOND, using the modified responseData
    setInputValue('');
  }

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
                <input
                  id={field}
                  type="checkbox"
                  checked={fackData[field]}
                  onChange={(e) => handleChange(field, e.target.checked)}

                />
                <label htmlFor={field} className="capitalize">{field}

                </label>
              </div>
            ))}

            <button
              onClick={handleGenerate}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded flex items-center">

              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate Data
            </button>
          </div>






          <div className="w-1/2 bg-white p-6 rounded shadow">
            {Object.keys(responseData).length === 0 ? (
              <p className="text-gray-500">No generated data</p>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">Generated Output</h2>
                <div className="space-y-2">
                  {responseData.name && (
                    <p>
                      <span className="font-semibold capitalize">name:</span> {responseData.name}
                    </p>
                  )}
                  {responseData.email && (
                    <p>
                      <span className="font-semibold capitalize">email:</span> {responseData.email}
                    </p>
                  )}
                  {responseData.phone && (
                    <p>
                      <span className="font-semibold capitalize">phone:</span> {responseData.phone}
                    </p>
                  )}
                  {responseData.pan && (
                    <p>
                      <span className="font-semibold capitalize">pan:</span> {responseData.pan}
                    </p>
                  )}
                  {responseData.aadhar && (
                    <p>
                      <span className="font-semibold capitalize">Aadhar:</span> {responseData.aadhar}
                    </p>
                  )}
                  {responseData.address && (
                    <p>
                      <span className="font-semibold capitalize">Address:</span> {responseData.address}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Save persist"
                    className="border p-2 rounded w-full mb-2"
                    value={inputValue}
                    onChange={handleChangePersist}
                  />
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={handleSubmitPersistData}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
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
