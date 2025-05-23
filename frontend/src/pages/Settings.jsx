import React, { useState } from 'react';
import Navbar from '../pages/Navbar'; // Adjust path if necessary
import { Cog6ToothIcon, MoonIcon, SunIcon, BellAlertIcon, EnvelopeIcon, ServerIcon } from '@heroicons/react/24/outline';


const ToggleSwitch = ({ label, enabled, onChange, description = "" }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <label className="block text-md font-medium text-gray-800">{label}</label>
            {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <button
            type="button"
            className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            role="switch"
            aria-checked={enabled}
            onClick={onChange}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
            />
        </button>
    </div>
);


function Settings() {
  
    const [darkModeEnabled, setDarkModeEnabled] = useState(false); 
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    
    const handleDarkModeToggle = () => {
        setDarkModeEnabled(!darkModeEnabled);
        alert('Dark mode functionality needs full implementation (updating HTML class and saving preference).');
        
    };

    const handleEmailToggle = () => {
        setEmailNotifications(!emailNotifications);
       
    };

    const handlePushToggle = () => {
         setPushNotifications(!pushNotifications);
  
        alert('Push notification functionality requires service workers and backend setup.');
    };

    const handleExportData = () => {
        alert('Export data functionality not implemented yet.');
      
    };
     

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center">
                        <Cog6ToothIcon className="h-8 w-8 mr-2 text-gray-500" /> Application Settings
                    </h1>
                </header>

                <div className="space-y-8">
                  
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-1">Appearance</h2>
                         <div className="divide-y divide-gray-200">
                            <ToggleSwitch
                                label="Dark Mode"
                                description="Enable dark theme across the application."
                                enabled={darkModeEnabled}
                                onChange={handleDarkModeToggle}
                             />
                           
                         </div>
                    </div>

                  
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-1">Notifications</h2>
                         <div className="divide-y divide-gray-200">
                             <ToggleSwitch
                                label="Email Notifications"
                                description="Receive important updates and breach alerts via email."
                                enabled={emailNotifications}
                                onChange={handleEmailToggle}
                             />
                             <ToggleSwitch
                                label="Push Notifications"
                                description="Get real-time alerts directly on your device (requires browser permission)."
                                enabled={pushNotifications}
                                onChange={handlePushToggle}
                             />
                         </div>
                    </div>

                   
                     <div className="bg-white shadow rounded-lg p-6">
                         <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
                         <div className="space-y-4">
                             <div>
                                 <h3 className="text-md font-medium text-gray-800">Export Your Data</h3>
                                 <p className="text-sm text-gray-600 mt-1">Download a copy of your tracked data and vault items.</p>
                                 <button
                                     onClick={handleExportData}
                                     className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                 >
                                     <ServerIcon className="h-5 w-5 mr-2 text-gray-400" />
                                     Export Data
                                 </button>
                             </div>
                         
                         </div>
                     </div>

                </div>
            </main>
        </div>
    );
}

export default Settings;