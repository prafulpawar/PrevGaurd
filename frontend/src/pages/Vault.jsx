import React, { useState } from 'react';
import Navbar from '../pages/Navbar'; // Adjust path if necessary
import { LockClosedIcon, LockOpenIcon, PlusIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';

// --- बहुत असुरक्षित - केवल डेमो के लिए ---
const VAULT_PASSWORD = "123"; // <<-- इस पासवर्ड को कभी भी वास्तविक ऐप में ऐसे हार्डकोड न करें!
// ------------------------------------

function Vault() {
    const [isLocked, setIsLocked] = useState(true);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');

    // Vault items state (Data lost on reload in this example)
    const [vaultItems, setVaultItems] = useState([
        { id: 1, title: 'Example Wifi Pass', content: 'MySecretWifi123', showContent: false },
        { id: 2, title: 'Secret Note', content: 'Remember the plan for Tuesday.', showContent: false },
    ]);

    // State for adding new items
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const handleUnlock = (e) => {
        e.preventDefault(); // Prevent form submission reload
        if (passwordInput === VAULT_PASSWORD) {
            setIsLocked(false);
            setError('');
            setPasswordInput(''); // Clear input after successful unlock
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    const handleLock = () => {
        setIsLocked(true);
        // Optionally clear all 'showContent' flags when locking
        setVaultItems(items => items.map(item => ({ ...item, showContent: false })));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newTitle || !newContent) {
            alert('Please fill in both title and content.');
            return;
        }
        const newItem = {
            id: Date.now(), // Simple unique ID for demo
            title: newTitle,
            content: newContent,
            showContent: false, // Initially hidden
        };
        setVaultItems([...vaultItems, newItem]);
        setNewTitle(''); // Clear form
        setNewContent('');
    };

    const handleDeleteItem = (idToDelete) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setVaultItems(vaultItems.filter(item => item.id !== idToDelete));
        }
    };

    const toggleShowContent = (idToToggle) => {
        setVaultItems(vaultItems.map(item =>
            item.id === idToToggle ? { ...item, showContent: !item.showContent } : item
        ));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar /> {/* Include Navbar */}
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center justify-center">
                        <LockClosedIcon className="h-8 w-8 mr-2 text-gray-500" /> Secure Vault
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Store sensitive information securely (Demo Only).
                    </p>
                </header>

                {isLocked ? (
                    // --- Locked View ---
                    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto text-center border border-yellow-300">
                        <LockClosedIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-4">Vault Locked</h2>
                        <p className="text-gray-600 mb-6">Enter the password to unlock your vault.</p>
                        <form onSubmit={handleUnlock}>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter Vault Password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <LockOpenIcon className="h-5 w-5 mr-2" />
                                Unlock Vault
                            </button>
                        </form>
                    </div>
                ) : (
                    // --- Unlocked View ---
                    <div className="space-y-8">
                        {/* Lock Button */}
                        <div className="text-right">
                             <button
                                onClick={handleLock}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                             >
                                 <LockClosedIcon className="h-5 w-5 mr-2" />
                                Lock Vault
                             </button>
                         </div>

                        {/* Add New Item Form */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h2>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div>
                                    <label htmlFor="itemTitle" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        id="itemTitle"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="e.g., Website Login, License Key"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemContent" className="block text-sm font-medium text-gray-700">Content</label>
                                    <textarea
                                        id="itemContent"
                                        rows="3"
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter the secret information here..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                        Add Item
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Vault Items List */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                             <h2 className="text-lg font-medium text-gray-900 p-4 sm:px-6 border-b border-gray-200">Vault Contents</h2>
                             {vaultItems.length > 0 ? (
                                <ul role="list" className="divide-y divide-gray-200">
                                    {vaultItems.map((item) => (
                                        <li key={item.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <p className="text-md font-medium text-indigo-600 truncate">{item.title}</p>
                                                <div className="ml-2 flex-shrink-0 flex space-x-2">
                                                    <button
                                                        onClick={() => toggleShowContent(item.id)}
                                                        className="p-1 text-gray-400 hover:text-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        title={item.showContent ? "Hide Content" : "Show Content"}
                                                    >
                                                        {item.showContent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-1 text-gray-400 hover:text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        title="Delete Item"
                                                    >
                                                         <TrashIcon className="h-5 w-5"/>
                                                     </button>
                                                 </div>
                                             </div>
                                             {item.showContent && (
                                                 <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 break-words">
                                                     {item.content}
                                                 </div>
                                             )}
                                        </li>
                                    ))}
                                </ul>
                              ) : (
                                 <p className="text-center p-10 text-gray-500">Your vault is empty. Add a new item above.</p>
                              )}
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Vault;