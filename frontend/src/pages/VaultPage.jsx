import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import {
    PlusIcon, FolderPlusIcon, DocumentPlusIcon, LockClosedIcon, KeyIcon,
    EyeIcon, EyeSlashIcon, XMarkIcon, FolderIcon, DocumentIcon,
    ExclamationTriangleIcon, InformationCircleIcon, TrashIcon, PencilIcon
} from '@heroicons/react/24/outline';

import {
    registerVaultThunk,
    selectVaultError,
    selectVaultSucess, // Fix typo potential, should be selectVaultSuccess? Check slice definition. Assuming 'Sucess' matches slice for now.
    selectVaultLoading
} from '../redux/slice/vaultSlice'; // Assuming vaultSlice exports these
import { useDispatch, useSelector } from 'react-redux';

// --- Dummy Data (Keep these for simulated actions) ---
// Define dummy password outside the component
const CORRECT_DUMMY_PASSWORD = 'correctPassword123'; // Replace with your actual simulation password

const DUMMY_FOLDERS_INITIAL = [
    { _id: 'folder_1', name: 'Passwords' },
    { _id: 'folder_2', name: 'Secret Notes' },
    { _id: 'folder_3', name: 'Bank Details' },
];

const DUMMY_ITEMS_INITIAL = {
    'folder_1': [
        { _id: 'item_1_1', title: 'My Website Login', createdAt: new Date().toISOString() },
        { _id: 'item_1_2', title: 'Email Password', createdAt: new Date().toISOString() },
    ],
    'folder_2': [
        { _id: 'item_2_1', title: 'Idea for New Project', createdAt: new Date().toISOString() },
    ],
    'folder_3': [],
};
// --- End Dummy Data ---


