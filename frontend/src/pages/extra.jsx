import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import {
    PlusIcon, FolderPlusIcon, DocumentPlusIcon, LockClosedIcon, KeyIcon,
    EyeIcon, EyeSlashIcon, XMarkIcon, FolderIcon, DocumentIcon,
    ExclamationTriangleIcon, InformationCircleIcon, TrashIcon, PencilIcon
} from '@heroicons/react/24/outline';

import { registerVaultThunk , selectVaultError , selectVaultSucess , selectVaultLoading } from '../redux/slice/vaultSlice';
import { useDispatch , useSelector } from 'react-redux';


function VaultPage() {
     const dispatch = useDispatch();
    
    const [vaultState, setVaultState] = useState('unknown');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isViewItemModalOpen, setIsViewItemModalOpen] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [folderName, setFolderName] = useState('');
    const [itemData, setItemData] = useState({ title: '', content: '', vaultPassword: '' });
    const [viewPassword, setViewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState({});
    const [itemToView, setItemToView] = useState(null);
    const [decryptedContent, setDecryptedContent] = useState('');

    const [viewModalErrorMessage, setViewModalErrorMessage] = useState('');
    const [viewModalLoadingMessage, setViewModalLoadingMessage] = useState('');


    const clearMessages = useCallback(() => {
        setErrorMessage('');
        setSuccessMessage('');
        setViewModalErrorMessage('');
        setViewModalLoadingMessage('');
    }, []);

    const resetForms = () => {
        setPassword('');
        setConfirmPassword('');
        setFolderName('');
        setItemData({ title: '', content: '', vaultPassword: '' });
        setViewPassword('');
        setShowPassword(false);
    };

    const simulateApiCall = (duration = 500) => {
        setIsLoading(true);
        return new Promise(resolve => setTimeout(() => {
            setIsLoading(false);
            resolve();
        }, duration));
    };

    useEffect(() => {
        setVaultState('unknown');
        setIsLoading(true);
        setLoadingMessage('Checking vault status...');
        simulateApiCall(800).then(() => {
            setVaultState('needs_register');
            setIsLoading(false);
            setLoadingMessage('');
        });
    }, []);

    useEffect(() => {
        if (selectedFolderId && vaultState === 'logged_in') {
             setItems(allItems[selectedFolderId] || []);
        } else {
            setItems([]);
        }
    }, [selectedFolderId, vaultState, allItems]);


    useEffect(() => {
        let timer;
        if (successMessage || errorMessage) {
            timer = setTimeout(clearMessages, 4000);
        }
        return () => clearTimeout(timer);
    }, [successMessage, errorMessage, clearMessages]);

    const openRegisterModal = () => { clearMessages(); resetForms(); setIsRegisterModalOpen(true); };
    const closeRegisterModal = () => setIsRegisterModalOpen(false);

    const openLoginModal = () => { clearMessages(); resetForms(); setIsLoginModalOpen(true); };
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const openAddFolderModal = () => { clearMessages(); resetForms(); setIsAddFolderModalOpen(true); };
    const closeAddFolderModal = () => setIsAddFolderModalOpen(false);

    const openAddItemModal = (folderId) => {
        if (!folderId) return;
        clearMessages(); resetForms(); setSelectedFolderId(folderId); setIsAddItemModalOpen(true);
    };
    const closeAddItemModal = () => setIsAddItemModalOpen(false);

    const openViewItemModal = (item) => {
        if (!item) return;
        clearMessages();
        setViewModalErrorMessage('');
        setViewModalLoadingMessage('');
        setDecryptedContent('');
        setViewPassword('');
        setShowPassword(false);

        setItemToView({ _id: item._id, title: item.title });
        setIsViewItemModalOpen(true);
    };

    const closeViewItemModal = () => {
        setIsViewItemModalOpen(false);
        setItemToView(null);
        setDecryptedContent('');
        setViewPassword('');
        setViewModalErrorMessage('');
        setViewModalLoadingMessage('');
        setShowPassword(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault(); clearMessages();
        if (password.length < 6) { setErrorMessage("Password must be at least 6 characters long."); return; }
        if (password !== confirmPassword) { setErrorMessage("Passwords do not match."); return; }

        setLoadingMessage('Registering vault...');
        await simulateApiCall();
        setLoadingMessage('');
        dispatch(registerVaultThunk(password))
        setSuccessMessage("Vault registered successfully! Please log in.");
        setVaultState('needs_login');
        closeRegisterModal();
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault(); clearMessages();
        if (!password) { setErrorMessage("Password is required."); return; }

        setLoadingMessage('Unlocking vault...');
        await simulateApiCall();
        setLoadingMessage('');

        if (password === CORRECT_DUMMY_PASSWORD) {
            setSuccessMessage("Successfully logged in to vault.");
            setVaultState('logged_in');
            setFolders(DUMMY_FOLDERS_INITIAL);
            setAllItems(DUMMY_ITEMS_INITIAL);
            setSelectedFolderId(null);
            closeLoginModal();
        } else {
            setErrorMessage("Invalid vault password.");
        }
    };

    const handleAddFolderSubmit = async (e) => {
        e.preventDefault(); clearMessages();
        const trimmedName = folderName.trim();
        if (!trimmedName) { setErrorMessage("Folder name cannot be empty."); return; }
        if (folders.some(f => f.name.toLowerCase() === trimmedName.toLowerCase())) { setErrorMessage(`Folder "${trimmedName}" already exists.`); return; }

        setLoadingMessage('Creating folder...');
        await simulateApiCall();
        setLoadingMessage('');

        const newFolder = { _id: `folder_${Date.now()}`, name: trimmedName };
        setFolders(prev => [...prev, newFolder]);
        setAllItems(prev => ({ ...prev, [newFolder._id]: [] }));
        setSuccessMessage(`Folder "${trimmedName}" created successfully.`);
        closeAddFolderModal();
    };

    const handleAddItemSubmit = async (e) => {
        e.preventDefault(); clearMessages();
        if (!selectedFolderId) { setErrorMessage("Error: No folder selected."); return; }
        if (!itemData.title.trim() || !itemData.content.trim() || !itemData.vaultPassword.trim()) { setErrorMessage("Title, content, and vault password are required."); return; }

        setLoadingMessage('Adding item...');
        await simulateApiCall();
        setLoadingMessage('');

        if (itemData.vaultPassword !== CORRECT_DUMMY_PASSWORD) {
            setErrorMessage("Incorrect vault password.");
            setItemData(prev => ({ ...prev, vaultPassword: '' }));
            return;
        }

        const newItem = { _id: `item_${Date.now()}`, title: itemData.title.trim(), createdAt: new Date().toISOString() };
        setAllItems(prev => {
            const currentFolderItems = prev[selectedFolderId] || [];
            return { ...prev, [selectedFolderId]: [...currentFolderItems, newItem] };
        });

        setSuccessMessage(`Item "${newItem.title}" added successfully.`);
        closeAddItemModal();
    };

    const handleViewItemSubmit = async (e) => {
        e.preventDefault();
        setViewModalErrorMessage('');
        if (!viewPassword) { setViewModalErrorMessage("Vault password is required to view the item."); return; }
        if (!itemToView) { setViewModalErrorMessage("Error: No item selected for viewing."); return; }

        setViewModalLoadingMessage('Decrypting item...');
        await simulateApiCall(600);
        setViewModalLoadingMessage('');

        if (viewPassword === CORRECT_DUMMY_PASSWORD) {
            setDecryptedContent(`--- Simulated Decrypted Content ---\n\nItem Title: ${itemToView.title}\n\nThis is where the actual secret content (like a password, note, etc.) would appear after being decrypted using your Vault Password.\n\nTimestamp: ${new Date().toLocaleString()}\n\n--- End Simulated Content ---`);
            setViewPassword('');
        } else {
            setViewModalErrorMessage("Incorrect vault password.");
            setViewPassword('');
            setDecryptedContent('');
        }
    };

     const handleLogout = () => {
        setLoadingMessage('Logging out...');
        simulateApiCall(300).then(() => {
            setVaultState('needs_login');
            setFolders([]);
            setItems([]);
            setAllItems({});
            setSelectedFolderId(null);
            resetForms();
            clearMessages();
            setLoadingMessage('');
            setSuccessMessage("Vault locked successfully.");
        });
    };

    const renderContent = () => {
        if (vaultState === 'unknown' || (isLoading && !loadingMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen || isViewItemModalOpen))) {
             return <div className="text-center text-gray-500 py-10">Loading vault...</div>;
        }
        if (isLoading && loadingMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen || isViewItemModalOpen)) {
            return <div className="text-center text-gray-500 py-10">{loadingMessage}</div>;
        }

        switch (vaultState) {
            case 'needs_register':
                return (
                    <div className="text-center p-6 bg-white shadow rounded-lg max-w-md mx-auto">
                        <ExclamationTriangleIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vault Registration Required</h2>
                        <p className="text-gray-600 mb-4">Create a secure vault to store sensitive data.</p>
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

            case 'needs_login':
                 return (
                     <div className="text-center p-6 bg-white shadow rounded-lg max-w-md mx-auto">
                        <LockClosedIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vault Locked</h2>
                        <p className="text-gray-600 mb-4">Log in to access your secure vault.</p>
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

            case 'logged_in':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Folders</h2>
                                <div>
                                     <button onClick={openAddFolderModal} title="Add New Folder" className="p-1 mr-2 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50" disabled={isLoading}>
                                        <FolderPlusIcon className="h-6 w-6" />
                                    </button>
                                     <button onClick={handleLogout} title="Lock Vault" className="p-1 rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 disabled:opacity-50" disabled={isLoading}>
                                        <LockClosedIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg min-h-[200px]">
                                <ul role="list" className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
                                    {folders.length > 0 ? folders.map((folder) => (
                                        <li key={folder._id} onClick={() => !isLoading && setSelectedFolderId(folder._id)} className={`group px-4 py-3 sm:px-6 cursor-pointer transition duration-150 ease-in-out relative ${selectedFolderId === folder._id ? 'bg-indigo-50' : 'hover:bg-gray-50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3 truncate">
                                                    <FolderIcon className={`h-5 w-5 flex-shrink-0 ${selectedFolderId === folder._id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                                    <span className={`text-sm font-medium truncate ${selectedFolderId === folder._id ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                        {folder.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    )) : ( <li className="px-4 py-4 sm:px-6 text-center text-gray-500"> No folders created yet. </li> )}
                                </ul>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 truncate pr-2">
                                    {selectedFolderId ? `Items in "${folders.find(f => f._id === selectedFolderId)?.name || '...'}"` : 'Select a Folder'}
                                </h2>
                                {selectedFolderId && (
                                    <button onClick={() => openAddItemModal(selectedFolderId)} title="Add New Item" className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFolderId || isLoading}>
                                        <DocumentPlusIcon className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                             <div className="bg-white shadow overflow-hidden sm:rounded-lg min-h-[200px]">
                                {selectedFolderId ? (
                                    items.length > 0 ? (
                                        <ul role="list" className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
                                            {items.map((item) => (
                                                <li key={item._id} className="group px-4 py-3 sm:px-6 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out relative">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3 truncate flex-1 mr-2" onClick={() => !isLoading && openViewItemModal(item)}>
                                                            <DocumentIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                                        </div>
                                                         <div className="flex-shrink-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                              <button
                                                                  onClick={(e) => { e.stopPropagation(); !isLoading && openViewItemModal(item); }}
                                                                  title="View Item"
                                                                  className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full disabled:opacity-50"
                                                                  disabled={isLoading}
                                                              >
                                                                  <PencilIcon className="h-4 w-4"/>
                                                              </button>
                                                         </div>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500 pl-8">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : ( <div className="flex items-center justify-center h-full py-10 px-4 text-center"> <p className="text-gray-500">No items in this folder yet. Click the <DocumentPlusIcon className="h-4 w-4 inline-block mx-1 text-indigo-600"/> icon to add one.</p> </div> )
                                ) : ( <div className="flex items-center justify-center h-full py-10 px-4 text-center"> <InformationCircleIcon className="h-6 w-6 text-gray-400 mr-2" /> <p className="text-gray-500">Select a folder on the left to view or add items.</p> </div> )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div className="text-center text-red-500 py-10">Error: Invalid vault state.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Secure Vault </h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your encrypted folders and items.</p>
                </header>

                 {successMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen || isViewItemModalOpen) && (
                    <div className='p-4 mb-4 rounded-md bg-green-100 text-green-700 border border-green-300 font-medium transition-opacity duration-300'> {successMessage} </div>
                )}
                 {errorMessage && !(isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen || isViewItemModalOpen) && (
                    <div className='p-4 mb-4 rounded-md bg-red-100 text-red-700 border border-red-300 font-medium transition-opacity duration-300'> Error: {errorMessage} </div>
                )}

                {renderContent()}

                {isRegisterModalOpen && (
                    <div className="fixed z-20 inset-0 overflow-y-auto">
                         <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleRegisterSubmit}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 relative">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"> <KeyIcon className="h-6 w-6 text-indigo-600"/> </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"> <h3 className="text-lg leading-6 font-medium text-gray-900">Register New Vault</h3> <p className="text-sm text-gray-500 mt-1">Choose a strong master password. Cannot be recovered.</p> </div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeRegisterModal}> <span className="sr-only">Close</span> <XMarkIcon className="h-6 w-6"/> </button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div className="space-y-4">
                                            <div> <label htmlFor="regPassword">Vault Password <span className="text-red-500">*</span></label> <div className="mt-1 relative rounded-md shadow-sm"> <input type={showPassword?'text':'password'} id="regPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" aria-describedby="password-constraints"/><div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1"><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div> </div> <p className="mt-1 text-xs text-gray-500" id="password-constraints">Minimum 6 characters.</p> </div>
                                            <div> <label htmlFor="regConfirmPassword">Confirm Password <span className="text-red-500">*</span></label> <input type={showPassword?'text':'password'} id="regConfirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/> </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register Vault'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeRegisterModal} disabled={isLoading}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {isLoginModalOpen && (
                     <div className="fixed z-20 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleLoginSubmit}>
                                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 relative">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"><LockClosedIcon className="h-6 w-6 text-indigo-600"/></div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 className="text-lg leading-6 font-medium text-gray-900">Unlock Vault</h3><p className="mt-1 text-sm text-gray-500">Enter your vault master password.</p></div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeLoginModal}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                     </div>
                                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div><label htmlFor="loginPassword">Vault Password <span className="text-red-500">*</span></label><div className="mt-1 relative rounded-md shadow-sm"><input type={showPassword?'text':'password'} id="loginPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"/><div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1"><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div></div></div>
                                     </div>
                                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Unlocking...' : 'Unlock Vault'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeLoginModal} disabled={isLoading}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                 {isAddFolderModalOpen && (
                    <div className="fixed z-20 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                               <form onSubmit={handleAddFolderSubmit}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 relative">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"><FolderPlusIcon className="h-6 w-6 text-indigo-600"/></div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 className="text-lg leading-6 font-medium text-gray-900">Create New Folder</h3></div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeAddFolderModal}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div><label htmlFor="folderName">Folder Name <span className="text-red-500">*</span></label><input type="text" id="folderName" name="folderName" value={folderName} onChange={(e) => setFolderName(e.target.value)} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/></div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Folder'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeAddFolderModal} disabled={isLoading}>Cancel</button>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                )}

                {isAddItemModalOpen && (
                     <div className="fixed z-20 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                             <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                               <form onSubmit={handleAddItemSubmit}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 relative">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"><DocumentPlusIcon className="h-6 w-6 text-indigo-600"/></div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 className="text-lg leading-6 font-medium text-gray-900">Add New Item</h3><p className="mt-1 text-sm text-gray-500">To folder: <span className="font-medium">{folders.find(f => f._id === selectedFolderId)?.name || '...'}</span></p></div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeAddItemModal}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {errorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{errorMessage}</p>}
                                        {loadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{loadingMessage}</p>}
                                        <div className="space-y-4">
                                            <div><label htmlFor="itemTitle">Title <span className="text-red-500">*</span></label><input type="text" id="itemTitle" name="title" value={itemData.title} onChange={(e) => setItemData({...itemData, title: e.target.value})} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"/></div>
                                            <div><label htmlFor="itemContent">Content (will be encrypted) <span className="text-red-500">*</span></label><textarea id="itemContent" name="content" rows={4} value={itemData.content} onChange={(e) => setItemData({...itemData, content: e.target.value})} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea></div>
                                            <div><label htmlFor="itemVaultPassword">Vault Password (for encryption) <span className="text-red-500">*</span></label><div className="mt-1 relative rounded-md shadow-sm"><input type={showPassword?'text':'password'} id="itemVaultPassword" name="vaultPassword" value={itemData.vaultPassword} onChange={(e) => setItemData({...itemData, vaultPassword: e.target.value})} required placeholder="Enter vault password again" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" aria-describedby="password-enc-hint"/><div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1"><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div></div><p className="mt-1 text-xs text-gray-500" id="password-enc-hint">Required to encrypt this item securely.</p></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Item'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={closeAddItemModal} disabled={isLoading}>Cancel</button>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                )}

                {isViewItemModalOpen && itemToView && (
                    <div className="fixed z-30 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleViewItemSubmit}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 relative">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"><EyeIcon className="h-6 w-6 text-indigo-600"/></div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 className="text-lg leading-6 font-medium text-gray-900">View Item Details</h3><p className="mt-1 text-sm font-medium text-indigo-700 truncate">{itemToView?.title || 'Loading...'}</p></div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeViewItemModal}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {viewModalErrorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">{viewModalErrorMessage}</p>}
                                        {viewModalLoadingMessage && <p className="text-blue-600 text-sm mb-3 text-center">{viewModalLoadingMessage}</p>}
                                        {decryptedContent ? (
                                            <div className="mt-2 space-y-3">
                                                <h4 className="text-sm font-medium text-gray-800">Decrypted Content:</h4>
                                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">{decryptedContent}</pre>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <label htmlFor="viewPassword">Enter Vault Password to View <span className="text-red-500">*</span></label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <input type={showPassword ? 'text' : 'password'} id="viewPassword" name="viewPassword" value={viewPassword} onChange={(e) => setViewPassword(e.target.value)} required className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" autoFocus/>
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1"><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">Required to decrypt and view the item's content.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        {!decryptedContent && (
                                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Decrypting...' : 'Decrypt & View'}</button>
                                        )}
                                        <button type="button" className={`mt-3 w-full inline-flex justify-center rounded-md border ${decryptedContent ? 'border-indigo-600' : 'border-gray-300'} shadow-sm px-4 py-2 ${decryptedContent ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-50'} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm`} onClick={closeViewItemModal} disabled={isLoading && !decryptedContent}>{decryptedContent ? 'Close' : 'Cancel'}</button>
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