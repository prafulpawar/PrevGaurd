import React, { useState, useEffect } from 'react';
import Navbar from '../pages/Navbar'; // Adjust path
import { UserPlusIcon, ArrowRightOnRectangleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Helper function to encode ArrayBuffer to Base64URL string
// (Needed for sending data to a real server, but useful for logging here)
function bufferEncode(value) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(value)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

// Helper function to decode Base64URL string to ArrayBuffer
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
    const [username, setUsername] = useState('demoUser'); // Simple username for demo
    const [isRegistered, setIsRegistered] = useState(false); // Has a key been registered in this session?
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Is the vault "unlocked"?
    const [statusMessage, setStatusMessage] = useState('Register or Login using WebAuthn.');
    const [credentialInfo, setCredentialInfo] = useState(null); // Store registered credential ID (for demo login)

    // --- WebAuthn Registration ---
    const handleRegister = async () => {
        setStatusMessage('Starting registration...');
        try {
            // !!! SERVER MUST PROVIDE THIS IN A REAL APP !!!
            // Generate a random challenge (needs to be ArrayBuffer)
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            // Relying Party (RP) information (your website)
            const rp = {
                name: "PrivGuard Demo",
                id: window.location.hostname, // Usually your domain
            };

            // User information
            // !!! SERVER MUST PROVIDE AND MANAGE USER IDs IN A REAL APP !!!
            const user = {
                id: bufferDecode(btoa(username + Date.now())), // Create a dummy user ID buffer for demo
                name: username,
                displayName: username,
            };

            // Credential parameters (e.g., algorithms your server supports)
            const pubKeyCredParams = [
                { type: "public-key", alg: -7 }, // ES256 (common)
                { type: "public-key", alg: -257 } // RS256
            ];

            const authenticatorSelection = {
                authenticatorAttachment: "platform", // Prefer built-in authenticators (like Windows Hello, Touch ID)
                requireResidentKey: false, // Discoverable credentials not strictly required for this demo flow
                userVerification: "preferred", // Prefer user verification (PIN, biometrics)
            };

            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge,
                    rp,
                    user,
                    pubKeyCredParams,
                    authenticatorSelection,
                    timeout: 60000, // 60 seconds
                    attestation: "none", // Simplest for demo, 'direct' or 'indirect' preferred in production
                }
            });

            console.log("Registration successful:", credential);
            setStatusMessage(`Registered successfully! Credential ID: ${bufferEncode(credential.rawId)}`);
            setIsRegistered(true);
            setIsAuthenticated(false); // Need to login after registering
            setCredentialInfo({ // Store ID locally for demo login purposes ONLY
                 id: credential.rawId,
                 type: credential.type
            });

            // --- !!! REAL APP: Send credential TO SERVER for verification and storage !!! ---
            // const registrationData = {
            //     id: credential.id,
            //     rawId: bufferEncode(credential.rawId),
            //     type: credential.type,
            //     response: {
            //         attestationObject: bufferEncode(credential.response.attestationObject),
            //         clientDataJSON: bufferEncode(credential.response.clientDataJSON),
            //     },
            // };
            // fetch('/api/webauthn/register', { method: 'POST', body: JSON.stringify(registrationData), ... });

        } catch (err) {
            console.error("Registration failed:", err);
            setStatusMessage(`Registration failed: ${err.message}`);
            setIsRegistered(false);
            setIsAuthenticated(false);
            setCredentialInfo(null);
        }
    };

    // --- WebAuthn Login/Authentication ---
    const handleLogin = async () => {
        if (!isRegistered && !credentialInfo) { // Simple check for demo
             setStatusMessage("Please register a passkey first in this session.");
             return;
        }
        setStatusMessage('Starting authentication...');
        try {
            // !!! SERVER MUST PROVIDE THIS IN A REAL APP !!!
            // Generate a random challenge
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            // Optional: Specify allowed credentials (if known)
            // In a real app, the server provides the credential IDs associated with the username.
            // For this demo, we use the ID we stored locally after registration.
             const allowCredentials = credentialInfo ? [{
                id: credentialInfo.id,
                type: credentialInfo.type,
                transports: ['internal'], // Or ['usb', 'nfc', 'ble'] for security keys
            }] : undefined; // If no info stored, let browser decide (might show account chooser)

            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge,
                    timeout: 60000,
                    rpId: window.location.hostname, // Should match registration rp.id
                    allowCredentials, // Tell browser which keys are ok (optional but recommended)
                    userVerification: "required", // Require PIN/biometrics for login
                }
            });

            console.log("Authentication successful:", credential);
            setStatusMessage(`Authentication successful!`);
            setIsAuthenticated(true); // "Unlock" the vault

            // --- !!! REAL APP: Send credential TO SERVER for verification !!! ---
            // const assertionData = {
            //     id: credential.id,
            //     rawId: bufferEncode(credential.rawId),
            //     type: credential.type,
            //     response: {
            //         authenticatorData: bufferEncode(credential.response.authenticatorData),
            //         clientDataJSON: bufferEncode(credential.response.clientDataJSON),
            //         signature: bufferEncode(credential.response.signature),
            //         userHandle: credential.response.userHandle ? bufferEncode(credential.response.userHandle) : null,
            //     },
            // };
            // fetch('/api/webauthn/login', { method: 'POST', body: JSON.stringify(assertionData), ... });


        } catch (err) {
            console.error("Authentication failed:", err);
            setStatusMessage(`Authentication failed: ${err.message}`);
            setIsAuthenticated(false);
        }
    };

    // --- Simple Logout/Lock ---
    const handleLockVault = () => {
        setIsAuthenticated(false);
        setStatusMessage("Vault locked. Authenticate to unlock.");
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar /> {/* Include Navbar */}
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

                    {/* Status Display */}
                    <div className="text-center p-3 bg-gray-100 rounded">
                         Status: <span className="font-medium">{statusMessage}</span>
                     </div>

                    {!isAuthenticated ? (
                        // --- Registration/Login View ---
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username (for demo)</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    disabled={isRegistered} // Disable if already registered in session
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                                <button
                                    onClick={handleRegister}
                                    disabled={isRegistered} // Disable button if already registered
                                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500' } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                >
                                    <UserPlusIcon className="h-5 w-5 mr-2" />
                                    Register Passkey (This Session)
                                </button>

                                <button
                                    onClick={handleLogin}
                                    disabled={!isRegistered && !credentialInfo} // Disable if not registered in this session
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
                        // --- Authenticated / Unlocked View ---
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