function VaultPage() {
    // --- Redux State ---
    const dispatch = useDispatch();
    // Renaming local variables for clarity (remove 'selects'/'select' prefix as it's implied by useSelector)
    const vaultLoading = useSelector(selectVaultLoading);
    const vaultError = useSelector(selectVaultError);
    const vaultSuccess = useSelector(selectVaultSucess); // Make sure 'Sucess' is correct from slice

    // --- Local UI State ---
    // `vaultState` manages the main view (register, login, logged_in)
    const [vaultState, setVaultState] = useState('unknown'); // 'unknown', 'needs_register', 'needs_login', 'logged_in'

    // Local states for messages displayed OUTSIDE modals, derived from Redux state or simulated actions
    const [pageFeedback, setPageFeedback] = useState(null); // { type: 'success' | 'error' | 'loading', message: '...' }

    // Local states for messages/loading specifically WITHIN modals
    const [modalFeedback, setModalFeedback] = useState(null); // { type: 'success' | 'error' | 'loading', message: '...' }
    const [registerValidationError, setRegisterValidationError] = useState('');
    const [loginValidationError, setLoginValidationError] = useState('');
    const [addFolderValidationError, setAddFolderValidationError] = useState('');
    const [addItemValidationError, setAddItemValidationError] = useState('');

    // Modal visibility states
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isViewItemModalOpen, setIsViewItemModalOpen] = useState(false);

    // Form data states
    const [password, setPassword] = useState(''); // Used in register and login forms
    const [confirmPassword, setConfirmPassword] = useState(''); // Used in register form
    const [folderName, setFolderName] = useState(''); // Used in add folder form
    const [itemData, setItemData] = useState({ title: '', content: '', vaultPassword: '' }); // Used in add item form
    const [viewPassword, setViewPassword] = useState(''); // Used in view item form
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility in forms

    // Data states for logged-in view (simulated)
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [items, setItems] = useState([]); // Items for the selected folder
    const [allItems, setAllItems] = useState({}); // Contains items for all folders (simulated)
    const [itemToView, setItemToView] = useState(null); // Item data when view modal is open
    const [decryptedContent, setDecryptedContent] = useState(''); // Decrypted content for view modal (simulated)


    // --- Effects ---

    // Effect to handle initial vault status check (still simulated for now)
    useEffect(() => {
        // Simulate checking if a vault is registered
        setPageFeedback({ type: 'loading', message: 'Checking vault status...' });
        // In a real app, this would dispatch a thunk: dispatch(checkVaultStatusThunk()).unwrap()
        // Then useSelectors/another effect would determine vaultState based on that result.
        const checkStatus = async () => {
             await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
             // Based on simulation, assume needs register. In a real app,
             // status from backend determines this: isRegistered, isLocked.
             setVaultState('needs_register'); // Go to needs_register state after check
             setPageFeedback(null); // Clear loading after check
        };
        checkStatus();

        // Cleanup function - Important if checkStatus could take a while and component unmounts
        return () => {
            // No cleanup needed for simple timeout here, but good practice for cancellable promises or websockets.
        };
    }, []); // Run only on mount


     // Effect to react to Redux loading, error, success states (from registerVaultThunk)
    useEffect(() => {
        // This effect fires whenever Redux vault state changes.
        // We want to react specifically when a Redux action finishes.

        // Case 1: Loading finishes
        if (!vaultLoading) {
             // Check if there was a pending operation before loading became false
            // We need to know *what* operation just finished. Redux state should ideally track this.
            // Since it doesn't, we'll infer based on which state/modal is open or use messages.

             // Example: Handle register thunk completion
             if (isRegisterModalOpen) {
                 setModalFeedback(null); // Clear loading feedback in modal
                 if (vaultError) {
                      setModalFeedback({ type: 'error', message: vaultError.message || 'Registration failed.' });
                      // No state change on error, user retries or cancels from modal
                 } else if (vaultSuccess) {
                     // Assuming vaultSuccess payload indicates success. Let's transition state & show global message.
                     setVaultState('needs_login'); // Vault registered, now needs login
                     setPageFeedback({ type: 'success', message: vaultSuccess.message || "Vault registered successfully! Please log in." });
                     closeRegisterModal(); // Close modal on success
                 }
             }
             // Add similar checks here if other operations (login, etc.) used Redux thunks
        }

        // Note: pageFeedback and modalFeedback manage showing Redux results in UI.
        // Redux states (vaultLoading, vaultError, vaultSuccess) are the *source* of truth for the running Redux thunk.

    }, [vaultLoading, vaultError, vaultSuccess, isRegisterModalOpen /* Add other modal states if their results also trigger state transitions/messages from Redux */]);


    // Effect to clear page-level success/error messages after a delay
    useEffect(() => {
        let timer;
        if (pageFeedback && (pageFeedback.type === 'success' || pageFeedback.type === 'error')) {
            timer = setTimeout(() => {
                setPageFeedback(null);
            }, 4000); // Clear after 4 seconds
        }
        return () => clearTimeout(timer);
    }, [pageFeedback]); // Re-run if pageFeedback changes


    // Effect to update items display when folder selection or allItems changes
    useEffect(() => {
        if (selectedFolderId && vaultState === 'logged_in') {
             setItems(allItems[selectedFolderId] || []);
        } else {
            setItems([]);
        }
    }, [selectedFolderId, vaultState, allItems]);


    // --- Helper Functions ---

    const resetFormsAndLocalMessages = useCallback(() => {
        setPassword('');
        setConfirmPassword('');
        setFolderName('');
        setItemData({ title: '', content: '', vaultPassword: '' });
        setViewPassword('');
        setShowPassword(false);

        // Clear all local feedback states for modals/pages
        setPageFeedback(null);
        setModalFeedback(null);
        setRegisterValidationError('');
        setLoginValidationError('');
        setAddFolderValidationError('');
        setAddItemValidationError('');
        // viewModalErrorMessage is covered by setModalFeedback or managed directly in view handler
    }, []); // No external dependencies, memoize


    // --- Modal Open/Close Handlers ---
    // These should reset relevant states and clear general feedback

    const openRegisterModal = () => {
         resetFormsAndLocalMessages(); // Clear form data and all feedback
         setIsRegisterModalOpen(true);
         // No loading/error state needed here immediately, Redux state will manage feedback after dispatch
    };
    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
         resetFormsAndLocalMessages(); // Clear state related to this modal on close
         // If closing while loading/error from Redux register action, should Redux state be reset? Slice reducers might handle this.
    };

    const openLoginModal = () => {
        resetFormsAndLocalMessages(); // Clear form data and all feedback
        setIsLoginModalOpen(true);
         // Login simulation feedback handled by modalFeedback state
    };
    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
        resetFormsAndLocalMessages(); // Clear state related to this modal on close
    };

    const openAddFolderModal = () => {
        resetFormsAndLocalMessages(); // Clear form data and all feedback
        setIsAddFolderModalOpen(true);
        // Add folder simulation feedback handled by modalFeedback state
    };
    const closeAddFolderModal = () => {
        setIsAddFolderModalOpen(false);
         resetFormsAndLocalMessages(); // Clear state related to this modal on close
    };

    const openAddItemModal = (folderId) => {
        if (!folderId) {
            setPageFeedback({ type: 'error', message: 'Please select a folder first.' }); // Show page level error for this
            return;
        }
        resetFormsAndLocalMessages(); // Clear form data and all feedback
        setSelectedFolderId(folderId);
        setIsAddItemModalOpen(true);
        // Add item simulation feedback handled by modalFeedback state
    };
    const closeAddItemModal = () => {
        setIsAddItemModalOpen(false);
        resetFormsAndLocalMessages(); // Clear state related to this modal on close
    };

    const openViewItemModal = (item) => {
        if (!item) return; // Should not happen if UI works
        resetFormsAndLocalMessages(); // Clear forms, password, etc. and feedback
        setItemToView({ _id: item._id, title: item.title });
        // Note: viewPassword and decryptedContent are managed directly by view submit handler
        setIsViewItemModalOpen(true);
        // View item simulation feedback handled by modalFeedback state (or viewModalErrorMessage below)
    };

     // Specific state for view modal error for clarity
    const [viewModalErrorMessage, setViewModalErrorMessage] = useState('');
    const [viewModalLoadingMessage, setViewModalLoadingMessage] = useState(''); // Could use modalFeedback too, but keeping for direct control

    const closeViewItemModal = () => {
        setIsViewItemModalOpen(false);
        setItemToView(null);
        setDecryptedContent('');
        setViewPassword(''); // Clear password field on close
        setShowPassword(false); // Reset password visibility
        setViewModalErrorMessage(''); // Clear its specific error
        setViewModalLoadingMessage(''); // Clear its specific loading
         // resetFormsAndLocalMessages() called inside open/close other modals handles password etc. for those.
    };


    // --- Form Submit Handlers ---

    // Handler for Register Form (Uses Redux Thunk)
    const handleRegisterSubmit = (e) => { // No longer async unless using unwrap() which is handled in effect
        e.preventDefault();
        setRegisterValidationError(''); // Clear previous validation errors

        if (password.length < 6) {
            setRegisterValidationError("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setRegisterValidationError("Passwords do not match.");
            return;
        }

        // Validation passed, dispatch Redux thunk
        setModalFeedback({ type: 'loading', message: 'Registering vault...' }); // Show loading in modal
        // Redux state vaultLoading becomes true after this dispatch

        dispatch(registerVaultThunk({ password: password }));

        // Redux effect will handle state transition, success message, error message, and modal closing based on thunk outcome.
    };

    // Handler for Login Form (Still Simulated)
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginValidationError(''); // Clear previous validation errors

        if (!password) {
            setLoginValidationError("Vault password is required.");
            return;
        }

        setModalFeedback({ type: 'loading', message: 'Unlocking vault...' }); // Show loading in modal
        // Simulate API call - replace with loginVaultThunk when ready
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async work
        setModalFeedback(null); // Clear loading

        if (password === CORRECT_DUMMY_PASSWORD) {
            // Simulation success
            setPageFeedback({ type: 'success', message: "Successfully logged in to vault." }); // Page level feedback
            setVaultState('logged_in');
            // Load dummy data
            setFolders(DUMMY_FOLDERS_INITIAL);
            setAllItems(DUMMY_ITEMS_INITIAL);
            setSelectedFolderId(null); // Reset selection
            closeLoginModal(); // Close modal
        } else {
            // Simulation failure
            setModalFeedback({ type: 'error', message: "Invalid vault password." }); // Modal level feedback
            // Optionally clear password field: setPassword('');
        }
    };

    // Handler for Add Folder Form (Still Simulated)
    const handleAddFolderSubmit = async (e) => {
        e.preventDefault();
        setAddFolderValidationError('');
        const trimmedName = folderName.trim();
        if (!trimmedName) {
             setAddFolderValidationError("Folder name cannot be empty.");
             return;
        }
         if (folders.some(f => f.name.toLowerCase() === trimmedName.toLowerCase())) {
             setAddFolderValidationError(`Folder "${trimmedName}" already exists.`);
             return;
         }

        setModalFeedback({ type: 'loading', message: 'Creating folder...' }); // Show loading in modal
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async call
        setModalFeedback(null); // Clear loading

        // Simulation success
        const newFolder = { _id: `folder_${Date.now()}`, name: trimmedName };
        setFolders(prev => [...prev, newFolder]);
        setAllItems(prev => ({ ...prev, [newFolder._id]: [] })); // Add an empty item list for the new folder
        setPageFeedback({ type: 'success', message: `Folder "${trimmedName}" created successfully.` }); // Page level feedback
        closeAddFolderModal(); // Close modal
    };

    // Handler for Add Item Form (Still Simulated)
    const handleAddItemSubmit = async (e) => {
        e.preventDefault();
        setAddItemValidationError('');
        const trimmedTitle = itemData.title.trim();
        const trimmedContent = itemData.content.trim();
        const trimmedPassword = itemData.vaultPassword.trim();

        if (!trimmedTitle || !trimmedContent || !trimmedPassword) {
            setAddItemValidationError("Title, content, and vault password are required.");
            return;
        }

        if (!selectedFolderId) {
             // Should not happen if UI is used correctly, but good safeguard
             setPageFeedback({ type: 'error', message: "Error: No folder selected for adding item." });
             closeAddItemModal();
             return;
        }


        setModalFeedback({ type: 'loading', message: 'Adding item...' }); // Show loading in modal
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async call
        setModalFeedback(null); // Clear loading


        // Simulation specific logic (checking vault password)
        if (trimmedPassword !== CORRECT_DUMMY_PASSWORD) {
            setModalFeedback({ type: 'error', message: "Incorrect vault password." });
            setItemData(prev => ({ ...prev, vaultPassword: '' })); // Clear password field on error
            return;
        }

        // Simulation success
        const newItem = { _id: `item_${Date.now()}`, title: trimmedTitle, createdAt: new Date().toISOString() };
        setAllItems(prev => {
            const currentFolderItems = prev[selectedFolderId] || [];
            return { ...prev, [selectedFolderId]: [...currentFolderItems, newItem] };
        });

        setPageFeedback({ type: 'success', message: `Item "${newItem.title}" added successfully.` }); // Page level feedback
        closeAddItemModal(); // Close modal
    };

    // Handler for View Item Submit (Still Simulated - Decryption)
    const handleViewItemSubmit = async (e) => {
        e.preventDefault();
        // This modal uses dedicated local states for message management, not `modalFeedback`
        setViewModalErrorMessage(''); // Clear previous error
        setDecryptedContent(''); // Clear previous decrypted content

        if (!viewPassword) {
             setViewModalErrorMessage("Vault password is required to view the item.");
             return;
         }
        if (!itemToView) {
            setViewModalErrorMessage("Error: No item selected for viewing."); // Should not happen
            return;
        }

        setViewModalLoadingMessage('Decrypting item...'); // Show loading message
        // Simulate async decryption
        await new Promise(resolve => setTimeout(resolve, 600));
        setViewModalLoadingMessage(''); // Clear loading

        // Simulation specific logic (checking vault password)
        if (viewPassword === CORRECT_DUMMY_PASSWORD) {
            // Simulation success
             setDecryptedContent(`--- Simulated Decrypted Content ---\n\nItem Title: ${itemToView.title}\n\nThis is where the actual secret content (like a password, note, etc.) would appear after being decrypted using your Vault Password.\n\nTimestamp: ${new Date().toLocaleString()}\n\n--- End Simulated Content ---`);
             // Password field can stay visible or be cleared, user preference. Clearing is safer.
            // setViewPassword(''); // Optionally clear password field on success view
             // viewModalErrorMessage is cleared
        } else {
            // Simulation failure
             setViewModalErrorMessage("Incorrect vault password.");
             setViewPassword(''); // Always clear password on decryption failure
             setDecryptedContent(''); // Ensure content is clear
         }
     };

    // Handler for Logout (Still Simulated)
     const handleLogout = async () => {
        // This should eventually be a logoutThunk
        setPageFeedback({ type: 'loading', message: 'Logging out...' }); // Page level feedback
        // Simulate logout delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setPageFeedback(null); // Clear loading

        // Reset all relevant state on successful logout simulation
        setVaultState('needs_login');
        setFolders([]);
        setItems([]);
        setAllItems({});
        setSelectedFolderId(null);
        resetFormsAndLocalMessages(); // Clear forms, local messages, passwords etc.

        setPageFeedback({ type: 'success', message: "Vault locked successfully." }); // Page level feedback
    };


    // --- Render Logic ---

    const renderContent = () => {
        // Priority: Global loading state overrides everything except modals handling their own loading
         if (pageFeedback?.type === 'loading') {
             return <div className="text-center text-gray-500 py-10">{pageFeedback.message}</div>;
        }

        switch (vaultState) {
            case 'unknown': // Initial state while checking status
                 return <div className="text-center text-gray-500 py-10">Determining vault status...</div>;

            case 'needs_register':
                return (
                    <div className="text-center p-6 bg-white shadow rounded-lg max-w-md mx-auto">
                        <ExclamationTriangleIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vault Registration Required</h2>
                        <p className="text-gray-600 mb-4">Create a secure vault to store sensitive data.</p>
                        {/* Global page feedback already displayed outside renderContent */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={openRegisterModal} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={vaultLoading /* Disable if register thunk is running */ }>
                                <KeyIcon className="-ml-1 mr-2 h-5 w-5" /> Register Vault
                            </button>
                             {/* Assume registration page always offers login button if vault exists */}
                             <button onClick={() => setVaultState('needs_login')} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                         {/* Global page feedback already displayed outside renderContent */}
                         <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={openLoginModal} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={modalFeedback?.type === 'loading' /* Disable login button if login simulation is running */ }>
                                <KeyIcon className="-ml-1 mr-2 h-5 w-5" /> Login to Vault
                            </button>
                             <button onClick={() => setVaultState('needs_register')} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Need to Register?
                            </button>
                        </div>
                    </div>
                );

            case 'logged_in':
                const isLoggedInActionLoading = modalFeedback?.type === 'loading'; // General flag for sim-based actions while logged in
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Folders</h2>
                                <div>
                                     <button onClick={openAddFolderModal} title="Add New Folder" className="p-1 mr-2 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoggedInActionLoading /* Disable during other async actions */}>
                                        <FolderPlusIcon className="h-6 w-6" />
                                    </button>
                                     <button onClick={handleLogout} title="Lock Vault" className="p-1 rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoggedInActionLoading /* Disable during other async actions */ || pageFeedback?.type === 'loading' /* Disable during logout */}>
                                        <LockClosedIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg min-h-[200px]">
                                <ul role="list" className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
                                    {folders.length > 0 ? folders.map((folder) => (
                                        <li key={folder._id} onClick={() => !isLoggedInActionLoading && setSelectedFolderId(folder._id)} className={`group px-4 py-3 sm:px-6 cursor-pointer transition duration-150 ease-in-out relative ${selectedFolderId === folder._id ? 'bg-indigo-50' : 'hover:bg-gray-50'} ${isLoggedInActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                                    <button onClick={() => openAddItemModal(selectedFolderId)} title="Add New Item" className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFolderId || isLoggedInActionLoading}>
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
                                                        {/* Pass correct item object here */}
                                                        <div className="flex items-center space-x-3 truncate flex-1 mr-2" onClick={() => !isLoggedInActionLoading && openViewItemModal(item)}>
                                                            <DocumentIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                                        </div>
                                                         <div className="flex-shrink-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                              {/* Pass correct item object here */}
                                                              <button
                                                                  onClick={(e) => { e.stopPropagation(); !isLoggedInActionLoading && openViewItemModal(item); }}
                                                                  title="View Item"
                                                                  className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                                  disabled={isLoggedInActionLoading} // Disable during other async actions
                                                              >
                                                                  {/* Use a different icon for view vs edit */}
                                                                  <EyeIcon className="h-4 w-4"/>
                                                              </button>
                                                              {/* Example Delete Button (still simulated) */}
                                                              {/* <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteItem(selectedFolderId, item._id); }}
                                                                    title="Delete Item"
                                                                    className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    disabled={isLoggedInActionLoading}
                                                                >
                                                                    <TrashIcon className="h-4 w-4"/>
                                                                </button> */}
                                                         </div>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-500 pl-8">Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p> {/* Ensure item.createdAt exists */}
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
                return <div className="text-center text-red-500 py-10">Error: Invalid vault state ({vaultState}).</div>;
        }
    };


    // Determine button disabled state based on which operation is loading
    // vaultLoading is for the Redux register thunk
    // modalFeedback?.type === 'loading' is for the other simulated modal operations
    // pageFeedback?.type === 'loading' is for the initial check or logout

    const isGlobalLoading = pageFeedback?.type === 'loading';
    const isAnyModalOpen = isRegisterModalOpen || isLoginModalOpen || isAddFolderModalOpen || isAddItemModalOpen || isViewItemModalOpen;
    const isModalLoading = modalFeedback?.type === 'loading';

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Secure Vault </h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your encrypted folders and items.</p>
                </header>

                {/* Display global page-level feedback */}
                {pageFeedback && (pageFeedback.type === 'success' || pageFeedback.type === 'error') && !isAnyModalOpen && (
                     <div className={`p-4 mb-4 rounded-md ${pageFeedback.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'} font-medium transition-opacity duration-300`}>
                         {pageFeedback.type === 'error' && 'Error: '}
                         {pageFeedback.message}
                     </div>
                )}
                {/* Global loading is handled in renderContent or could be here if preferred */}
                {/* {pageFeedback?.type === 'loading' && !isAnyModalOpen && (
                    <div className='p-4 mb-4 rounded-md bg-blue-100 text-blue-700 border border-blue-300 font-medium'>
                        {pageFeedback.message}
                    </div>
                 )} */}


                {renderContent()}

                {/* --- Modals --- */}

                {/* Register Modal (uses Redux state for load/error) */}
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
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeRegisterModal} disabled={vaultLoading}><span className="sr-only">Close</span> <XMarkIcon className="h-6 w-6"/> </button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {/* Display modal-specific feedback derived from Redux states or validation */}
                                        {registerValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{registerValidationError}</p>}
                                         {vaultError && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {vaultError.message || String(vaultError)}</p>}
                                         {modalFeedback?.type === 'loading' && <p className="text-blue-600 text-sm mb-3 text-center">{modalFeedback.message}</p>}

                                        <div className="space-y-4">
                                            <div> <label htmlFor="regPassword">Vault Password <span className="text-red-500">*</span></label> <div className="mt-1 relative rounded-md shadow-sm"> <input type={showPassword?'text':'password'} id="regPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" aria-describedby="password-constraints" disabled={vaultLoading} /><div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={vaultLoading} ><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div> </div> <p className="mt-1 text-xs text-gray-500" id="password-constraints">Minimum 6 characters.</p> </div>
                                            <div> <label htmlFor="regConfirmPassword">Confirm Password <span className="text-red-500">*</span></label> <input type={showPassword?'text':'password'} id="regConfirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" disabled={vaultLoading}/> </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={vaultLoading}>{vaultLoading ? 'Registering...' : 'Register Vault'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeRegisterModal} disabled={vaultLoading}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Modal (Still simulated, uses modalFeedback) */}
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
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeLoginModal} disabled={modalFeedback?.type === 'loading'} ><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                     </div>
                                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                         {/* Display modal-specific feedback */}
                                        {loginValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{loginValidationError}</p>}
                                        {modalFeedback?.type === 'error' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {modalFeedback.message}</p>}
                                        {modalFeedback?.type === 'loading' && <p className="text-blue-600 text-sm mb-3 text-center">{modalFeedback.message}</p>}

                                        <div><label htmlFor="loginPassword">Vault Password <span className="text-red-500">*</span></label><div className="mt-1 relative rounded-md shadow-sm"><input type={showPassword?'text':'password'} id="loginPassword" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" disabled={modalFeedback?.type === 'loading'} /><div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={modalFeedback?.type === 'loading'}><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div></div></div>
                                     </div>
                                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={modalFeedback?.type === 'loading'}>{modalFeedback?.type === 'loading' ? 'Unlocking...' : 'Unlock Vault'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeLoginModal} disabled={modalFeedback?.type === 'loading'}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Folder Modal (Still simulated, uses modalFeedback) */}
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
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeAddFolderModal} disabled={modalFeedback?.type === 'loading'}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {/* Display modal-specific feedback */}
                                         {addFolderValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{addFolderValidationError}</p>}
                                         {modalFeedback?.type === 'error' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {modalFeedback.message}</p>}
                                         {modalFeedback?.type === 'loading' && <p className="text-blue-600 text-sm mb-3 text-center">{modalFeedback.message}</p>}

                                        <div><label htmlFor="folderName">Folder Name <span className="text-red-500">*</span></label><input type="text" id="folderName" name="folderName" value={folderName} onChange={(e) => setFolderName(e.target.value)} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" disabled={modalFeedback?.type === 'loading'}/></div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={modalFeedback?.type === 'loading'}>{modalFeedback?.type === 'loading' ? 'Creating...' : 'Create Folder'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeAddFolderModal} disabled={modalFeedback?.type === 'loading'}>Cancel</button>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Item Modal (Still simulated, uses modalFeedback) */}
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
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeAddItemModal} disabled={modalFeedback?.type === 'loading'}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {/* Display modal-specific feedback */}
                                         {addItemValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{addItemValidationError}</p>}
                                         {modalFeedback?.type === 'error' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {modalFeedback.message}</p>}
                                         {modalFeedback?.type === 'loading' && <p className="text-blue-600 text-sm mb-3 text-center">{modalFeedback.message}</p>}

                                        <div className="space-y-4">
                                            <div><label htmlFor="itemTitle">Title <span className="text-red-500">*</span></label><input type="text" id="itemTitle" name="title" value={itemData.title} onChange={(e) => setItemData({...itemData, title: e.target.value})} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" disabled={modalFeedback?.type === 'loading'}/></div>
                                            <div><label htmlFor="itemContent">Content (will be encrypted) <span className="text-red-500">*</span></label><textarea id="itemContent" name="content" rows={4} value={itemData.content} onChange={(e) => setItemData({...itemData, content: e.target.value})} required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md" disabled={modalFeedback?.type === 'loading'}></textarea></div>
                                            <div><label htmlFor="itemVaultPassword">Vault Password (for encryption) <span className="text-red-500">*</span></label><div className="mt-1 relative rounded-md shadow-sm"><input type={showPassword?'text':'password'} id="itemVaultPassword" name="vaultPassword" value={itemData.vaultPassword} onChange={(e) => setItemData({...itemData, vaultPassword: e.target.value})} required placeholder="Enter vault password again" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" aria-describedby="password-enc-hint" disabled={modalFeedback?.type === 'loading'}/><div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={modalFeedback?.type === 'loading'}><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div></div><p className="mt-1 text-xs text-gray-500" id="password-enc-hint">Required to encrypt this item securely.</p></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={modalFeedback?.type === 'loading'}>{modalFeedback?.type === 'loading' ? 'Adding...' : 'Add Item'}</button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeAddItemModal} disabled={modalFeedback?.type === 'loading'}>Cancel</button>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Item Modal (Still simulated decryption, uses viewModalErrorMessage/LoadingMessage) */}
                {isViewItemModalOpen && itemToView && (
                    <div className="fixed z-30 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                {/* Note: This form uses its own message states, not modalFeedback */}
                                <form onSubmit={handleViewItemSubmit}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 relative">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"><EyeIcon className="h-6 w-6 text-indigo-600"/></div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"><h3 className="text-lg leading-6 font-medium text-gray-900">View Item Details</h3><p className="mt-1 text-sm font-medium text-indigo-700 truncate">{itemToView?.title || 'Loading...'}</p></div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500" onClick={closeViewItemModal} disabled={viewModalLoadingMessage !== ''}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {/* View modal specific messages */}
                                        {viewModalErrorMessage && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {viewModalErrorMessage}</p>}
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
                                                    <input type={showPassword ? 'text' : 'password'} id="viewPassword" name="viewPassword" value={viewPassword} onChange={(e) => setViewPassword(e.target.value)} required className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" autoFocus disabled={viewModalLoadingMessage !== ''} />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center"><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={viewModalLoadingMessage !== ''}><span className="sr-only">{showPassword?'Hide':'Show'} password</span>{showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}</button></div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">Required to decrypt and view the item's content.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        {!decryptedContent && (
                                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={viewModalLoadingMessage !== ''}>{viewModalLoadingMessage ? 'Decrypting...' : 'Decrypt & View'}</button>
                                        )}
                                        <button type="button" className={`mt-3 w-full inline-flex justify-center rounded-md border ${decryptedContent ? 'border-indigo-600' : 'border-gray-300'} shadow-sm px-4 py-2 ${decryptedContent ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-50'} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50`} onClick={closeViewItemModal} disabled={viewModalLoadingMessage !== ''}>{decryptedContent ? 'Close' : 'Cancel'}</button>
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