// src/components/Navbar.jsx

import React, { useState } from 'react'; // Removed useContext, useEffect
import { Link, useNavigate } from 'react-router-dom';
import {
    ShieldCheckIcon, Bars3Icon, XMarkIcon, EyeIcon, SparklesIcon, BellAlertIcon, ArrowRightOnRectangleIcon, UserCircleIcon, SunIcon, MoonIcon
} from '@heroicons/react/24/outline';

// No AuthContext needed anymore

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // **** LOCAL STATE FOR LOGIN SIMULATION ****
    // Simulates login state ONLY within this Navbar component.
    // Will reset if the component unmounts or page reloads.
    // Set initial state to true for logged-in view, false for logged-out view.
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    // **** END LOCAL STATE ****

    // --- Dark Mode ICON State ONLY ---
    const [showMoonIcon, setShowMoonIcon] = useState(true); // Start with Moon icon

    const toggleThemeIcon = () => {
        setShowMoonIcon(!showMoonIcon);
        console.log("Theme toggle icon clicked (visual only).");
    };
    // --- End Dark Mode ICON Logic ---


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Close menu on navigation
    };

    // --- Updated Logout Handler ---
    const handleLogout = () => {
        console.log("Simulating logout (local state change)...");
        setIsLoggedIn(false); // <-- Update the local state
        setIsMenuOpen(false);
        navigate('/'); // Redirect to home after logout simulation
    };
    // --- End Updated Logout Handler ---

    // --- Simulate Login (Optional - for demo purposes) ---
    // You might call this from a login button elsewhere if needed for demo
    const handleLogin = () => {
         console.log("Simulating login (local state change)...");
         setIsLoggedIn(true);
         // navigate('/dashboard'); // Optionally navigate after login
    }
    // --- End Simulate Login ---


    return (
        // Removed dark: classes as theme change is disabled
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0">
                         {/* Link changes based on local isLoggedIn state */}
                        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2">
                            <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                            <span className="font-bold text-xl">PrivGuard</span>
                        </Link>
                    </div>

                    {/* Desktop Menu Items - Uses local isLoggedIn state */}
                    <div className="hidden md:flex items-center space-x-1">
                        {isLoggedIn ? ( // Check local state
                            <>
                                <NavLinkItem to="/dashboard" icon={EyeIcon} label="Dashboard" />
                                <NavLinkItem to="/generator" icon={SparklesIcon} label="Generator" />
                                <NavLinkItem to="/breach-monitor" icon={BellAlertIcon} label="Breach Monitor" />

                                {/* Profile/Logout/Theme Button Group */}
                                <div className="flex items-center space-x-3 ml-4">
                                     {/* Dark Mode VISUAL Toggle Button - Desktop */}
                                     <button
                                        onClick={toggleThemeIcon}
                                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition duration-150 ease-in-out"
                                        aria-label="Toggle theme icon (visual only)"
                                     >
                                         {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
                                     </button>

                                     {/* Logout Button - Calls local handler */}
                                     <button
                                         onClick={handleLogout} // Uses updated handler
                                         className="flex items-center text-sm rounded-md px-3 py-2 bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white transition duration-150 ease-in-out"
                                     >
                                         <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                                        Logout
                                     </button>
                                </div>
                            </>
                        ) : ( // Check local state
                            <>
                                {/* Dark Mode VISUAL Toggle Button - Logged Out Desktop */}
                                <button
                                    onClick={toggleThemeIcon}
                                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition duration-150 ease-in-out"
                                    aria-label="Toggle theme icon (visual only)"
                                >
                                    {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
                                </button>
                                {/* Login/Register Buttons */}
                                <button
                                    onClick={() => handleNavigate('/login')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ml-3"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavigate('/register')}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button & VISUAL Theme Toggle */}
                    <div className="md:hidden flex items-center space-x-2">
                         {/* Dark Mode VISUAL Toggle Button - Mobile */}
                         <button
                            onClick={toggleThemeIcon}
                            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out"
                            aria-label="Toggle theme icon (visual only)"
                         >
                              {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
                         </button>
                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (<XMarkIcon className="block h-6 w-6" aria-hidden="true" />) : (<Bars3Icon className="block h-6 w-6" aria-hidden="true" />)}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Uses local isLoggedIn state */}
            <div
                className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`}
                id="mobile-menu"
            >
                 {isLoggedIn ? ( // Check local state
                    <>
                     <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLinkItem to="/dashboard" icon={EyeIcon} label="Dashboard" onClick={toggleMenu}/>
                        <MobileNavLinkItem to="/generator" icon={SparklesIcon} label="Generator" onClick={toggleMenu}/>
                        <MobileNavLinkItem to="/breach-monitor" icon={BellAlertIcon} label="Breach Monitor" onClick={toggleMenu}/>
                      </div>
                      {/* Mobile Logout */}
                      <div className="pt-4 pb-3 border-t border-gray-700">
                          <div className="flex items-center px-5">
                             <button
                                 onClick={handleLogout} // Uses updated handler
                                 className="w-full text-left flex items-center text-base font-medium rounded-md p-2 bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white"
                             >
                                 <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                Logout
                            </button>
                          </div>
                      </div>
                    </>
                  ) : ( // Check local state
                     <>
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                           {/* Public mobile links */}
                         </div>
                        {/* Mobile Login/Register Buttons */}
                         <div className="pt-4 pb-3 border-t border-gray-700">
                           <div className="flex flex-col items-stretch px-5 space-y-3">
                               <button
                                  onClick={() => handleNavigate('/login')}
                                  className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                               >
                                 Login
                               </button>
                               <button
                                  onClick={() => handleNavigate('/register')}
                                  className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                                >
                                Register
                               </button>
                            </div>
                        </div>
                     </>
                  )}
            </div>
        </nav>
    );
}

// Helper component for Desktop Nav Links (No change needed)
const NavLinkItem = ({ to, icon: Icon, label }) => (
     <Link
        to={to}
        className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
    >
        <Icon className="h-5 w-5 mr-1" aria-hidden="true" />
        {label}
    </Link>
);

// Helper component for Mobile Nav Links (No change needed)
const MobileNavLinkItem = ({ to, icon: Icon, label, onClick }) => (
     <Link
        to={to}
        onClick={onClick}
        className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
    >
         <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
        {label}
     </Link>
);


export default Navbar;




