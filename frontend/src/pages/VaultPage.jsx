import React, { useState, useEffect, useCallback } from 'react';
// Make sure this path is correct for your project structure
import Navbar from './Navbar';
import {
    PlusIcon, FolderPlusIcon, DocumentPlusIcon, LockClosedIcon, KeyIcon,
    EyeIcon, EyeSlashIcon, XMarkIcon, FolderIcon, DocumentIcon,
    ExclamationTriangleIcon, InformationCircleIcon, TrashIcon, PencilIcon
} from '@heroicons/react/24/outline';

// --- Dummy Data ---
const DUMMY_FOLDERS_INITIAL = [
    { _id: 'folder_1', name: 'Work Credentials' },
    { _id: 'folder_2', name: 'Social Media' },
    { _id: 'folder_3', name: 'Secure Notes' },
];
const DUMMY_ITEMS_INITIAL = {
    folder_1: [
        { _id: 'item_1a', title: 'Company Email', createdAt: new Date(Date.now() - 86400000).toISOString() }, // 1 day ago
        { _id: 'item_1b', title: 'VPN Access', createdAt: new Date().toISOString() },
    ],
    folder_2: [
        { _id: 'item_2a', title: 'Twitter Login', createdAt: new Date(Date.now() - 172800000).toISOString() }, // 2 days ago
    ],
    folder_3: [], // Start with an empty folder
};
const CORRECT_DUMMY_PASSWORD = "password123"; // Password used for simulation
// --- End Dummy Data ---


