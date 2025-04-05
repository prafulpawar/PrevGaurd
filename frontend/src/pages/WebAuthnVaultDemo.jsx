import React, { useState, useEffect } from 'react';
import Navbar from '../pages/Navbar';
import { UserPlusIcon, ArrowRightOnRectangleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function bufferEncode(value) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(value)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

function bufferDecode(value) {
    value = value.replace(/-/g, "+").replace(/_/g, "/");
    var base64 = atob(value);
    var buffer = new Uint8Array(base64.length);
    for (var i = 0; i < base64.length; i++) {
        buffer[i] = base64.charCodeAt(i);
    }
    return buffer;
}

function WebAuthnVaultDemo() {
    const [username, setUsername] = useState('demoUser');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Register or Login using WebAuthn.');
    const [credentialInfo, setCredentialInfo] = useState(null);

    const handleRegister = async () => {
        setStatusMessage('Starting registration...');
        try {
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const rp = {
                name: "PrivGuard Demo",
                id: window.location.hostname,
            };

            const user = {
                id: bufferDecode(btoa(username + Date.now())),
                name: username,
                displayName: username,
            };

            const pubKeyCredParams = [
                { type: "public-key", alg: -7 },
                { type: "public-key", alg: -257 }
            ];

            const authenticatorSelection = {
                authenticatorAttachment: "platform",
                requireResidentKey: false,
                userVerification: "preferred",
            };

            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge,
                    rp,
                    user,
                    pubKeyCredParams,
                    authenticatorSelection,
                    timeout: 60000,
                    attestation: "none",
                }
            });

            console.log("Registration successful:", credential);
            setStatusMessage(`Registered successfully! Credential ID: ${bufferEncode(credential.rawId)}`);
            setIsRegistered(true);
            setIsAuthenticated(false);
            setCredentialInfo({
                 id: credential.rawId,
                 type: credential.type
            });

        } catch (err) {
            console.error("Registration failed:", err);
            setStatusMessage(`Registration failed: ${err.message}`);
            setIsRegistered(false);
            setIsAuthenticated(false);
            setCredentialInfo(null);
        }
    };

    const handleLogin = async () => {
        if (!isRegistered && !credentialInfo) {
             setStatusMessage("Please register a passkey first in this session.");
             return;
        }
        setStatusMessage('Starting authentication...');
        try {
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

             const allowCredentials = credentialInfo ? [{
                id: credentialInfo.id,
                type: credentialInfo.type,
                transports: ['internal'],
            }] : undefined;

            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge,
                    timeout: 60000,
                    rpId: window.location.hostname,
                    allowCredentials,
                    userVerification: "required",
                }
            });

            console.log("Authentication successful:", credential);
            setStatusMessage(`Authentication successful!`);
            setIsAuthenticated(true);

        } catch (err) {
            console.error("Authentication failed:", err);
            setStatusMessage(`Authentication failed: ${err.message}`);
            setIsAuthenticated(false);
        }
    };

    const handleLockVault = () => {
        setIsAuthenticated(false);
        setStatusMessage("Vault locked. Authenticate to unlock.");
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">
                        WebAuthn Vault Demo
                    </h1>
                     <p className="mt-1 text-sm text-gray-600">(Client-Side Only - Insecure Simulation)</p>
                </header>

                <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 border border-red-300">
                     <p className="text-center text-red-700 font-semibold">
                        WARNING: This is an insecure client-side demo. Do not store real data. Server interaction is simulated. Data is lost on refresh.
                     </p>

                    <div className="text-center p-3 bg-gray-100 rounded">
                         Status: <span className="font-medium">{statusMessage}</span>
                     </div>

                    {!isAuthenticated ? (
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username (for demo)</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    disabled={isRegistered}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                                <button
                                    onClick={handleRegister}
                                    disabled={isRegistered}
                                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500' } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                >
                                    <UserPlusIcon className="h-5 w-5 mr-2" />
                                    Register Passkey (This Session)
                                </button>

                                <button
                                    onClick={handleLogin}
                                    disabled={!isRegistered && !credentialInfo}
                                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${(!isRegistered && !credentialInfo) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                >
                                     <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                    Login with Passkey
                                </button>
                            </div>
                             {credentialInfo && isRegistered && (
                                 <p className="text-xs text-center text-gray-500">Registered Credential ID (Demo): {bufferEncode(credentialInfo.id)}</p>
                             )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-green-700 text-center">Vault Unlocked!</h2>
                            <div className="p-4 border border-gray-200 rounded bg-gray-50">
                                <p className="font-medium">Demo Vault Content:</p>
                                <ul className="list-disc list-inside text-gray-700 mt-2">
                                     <li>Secret Plan Alpha</li>
                                     <li>Access Code: XYZ789</li>
                                </ul>
                             </div>
                            <button
                                onClick={handleLockVault}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                             >
                                 <LockClosedIcon className="h-5 w-5 mr-2" />
                                Lock Vault
                             </button>
                         </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default WebAuthnVaultDemo;