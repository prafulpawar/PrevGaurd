
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './Navbar'; 
import {
    FolderPlusIcon, DocumentPlusIcon, LockClosedIcon, KeyIcon,
    EyeIcon, EyeSlashIcon, XMarkIcon, FolderIcon, DocumentIcon,
    ExclamationTriangleIcon, InformationCircleIcon, TrashIcon, PencilIcon 
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
    registerVaultThunk,
    loginVaultThunk,
    fetchVaultDataThunk,
    addFolderThunk,
    addItemThunk,
    decryptItemThunk,
    checkVaultStatusThunk,
    resetVaultState,
    clearDecryption,
    setVaultUiState,
    setCurrentItem,
    selectVaultState,
    selectVaultStatus,
    selectVaultError,
    selectCurrentOperation,
    selectFolders,
    selectItemsForFolder,
    selectCurrentItem,
    selectDecryptedContent,
    selectVaultId 
} from '../redux/slice/vaultSlice'; 

function VaultPage() {
    const dispatch = useDispatch();

    
    const vaultState = useSelector(selectVaultState);
    const vaultStatus = useSelector(selectVaultStatus);
    const vaultError = useSelector(selectVaultError);
    const currentOperation = useSelector(selectCurrentOperation);
    const folders = useSelector(selectFolders);
    const currentItem = useSelector(selectCurrentItem);
    const decryptedContent = useSelector(selectDecryptedContent);
    const vaultId = useSelector(selectVaultId);


    const [pageFeedback, setPageFeedback] = useState(null); 
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
    const [registerValidationError, setRegisterValidationError] = useState('');
    const [loginValidationError, setLoginValidationError] = useState('');
    const [addFolderValidationError, setAddFolderValidationError] = useState('');
    const [addItemValidationError, setAddItemValidationError] = useState('');
    const [viewItemValidationError, setViewItemValidationError] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    
    const items = useSelector(selectItemsForFolder(selectedFolderId));

    const prevVaultStatusRef = useRef(vaultStatus);
    const prevCurrentOperationRef = useRef(currentOperation);

    useEffect(() => {
      
        if (vaultState === 'unknown') {
            dispatch(checkVaultStatusThunk());
        }
    }, [dispatch, vaultState]); 


  
    useEffect(() => {
       
        const statusChanged = prevVaultStatusRef.current !== vaultStatus;
       
        const justCompleted = statusChanged && (vaultStatus === 'succeeded' || vaultStatus === 'failed');

        if (justCompleted) {
            
            if (vaultStatus === 'succeeded') {
              
                switch (currentOperation) {
                    case 'register':
                        setPageFeedback({ type: 'success', message: "Vault registered successfully! Please log in." });
                        closeRegisterModal();
                        break;
                    case 'login':
                        setPageFeedback({ type: 'loading', message: "Login successful. Fetching vault data..." });
                        dispatch(fetchVaultDataThunk()); 
                        closeLoginModal();
                        break;
                    case 'fetchData':
                        setPageFeedback({ type: 'success', message: "Vault unlocked and data loaded." });

                        if (folders && folders.length > 0 && !selectedFolderId) {
                            setSelectedFolderId(folders[0]._id);
                        }
                        break;
                    case 'addFolder':
                        { 
                            const latestFolder = folders[folders.length - 1];
                            setPageFeedback({ type: 'success', message: `Folder "${latestFolder?.name || 'New Folder'}" created.` });
                            closeAddFolderModal();
                          
                            if (latestFolder?._id) {
                                setSelectedFolderId(latestFolder._id);
                            }
                        }
                        break;
                    case 'addItem':
                        { 
                            const latestItem = items[items.length - 1];
                            setPageFeedback({ type: 'success', message: `Item "${latestItem?.title || 'New Item'}" added.` });
                            closeAddItemModal();
                        }
                        break;
                    case 'decryptItem':
                        
                        setPageFeedback(null); 
                        setViewPassword('');
                        break;
                    case 'checkStatus':
                       
                        setPageFeedback(null); 
                        break;
                    default:
                      
                        setPageFeedback(null);
                }
            } else if (vaultStatus === 'failed') {
               
                switch (currentOperation) {
                    case 'register': 
                    case 'login':   
                    case 'addFolder':
                    case 'addItem':  
                        break;
                    case 'decryptItem':
                       
                        setViewItemValidationError(vaultError || 'Decryption failed.');
                        setViewPassword(''); 
                        break;
                    case 'fetchData':
                    case 'checkStatus':
                    default:
                        
                        setPageFeedback({ type: 'error', message: vaultError || 'An unexpected error occurred.' });
                       
                }
            }
        }

      
        prevVaultStatusRef.current = vaultStatus;
        prevCurrentOperationRef.current = currentOperation;

        let timer;
        if (pageFeedback && (pageFeedback.type === 'success' || pageFeedback.type === 'error')) {
            timer = setTimeout(() => {
              
                setPageFeedback(currentFeedback => (currentFeedback === pageFeedback ? null : currentFeedback));
            }, 4000);
        }
       
        return () => {
            clearTimeout(timer);
        };
       
    }, [vaultStatus, currentOperation, vaultError, dispatch, folders, items, pageFeedback, selectedFolderId]); 


   
    const resetLocalFormsAndValidation = useCallback(() => {
        setPassword('');
        setConfirmPassword('');
        setFolderName('');
        setItemData({ title: '', content: '', vaultPassword: '' });
        setViewPassword('');
        setShowPassword(false);
        setRegisterValidationError('');
        setLoginValidationError('');
        setAddFolderValidationError('');
        setAddItemValidationError('');
        setViewItemValidationError('');
    }, []); 
    const openRegisterModal = useCallback(() => {
        resetLocalFormsAndValidation();
        setIsRegisterModalOpen(true);
    }, [resetLocalFormsAndValidation]);

    const closeRegisterModal = useCallback(() => {
        setIsRegisterModalOpen(false);
        resetLocalFormsAndValidation();
    }, [resetLocalFormsAndValidation]);

    const openLoginModal = useCallback(() => {
        resetLocalFormsAndValidation();
        setIsLoginModalOpen(true);
    }, [resetLocalFormsAndValidation]);

    const closeLoginModal = useCallback(() => {
        setIsLoginModalOpen(false);
        resetLocalFormsAndValidation();
    }, [resetLocalFormsAndValidation]);

    const openAddFolderModal = useCallback(() => {
        resetLocalFormsAndValidation();
        setIsAddFolderModalOpen(true);
    }, [resetLocalFormsAndValidation]);

    const closeAddFolderModal = useCallback(() => {
        setIsAddFolderModalOpen(false);
        resetLocalFormsAndValidation();
    }, [resetLocalFormsAndValidation]);

    const openAddItemModal = useCallback((folderId) => {
        if (!folderId) {
            setPageFeedback({ type: 'error', message: 'Please select a folder first.' });
            return;
        }
        resetLocalFormsAndValidation();
        setSelectedFolderId(folderId); 
        setIsAddItemModalOpen(true);
    }, [resetLocalFormsAndValidation]);

    const closeAddItemModal = useCallback(() => {
        setIsAddItemModalOpen(false);
        resetLocalFormsAndValidation();
    }, [resetLocalFormsAndValidation]);

    const openViewItemModal = useCallback((item) => {
        if (!item) return;
        resetLocalFormsAndValidation();
        dispatch(setCurrentItem(item)); 
        setIsViewItemModalOpen(true);
    }, [dispatch, resetLocalFormsAndValidation]);

    const closeViewItemModal = useCallback(() => {
        setIsViewItemModalOpen(false);
        dispatch(clearDecryption()); 
        resetLocalFormsAndValidation();
    }, [dispatch, resetLocalFormsAndValidation]);


    
    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setRegisterValidationError(''); // Clear local validation
        if (password.length < 6) {
            setRegisterValidationError("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setRegisterValidationError("Passwords do not match.");
            return;
        }
        
        dispatch(registerVaultThunk({ password }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setLoginValidationError('');
        if (!password) {
            setLoginValidationError("Vault password is required.");
            return;
        }
        dispatch(loginVaultThunk({ password }));
    };

    const handleAddFolderSubmit = (e) => {
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
        dispatch(addFolderThunk({ folderName: trimmedName }));
    };

    const handleAddItemSubmit = (e) => {
        e.preventDefault();
        setAddItemValidationError('');
        const trimmedTitle = itemData.title.trim();
        const content = itemData.content; 
        const vaultPass = itemData.vaultPassword; 

        if (!trimmedTitle || !content || !vaultPass) { 
            setAddItemValidationError("Title, content, and vault password are required.");
            return;
        }
        if (!selectedFolderId) {
             setAddItemValidationError("Error: No folder selected.");
             return;
        }
        
        dispatch(addItemThunk({
            folderId: selectedFolderId,
            itemData: { title: trimmedTitle, content: content, vaultPassword: vaultPass }
        }));
    };

    const handleViewItemSubmit = (e) => {
        e.preventDefault();
        setViewItemValidationError('');
        if (!viewPassword) {
             setViewItemValidationError("Vault password is required to view the item.");
             return;
         }
      
        if (!currentItem?._id) {
            setViewItemValidationError("Error: No item selected for viewing.");
            return;
        }
        dispatch(decryptItemThunk({ itemId: currentItem._id, vaultPassword: viewPassword }));
    };

     const handleLogout = () => {
        dispatch(resetVaultState()); 
        resetLocalFormsAndValidation(); 
        setSelectedFolderId(null);
        setPageFeedback({ type: 'success', message: "Vault locked successfully." }); 
    };


    const isOverallLoading = vaultStatus === 'loading';
    const isRegisterLoading = isOverallLoading && currentOperation === 'register';
    const isLoginLoading = isOverallLoading && (currentOperation === 'login' || currentOperation === 'fetchData'); 
    const isAddFolderLoading = isOverallLoading && currentOperation === 'addFolder';
    const isAddItemLoading = isOverallLoading && currentOperation === 'addItem';
    const isDecryptLoading = isOverallLoading && currentOperation === 'decryptItem';
    const isCheckLoading = isOverallLoading && currentOperation === 'checkStatus';
   
    const anyDataActionLoading = isAddFolderLoading || isAddItemLoading || isDecryptLoading;

    const renderContent = () => {

        if (vaultState === 'unknown' || isCheckLoading) {
             return <div className="text-center text-gray-500 py-10">Checking vault status...</div>;
        }

      
        if (vaultStatus === 'failed' &&
            !isRegisterModalOpen && !isLoginModalOpen && !isAddFolderModalOpen && !isAddItemModalOpen && !isViewItemModalOpen &&
            (currentOperation === 'checkStatus' || currentOperation === 'fetchData')) {
            return (
                <div className="text-center p-6 bg-red-100 text-red-700 shadow rounded-lg max-w-md mx-auto">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Error Accessing Vault</h2>
                    <p className="mb-4">{vaultError || 'Could not determine vault status or load data.'}</p>
                    <button onClick={() => dispatch(checkVaultStatusThunk())} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 mr-2">Retry Check</button>
                    <button onClick={() => dispatch(setVaultUiState('needs_login'))} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">Go to Login</button>
                </div>
            );
        }

        
        switch (vaultState) {
            case 'needs_register':
                return (
                    <div className="text-center p-6 bg-white shadow rounded-lg max-w-md mx-auto">
                        <ExclamationTriangleIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vault Registration Required</h2>
                        <p className="text-gray-600 mb-4">Create a secure vault to store sensitive data.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={openRegisterModal} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={isRegisterLoading}>
                                <KeyIcon className="-ml-1 mr-2 h-5 w-5" /> {isRegisterLoading ? 'Registering...' : 'Register Vault'}
                            </button>
                            <button onClick={() => dispatch(setVaultUiState('needs_login'))} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isRegisterLoading}>
                                Already Registered? Log In
                            </button>
                        </div>
                    </div>
                );

            case 'needs_login':
            case 'locked': 
                 return (
                     <div className="text-center p-6 bg-white shadow rounded-lg max-w-md mx-auto">
                        <LockClosedIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vault Locked</h2>
                        <p className="text-gray-600 mb-4">Log in to access your secure vault.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button onClick={openLoginModal} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={isLoginLoading}>
                                <KeyIcon className="-ml-1 mr-2 h-5 w-5" /> {isLoginLoading ? 'Unlocking...' : 'Login to Vault'}
                            </button>
                             <button onClick={() => dispatch(setVaultUiState('needs_register'))} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isLoginLoading}>
                                Need to Register?
                            </button>
                        </div>
                    </div>
                );

            case 'logged_in':
                
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Folder List Column */}
                        <div className="md:col-span-1">
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Folders</h2>
                                <div>
                                     <button onClick={openAddFolderModal} title="Add New Folder" className="p-1 mr-2 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50" disabled={anyDataActionLoading}>
                                        <FolderPlusIcon className="h-6 w-6" />
                                    </button>
                                     <button onClick={handleLogout} title="Lock Vault" className="p-1 rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 disabled:opacity-50" disabled={anyDataActionLoading}>
                                        <LockClosedIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg min-h-[200px]"> {/* Ensure minimum height */}
                                <ul role="list" className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto"> {/* Max height and scroll */}
                                    {folders.length > 0 ? folders.map((folder) => (
                                        <li key={folder._id} onClick={() => !anyDataActionLoading && setSelectedFolderId(folder._id)} className={`group px-4 py-3 sm:px-6 cursor-pointer transition duration-150 ease-in-out relative ${selectedFolderId === folder._id ? 'bg-indigo-50' : 'hover:bg-gray-50'} ${anyDataActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

                        {/* Item List Column */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 truncate pr-2">
                                    {/* Display selected folder name or prompt */}
                                    {selectedFolderId ? `Items in "${folders.find(f => f._id === selectedFolderId)?.name || '...'}"` : 'Select a Folder'}
                                </h2>
                                {/* Show Add Item button only if a folder is selected */}
                                {selectedFolderId && (
                                    <button onClick={() => openAddItemModal(selectedFolderId)} title="Add New Item" className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 flex-shrink-0 disabled:opacity-50" disabled={!selectedFolderId || anyDataActionLoading}>
                                        <DocumentPlusIcon className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                             <div className="bg-white shadow overflow-hidden sm:rounded-lg min-h-[200px]"> {/* Ensure minimum height */}
                                {selectedFolderId ? (
                                    items.length > 0 ? (
                                        <ul role="list" className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto"> {/* Max height and scroll */}
                                            {items.map((item) => (
                                                <li key={item._id} className="group px-4 py-3 sm:px-6 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out relative">
                                                    <div className="flex items-center justify-between">
                                                        {/* Main item info - clickable */}
                                                        <div className="flex items-center space-x-3 truncate flex-1 mr-2" onClick={() => !anyDataActionLoading && openViewItemModal(item)}>
                                                            <DocumentIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                            <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                                        </div>
                                                        {/* Action buttons - appear on hover */}
                                                         <div className="flex-shrink-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                              <button
                                                                  onClick={(e) => { e.stopPropagation(); !anyDataActionLoading && openViewItemModal(item); }} // Prevent li click, open modal
                                                                  title="View Item"
                                                                  className="p-1 text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full disabled:opacity-50"
                                                                  disabled={anyDataActionLoading}
                                                              >
                                                                  <EyeIcon className="h-4 w-4"/>
                                                              </button>
                                                             
                                                         </div>
                                                    </div>
                                                
                                                    <p className="mt-1 text-xs text-gray-500 pl-8">Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                       
                                        <div className="flex items-center justify-center h-full py-10 px-4 text-center">
                                            <p className="text-gray-500">No items in this folder yet. Click the <DocumentPlusIcon className="h-4 w-4 inline-block mx-1 text-indigo-600 align-text-bottom"/> icon to add one.</p>
                                        </div>
                                     )
                                ) : (
                                    
                                    <div className="flex items-center justify-center h-full py-10 px-4 text-center">
                                        <InformationCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
                                        <p className="text-gray-500">Select a folder on the left to view or add items.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                
                return <div className="text-center text-red-500 py-10">Error: Invalid vault state ({vaultState}). Please try refreshing.</div>;
        }
    };

    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                <header className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Secure Vault</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your encrypted folders and items.</p>
                </header>

                
                {pageFeedback && (pageFeedback.type === 'success' || pageFeedback.type === 'error') && (
                     <div className={`p-4 mb-4 rounded-md border ${pageFeedback.type === 'success' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'} font-medium transition-opacity duration-300`}>
                         {pageFeedback.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5 inline-block mr-2 align-text-bottom" />}
                         {pageFeedback.message}
                     </div>
                )}
                
                 {isOverallLoading && !isRegisterLoading && !isLoginLoading && !isAddFolderLoading && !isAddItemLoading && !isDecryptLoading && (
                    <div className='p-4 mb-4 rounded-md bg-blue-100 text-blue-700 border border-blue-300 font-medium text-center animate-pulse'>
                        Loading: {currentOperation}...
                    </div>
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
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"> <h3 className="text-lg leading-6 font-medium text-gray-900">Register New Vault</h3> <p className="text-sm text-gray-500 mt-1">Choose a strong master password. This cannot be recovered.</p> </div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeRegisterModal} disabled={isRegisterLoading}><span className="sr-only">Close</span> <XMarkIcon className="h-6 w-6"/> </button>
                                    </div>
                                   
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        
                                        {registerValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{registerValidationError}</p>}
                                      
                                        {vaultStatus === 'failed' && currentOperation === 'register' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {vaultError}</p>}
                                        
                                        {isRegisterLoading && <p className="text-blue-600 text-sm mb-3 text-center animate-pulse">Registering...</p>}

                                        <div className="space-y-4">
                                           
                                            <div>
                                                <label htmlFor="regPassword">Vault Password <span className="text-red-500">*</span></label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="regPassword"
                                                        name="password" 
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        minLength="6"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10" // Added padding right for icon
                                                        aria-describedby="password-constraints"
                                                        disabled={isRegisterLoading}
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={isRegisterLoading} >
                                                            <span className="sr-only">{showPassword ? 'Hide' : 'Show'} password</span>
                                                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500" id="password-constraints">Minimum 6 characters.</p>
                                            </div>
                                          
                                            <div>
                                                <label htmlFor="regConfirmPassword">Confirm Password <span className="text-red-500">*</span></label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="regConfirmPassword"
                                                    name="confirmPassword" 
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    disabled={isRegisterLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isRegisterLoading}>
                                            {isRegisterLoading ? 'Registering...' : 'Register Vault'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeRegisterModal} disabled={isRegisterLoading}>
                                            Cancel
                                        </button>
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
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeLoginModal} disabled={isLoginLoading} ><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                     </div>
                                     
                                     <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        {loginValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{loginValidationError}</p>}
                                        {vaultStatus === 'failed' && currentOperation === 'login' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {vaultError}</p>}
                                        {isLoginLoading && <p className="text-blue-600 text-sm mb-3 text-center animate-pulse">{(currentOperation === 'login' ? 'Verifying...' : 'Fetching Data...')}</p>}
                                        
                                        <div>
                                            <label htmlFor="loginPassword">Vault Password <span className="text-red-500">*</span></label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="loginPassword"
                                                    name="password" 
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                                                    disabled={isLoginLoading}
                                                    autoFocus 
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={isLoginLoading}>
                                                        <span className="sr-only">{showPassword ? 'Hide' : 'Show'} password</span>
                                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                     </div>
                                  
                                     <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isLoginLoading}>
                                            {isLoginLoading ? 'Unlocking...' : 'Unlock Vault'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeLoginModal} disabled={isLoginLoading}>
                                            Cancel
                                        </button>
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
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeAddFolderModal} disabled={isAddFolderLoading}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                   
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                         {addFolderValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{addFolderValidationError}</p>}
                                         {vaultStatus === 'failed' && currentOperation === 'addFolder' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {vaultError}</p>}
                                         {isAddFolderLoading && <p className="text-blue-600 text-sm mb-3 text-center animate-pulse">Creating Folder...</p>}
                                         
                                        <div>
                                            <label htmlFor="folderName">Folder Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                id="folderName"
                                                name="folderName" 
                                                value={folderName}
                                                onChange={(e) => setFolderName(e.target.value)}
                                                required
                                                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                disabled={isAddFolderLoading}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                  
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isAddFolderLoading}>
                                            {isAddFolderLoading ? 'Creating...' : 'Create Folder'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeAddFolderModal} disabled={isAddFolderLoading}>
                                            Cancel
                                        </button>
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
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Item</h3>
                                                <p className="mt-1 text-sm text-gray-500">To folder: <span className="font-medium">{folders.find(f => f._id === selectedFolderId)?.name || '...'}</span></p>
                                            </div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeAddItemModal} disabled={isAddItemLoading}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                   
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                         {addItemValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{addItemValidationError}</p>}
                                         {vaultStatus === 'failed' && currentOperation === 'addItem' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {vaultError}</p>}
                                         {isAddItemLoading && <p className="text-blue-600 text-sm mb-3 text-center animate-pulse">Adding Item...</p>}
                                        <div className="space-y-4">
                                          
                                            <div>
                                                <label htmlFor="itemTitle">Title <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    id="itemTitle"
                                                    name="title" // Added name
                                                    value={itemData.title}
                                                    onChange={(e) => setItemData({...itemData, title: e.target.value})}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    disabled={isAddItemLoading}
                                                    autoFocus
                                                />
                                            </div>
                                           
                                            <div>
                                                <label htmlFor="itemContent">Content (will be encrypted) <span className="text-red-500">*</span></label>
                                                <textarea
                                                    id="itemContent"
                                                    name="content" // Added name
                                                    rows={4}
                                                    value={itemData.content}
                                                    onChange={(e) => setItemData({...itemData, content: e.target.value})}
                                                    required
                                                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                    disabled={isAddItemLoading}
                                                ></textarea>
                                            </div>
                                           
                                            <div>
                                                <label htmlFor="itemVaultPassword">Vault Password (for encryption) <span className="text-red-500">*</span></label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <input
                                                        type={showPassword?'text':'password'}
                                                        id="itemVaultPassword"
                                                        name="vaultPassword" // Added name
                                                        value={itemData.vaultPassword}
                                                        onChange={(e) => setItemData({...itemData, vaultPassword: e.target.value})}
                                                        required
                                                        placeholder="Enter vault password again"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                                                        aria-describedby="password-enc-hint"
                                                        disabled={isAddItemLoading}
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button type="button" onClick={()=>setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={isAddItemLoading}>
                                                            <span className="sr-only">{showPassword?'Hide':'Show'} password</span>
                                                            {showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500" id="password-enc-hint">Required to encrypt this item securely.</p>
                                            </div>
                                        </div>
                                    </div>
                                   
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isAddItemLoading}>
                                            {isAddItemLoading ? 'Adding...' : 'Add Item'}
                                        </button>
                                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" onClick={closeAddItemModal} disabled={isAddItemLoading}>
                                            Cancel
                                        </button>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                )}



                {isViewItemModalOpen && currentItem && (
                    <div className="fixed z-30 inset-0 overflow-y-auto"> 
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75"></div></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleViewItemSubmit}>
                                   
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 relative">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"><EyeIcon className="h-6 w-6 text-indigo-600"/></div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">View Item Details</h3>
                                                <p className="mt-1 text-sm font-medium text-indigo-700 truncate">{currentItem?.title || 'Loading...'}</p>
                                            </div>
                                        </div>
                                        <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none" onClick={closeViewItemModal} disabled={isDecryptLoading}><span className="sr-only">Close</span><XMarkIcon className="h-6 w-6"/></button>
                                    </div>
                                   
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                       
                                        {viewItemValidationError && <p className="text-orange-600 text-sm mb-3 text-center bg-orange-50 p-2 rounded">{viewItemValidationError}</p>}
                                       
                                        {vaultStatus === 'failed' && currentOperation === 'decryptItem' && <p className="text-red-600 text-sm mb-3 text-center bg-red-50 p-2 rounded">Error: {vaultError}</p>}
                                       
                                        {isDecryptLoading && <p className="text-blue-600 text-sm mb-3 text-center animate-pulse">Decrypting...</p>}

                                       
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
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="viewPassword"
                                                        name="viewPassword"
                                                        value={viewPassword}
                                                        onChange={(e) => setViewPassword(e.target.value)}
                                                        required
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                                                        autoFocus
                                                        disabled={isDecryptLoading}
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-full p-1" disabled={isDecryptLoading}>
                                                            <span className="sr-only">{showPassword?'Hide':'Show'} password</span>
                                                            {showPassword?<EyeSlashIcon className="h-5 w-5"/>:<EyeIcon className="h-5 w-5"/>}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">Required to decrypt and view the item's content.</p>
                                            </div>
                                        )}
                                    </div>
                                  
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                       
                                        {!decryptedContent && (
                                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50" disabled={isDecryptLoading || !viewPassword /* Disable if no password entered */}>
                                                {isDecryptLoading ? 'Decrypting...' : 'Decrypt & View'}
                                            </button>
                                        )}
                                       
                                        <button
                                            type="button"
                                            

                                            className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 ${decryptedContent ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                                            onClick={closeViewItemModal}
                                            disabled={isDecryptLoading}
                                        >
                                            {decryptedContent ? 'Close' : 'Cancel'}
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