function VaultPage() {
    // Component State
    const [vaultState, setVaultState] = useState('unknown'); // 'unknown', 'needs_register', 'needs_login', 'logged_in'
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Modal States
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    // Add states for view/edit/delete modals if needed for future simulation

    // Form States
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [folderName, setFolderName] = useState('');
    const [itemData, setItemData] = useState({ title: '', content: '', vaultPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    // Vault Data State (using dummy data)
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [items, setItems] = useState([]); // Currently displayed items
    // Store *all* items keyed by folder ID for local simulation
    const [allItems, setAllItems] = useState({});

    // --- Helper Functions ---

    const clearMessages = useCallback(() => {
        setErrorMessage('');
        setSuccessMessage('');
    }, []);

    const resetForms = () => {
        setPassword('');
        setConfirmPassword('');
        setFolderName('');
        setItemData({ title: '', content: '', vaultPassword: '' });
        setShowPassword(false);
    };

    // Simulate API call delay
    const simulateApiCall = (duration = 500) => {
        setIsLoading(true); // Show loading state during simulation
        return new Promise(resolve => setTimeout(() => {
            setIsLoading(false); // Hide loading state after simulation
            resolve();
        }, duration));
    };

    // --- Flow Simulation ---

    // Initial State Simulation
    useEffect(() => {
        setVaultState('unknown');
        setIsLoading(true); // Show initial loading
        setLoadingMessage('Checking vault status...');
        simulateApiCall(800).then(() => {
            // Start in the 'needs_register' state for the demo
            setVaultState('needs_register');
            setIsLoading(false);
            setLoadingMessage('');
        });
    }, []); // Run only once on mount

    // Update displayed items when selectedFolderId or the master item list changes
    useEffect(() => {
        if (selectedFolderId && vaultState === 'logged_in') {
             // Get items for the selected folder from our simulated master list
             setItems(allItems[selectedFolderId] || []);
        } else {
            setItems([]); // Clear items if no folder selected or not logged in
        }
    }, [selectedFolderId, vaultState, allItems]);


    // Auto-clear success/error messages after a delay
    useEffect(() => {
        let timer;
        if (successMessage || errorMessage) {
            timer = setTimeout(clearMessages, 4000); // Adjust duration as needed
        }
        return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
    }, [successMessage, errorMessage, clearMessages]);

    // --- Modal Handlers ---

    const openRegisterModal = () => { clearMessages(); resetForms(); setIsRegisterModalOpen(true); };
    const closeRegisterModal = () => setIsRegisterModalOpen(false);
    const openLoginModal = () => { clearMessages(); resetForms(); setIsLoginModalOpen(true); };
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const openAddFolderModal = () => { clearMessages(); resetForms(); setIsAddFolderModalOpen(true); };
    const closeAddFolderModal = () => setIsAddFolderModalOpen(false);
    const openAddItemModal = (folderId) => {
        if (!folderId) return;
        clearMessages();
        resetForms();
        setSelectedFolderId(folderId); // Set context for which folder we're adding to
        setIsAddItemModalOpen(true);
    };
    const closeAddItemModal = () => setIsAddItemModalOpen(false);

    // --- Submit Handlers (Simulated Actions) ---

    // Simulate: registerVaultController
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        clearMessages();
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long."); return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match."); return;
        }
        setLoadingMessage('Registering vault...');
        await simulateApiCall(); // Simulate network delay
        setLoadingMessage('');

        // Simulate successful registration
        setSuccessMessage("Vault registered successfully! Please log in.");
        setVaultState('needs_login'); // Change state to prompt login
        closeRegisterModal();
        // Decide if you want to automatically open the login modal:
        // openLoginModal();
    };

    // Simulate: loginVaultController
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        clearMessages();
        if (!password) {
            setErrorMessage("Password is required."); return;
        }
        setLoadingMessage('Unlocking vault...');
        await simulateApiCall(); // Simulate network delay
        setLoadingMessage('');

        // Simulate checking the password
        if (password === CORRECT_DUMMY_PASSWORD) {
            setSuccessMessage("Successfully logged in to vault.");
            setVaultState('logged_in');
            setFolders(DUMMY_FOLDERS_INITIAL); // Load dummy folders
            setAllItems(DUMMY_ITEMS_INITIAL); // Load dummy items master list
            // Optionally select the first folder automatically
            // if (DUMMY_FOLDERS_INITIAL.length > 0) {
            //     setSelectedFolderId(DUMMY_FOLDERS_INITIAL[0]._id);
            // }
            closeLoginModal();
        } else {
            // Simulate incorrect password
            setErrorMessage("Invalid vault password.");
            // Keep the login modal open for another try
        }
    };

    // Simulate: folderVaultController
    const handleAddFolderSubmit = async (e) => {
        e.preventDefault();
        clearMessages();
        const trimmedName = folderName.trim();
        if (!trimmedName) {
            setErrorMessage("Folder name cannot be empty."); return;
        }
        // Simulate check for duplicate name (good practice)
        if (folders.some(f => f.name.toLowerCase() === trimmedName.toLowerCase())) {
             setErrorMessage(`Folder "${trimmedName}" already exists.`); return;
        }

        setLoadingMessage('Creating folder...');
        await simulateApiCall(); // Simulate network delay
        setLoadingMessage('');

        // Simulate successful folder creation
        const newFolder = {
            _id: `folder_${Date.now()}`, // Simple unique ID for demo
            name: trimmedName
        };
        // Update folders list
        setFolders(prev => [...prev, newFolder]);
        // Initialize an empty item list for the new folder in our master list
        setAllItems(prev => ({ ...prev, [newFolder._id]: [] }));
        setSuccessMessage(`Folder "${trimmedName}" created successfully.`);
        closeAddFolderModal();
    };

    // Simulate: itemVaultController
    const handleAddItemSubmit = async (e) => {
        e.preventDefault();
        clearMessages();
        if (!selectedFolderId) {
            setErrorMessage("Error: No folder selected."); return; // Should not happen if button is disabled
        }
        if (!itemData.title.trim() || !itemData.content.trim() || !itemData.vaultPassword.trim()) {
            setErrorMessage("Title, content, and vault password are required."); return;
        }

        setLoadingMessage('Adding item...');
        await simulateApiCall(); // Simulate network delay
        setLoadingMessage('');

        // Simulate checking vault password (as required by your backend logic)
        if (itemData.vaultPassword !== CORRECT_DUMMY_PASSWORD) {
            setErrorMessage("Incorrect vault password.");
            setItemData(prev => ({ ...prev, vaultPassword: '' })); // Clear password field
            return; // Keep modal open for correction
        }

        // Simulate successful item creation
        const newItem = {
            _id: `item_${Date.now()}`, // Simple unique ID for demo
            title: itemData.title.trim(),
            // In a real app, content would be encrypted and stored. Here we just use title/date.
            createdAt: new Date().toISOString()
        };

        // Update the master item list for the correct folder
        setAllItems(prev => {
            const currentFolderItems = prev[selectedFolderId] || [];
            return {
                ...prev, // Keep other folders' items
                [selectedFolderId]: [...currentFolderItems, newItem] // Add new item to the specific folder
            };
        });
        // Note: The `useEffect` watching `allItems` and `selectedFolderId` will update the `items` state for display automatically.

        setSuccessMessage(`Item "${newItem.title}" added successfully.`);
        closeAddItemModal();
    };

     // --- Simulate Logout/Lock ---
     const handleLogout = () => {
        setLoadingMessage('Logging out...');
        simulateApiCall(300).then(() => { // Faster simulation for logout
            setVaultState('needs_login'); // Go back to login screen
            // Clear all vault data
            setFolders([]);
            setItems([]);
            setAllItems({});
            setSelectedFolderId(null);
            // Reset forms and messages
            resetForms();
            clearMessages();
            setLoadingMessage('');
            setSuccessMessage("Vault locked successfully."); // Use "locked" or "logged out"
        });
    };

    // --- Render Logic ---

    const renderContent = () => {
        // Show main loading indicator if vault state is unknown or loading without specific message
        if (vaultState === 'unknown' || (isLoading && !loadingMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen))) {
             return <div className="text-center text-gray-500 py-10">Loading vault...</div>;
        }
         // Show specific loading message if available (and not inside a modal showing its own loader)
        if (isLoading && loadingMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen)) {
            return <div className="text-center text-gray-500 py-10">{loadingMessage}</div>;
        }

        switch (vaultState) {
            // --- Registration View ---
            case 'needs_register':
                return (
                    <div className="text-center p-6 bg-white shadow rounded-lg max-w-md mx-auto">
                        <ExclamationTriangleIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vault Registration Required</h2>
                        <p className="text-gray-600 mb-4">Create a secure vault to store sensitive data.</p>
                        {/* Show global messages if register modal isn't open */}
                        {!isRegisterModalOpen && errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
                        {!isRegisterModalOpen && successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={openRegisterModal} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <KeyIcon className="-ml-1 mr-2 h-5 w-5" /> Register Vault
                            </button>
                            <button onClick={() => { setVaultState('needs_login'); clearMessages(); }} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Already Registered? Log In
                            </button>
                        </div>
                    </div>
                );

            // --- Login View ---
            case 'needs_login':
                 return (
                     <div className="text-center p-6 bg-white shadow rounded-lg max-w-md mx-auto">
                        <LockClosedIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vault Locked</h2>
                        <p className="text-gray-600 mb-4">Log in to access your secure vault.</p>
                        {/* Show global messages if login modal isn't open */}
                         {!isLoginModalOpen && errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}
                         {!isLoginModalOpen && successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
                         <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={openLoginModal} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <KeyIcon className="-ml-1 mr-2 h-5 w-5" /> Login to Vault
                            </button>
                            <button onClick={() => { setVaultState('needs_register'); clearMessages(); }} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Need to Register?
                            </button>
                        </div>
                    </div>
                );

            // --- Logged-In View (Main Vault Interface) ---
            case 'logged_in':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Folder List Column */}
                        <div className="md:col-span-1">
                             {/* Folder Header */}
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Folders</h2>
                                <div>
                                     {/* Add Folder Button */}
                                     <button onClick={openAddFolderModal} title="Add New Folder" className="p-1 mr-2 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500" disabled={isLoading}>
                                        <FolderPlusIcon className="h-6 w-6" />
                                    </button>
                                     {/* Lock/Logout Button */}
                                     <button onClick={handleLogout} title="Lock Vault" className="p-1 rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400" disabled={isLoading}>
                                        <LockClosedIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            {/* Folder List Container */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg min-h-[200px]">
                                <ul role="list" className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
                                    {folders.length > 0 ? folders.map((folder) => (
                                        // Folder Item
                                        <li key={folder._id} onClick={() => !isLoading && setSelectedFolderId(folder._id)} className={`group px-4 py-3 sm:px-6 cursor-pointer transition duration-150 ease-in-out relative ${selectedFolderId === folder._id ? 'bg-indigo-50' : 'hover:bg-gray-50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <div className="flex items-center justify-between">
                                                {/* Folder Icon and Name */}
                                                <div className="flex items-center space-x-3 truncate">
                                                    <FolderIcon className={`h-5 w-5 flex-shrink-0 ${selectedFolderId === folder._id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                                    <span className={`text-sm font-medium truncate ${selectedFolderId === folder._id ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                        {folder.name}
                                                    </span>
                                                </div>
                                                {/* Placeholder for Edit/Delete Icons (show on hover) */}
                                                {/* <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button title="Edit Folder" className="p-1 text-gray-400 hover:text-indigo-600"><PencilIcon className="h-4 w-4"/></button>
                                                    <button title="Delete Folder" className="p-1 text-gray-400 hover:text-red-600"><TrashIcon className="h-4 w-4"/></button>
                                                </div> */}
                                            </div>
                                        </li>
                                    )) : (
                                        // Empty State for Folders
                                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                            No folders created yet.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Item List Column */}
                        <div className="md:col-span-2">
                            {/* Item Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 truncate pr-2">
                                    {/* Show selected folder name or prompt */}
                                    {selectedFolderId ? `Items in "${folders.find(f => f._id === selectedFolderId)?.name || '...'}"` : 'Select a Folder'}
                                </h2>
                                {/* Add Item Button (enabled only when a folder is selected) */}
                                {selectedFolderId && (
                                    <button onClick={() => openAddItemModal(selectedFolderId)} title="Add New Item" className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFolderId || isLoading}>
                                        <DocumentPlusIcon className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                             {/* Item List Container */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg min-h-[200px]">
                                {selectedFolderId ? (
                                    // Check if items exist for the selected folder
                                    items.length > 0 ? (
                                        <ul role="list" className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
                                            {items.map((item) => (
                                                // Item Row
                                                <li key={item._id} className="group px-4 py-3 sm:px-6 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out relative">
                                                    <div className="flex items-center justify-between">
                                                         {/* Item Icon and Title */}
                                                        <div className="flex items-center space-x-3 truncate">
                                                            <DocumentIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                                        </div>
                                                        {/* Placeholder for View/Edit/Delete Icons (show on hover) */}
                                                         <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                              {/* <button title="View/Edit Item" className="p-1 text-gray-400 hover:text-indigo-600"><PencilIcon className="h-4 w-4"/></button> */}
                                                              {/* <button title="Delete Item" className="p-1 text-gray-400 hover:text-red-600"><TrashIcon className="h-4 w-4"/></button> */}
                                                         </div>
                                                    </div>
                                                     {/* Item Metadata (Creation Date) */}
                                                    <p className="mt-1 text-xs text-gray-500 pl-8">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        // Empty State for Items in selected folder
                                        <div className="flex items-center justify-center h-full py-10 px-4 text-center">
                                            <p className="text-gray-500">No items in this folder yet. Click the <DocumentPlusIcon className="h-4 w-4 inline-block mx-1 text-indigo-600"/> icon to add one.</p>
                                        </div>
                                    )
                                ) : (
                                    // Prompt to select a folder
                                    <div className="flex items-center justify-center h-full py-10 px-4 text-center">
                                        <InformationCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
                                        <p className="text-gray-500">Select a folder on the left to view or add items.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            // Fallback for unexpected state
            default:
                return <div className="text-center text-red-500 py-10">Error: Invalid vault state.</div>;
        }
    };

    // --- Main Return ---
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />
            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Secure Vault (Demo Mode)</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your encrypted folders and items.</p>
                </header>

                 {/* Global Success/Error Messages (shown when modals are closed) */}
                 {successMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen) && (
                    <div className='p-4 mb-4 rounded-md bg-green-100 text-green-700 border border-green-300 font-medium transition-opacity duration-300'>
                        {successMessage}
                    </div>
                )}
                 {errorMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen) && (
                    <div className='p-4 mb-4 rounded-md bg-red-100 text-red-700 border border-red-300 font-medium transition-opacity duration-300'>
                        Error: {errorMessage}
                    </div>
                )}

                {/* Render the main content based on vaultState */}
                {renderContent()}

                {/* --- Modals --- */}
                {/* The JSX for modals is kept separate for clarity but uses the simulated handlers */}

                {/* Register Vault Modal */}
                {isRegisterModalOpen && (
                    <div className="fixed z-20 inset-0 overflow-y-auto"> {/* Higher z-index for modals */}
                         <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            {/* Vertical alignment helper */}
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            {/* Modal Panel */}
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleRegisterSubmit}>
                                    {/* Modal Header */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <KeyIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                    Register New Vault
                                                </h3>
                                                <div className="mt-1">
                                                    <p className="text-sm text-gray-500">
                                                        Choose a strong master password. This cannot be recovered if lost.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                         {/* Close Button */}
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeRegisterModal}>
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                    {/* Modal Body */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div className="space-y-4">
                                            {/* Password Field */}
                                            <div>
                                                <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700">Vault Password <span className="text-red-500">*</span></label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="regPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                                        required minLength="6"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                                                        aria-describedby="password-constraints"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1">
                                                            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                                            {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500" id="password-constraints">Minimum 6 characters.</p>
                                            </div>
                                            {/* Confirm Password Field */}
                                            <div>
                                                <label htmlFor="regConfirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="regConfirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Modal Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>
                                            {isLoading ? 'Registering...' : 'Register Vault'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeRegisterModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Vault Modal */}
                {isLoginModalOpen && (
                    <div className="fixed z-20 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                             {/* Vertical alignment helper */}
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            {/* Modal Panel */}
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleLoginSubmit}>
                                    {/* Modal Header */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <LockClosedIcon className="h-6 w-6 text-indigo-600" aria-hidden="true"/>
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Unlock Vault</h3>
                                                <p className="mt-1 text-sm text-gray-500">Enter your vault master password.</p>
                                            </div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeLoginModal}> <span className="sr-only">Close</span> <XMarkIcon className="h-6 w-6"/> </button>
                                    </div>
                                    {/* Modal Body */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div>
                                            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">Vault Password <span className="text-red-500">*</span></label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="loginPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                                                />
                                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1">
                                                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                                        {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Modal Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>
                                            {isLoading ? 'Unlocking...' : 'Unlock Vault'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeLoginModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                 {/* Add Folder Modal */}
                {isAddFolderModalOpen && (
                    <div className="fixed z-20 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Overlay */}
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            {/* Panel */}
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                               <form onSubmit={handleAddFolderSubmit}>
                                    {/* Header */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <FolderPlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true"/>
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Folder</h3>
                                            </div>
                                        </div>
                                         <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeAddFolderModal}> <span className="sr-only">Close</span> <XMarkIcon className="h-6 w-6"/> </button>
                                    </div>
                                    {/* Body */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div>
                                            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700">Folder Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text" id="folderName" name="folderName" value={folderName} onChange={(e) => setFolderName(e.target.value)}
                                                required
                                                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                    {/* Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>
                                            {isLoading ? 'Creating...' : 'Create Folder'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeAddFolderModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Item Modal */}
                {isAddItemModalOpen && (
                     <div className="fixed z-20 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Overlay */}
                             <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            {/* Panel */}
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                               <form onSubmit={handleAddItemSubmit}>
                                    {/* Header */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <DocumentPlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true"/>
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Item</h3>
                                                <p className="mt-1 text-sm text-gray-500">To folder: <span className="font-medium">{folders.find(f => f._id === selectedFolderId)?.name || '...'}</span></p>
                                            </div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeAddItemModal}> <span className="sr-only">Close</span> <XMarkIcon className="h-6 w-6"/> </button>
                                    </div>
                                    {/* Body */}
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div className="space-y-4">
                                            {/* Title Field */}
                                            <div>
                                                <label htmlFor="itemTitle" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text" id="itemTitle" name="title" value={itemData.title} onChange={(e) => setItemData({...itemData, title: e.target.value})}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                            {/* Content Field */}
                                            <div>
                                                <label htmlFor="itemContent" className="block text-sm font-medium text-gray-700">Content (will be encrypted) <span className="text-red-500">*</span></label>
                                                <textarea
                                                    id="itemContent" name="content" rows={4} value={itemData.content} onChange={(e) => setItemData({...itemData, content: e.target.value})}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                ></textarea>
                                            </div>
                                            {/* Vault Password Field (Required for Encryption) */}
                                            <div>
                                                <label htmlFor="itemVaultPassword" className="block text-sm font-medium text-gray-700">Vault Password (for encryption) <span className="text-red-500">*</span></label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="itemVaultPassword" name="vaultPassword" value={itemData.vaultPassword} onChange={(e) => setItemData({...itemData, vaultPassword: e.target.value})}
                                                        required placeholder="Enter vault password again"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                                                        aria-describedby="password-enc-hint"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1">
                                                            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                                            {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500" id="password-enc-hint">Required to encrypt this item securely.</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Footer */}
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>
                                            {isLoading ? 'Adding...' : 'Add Item'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeAddItemModal} disabled={isLoading}>
                                            Cancel
                                        </button>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default VaultPage;