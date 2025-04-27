// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//     ShieldCheckIcon, Bars3Icon, XMarkIcon, EyeIcon, SparklesIcon, BellAlertIcon,
//     ArrowRightOnRectangleIcon, UserCircleIcon, SunIcon, MoonIcon,
//     LockClosedIcon, Cog6ToothIcon
// } from '@heroicons/react/24/outline';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutUser as logoutUserAction, getUserInfo } from '../redux/slice/authSlice';
// import { unwrapResult } from '@reduxjs/toolkit';

// function Navbar() {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { accessToken } = useSelector((state) => state.auth);
//     const isLoggedIn = !!accessToken;
//     const [showMoonIcon, setShowMoonIcon] = useState(true);

//     useEffect(() => {
//         if (isLoggedIn) {
//             dispatch(getUserInfo());
//         }
//     }, [dispatch, isLoggedIn]);

//     const toggleThemeIcon = () => {
//         setShowMoonIcon(!showMoonIcon);
//     };

//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     const handleNavigate = (path) => {
//         navigate(path);
//         setIsMenuOpen(false);
//     };

//     const handleLogout = async () => {
//         try {
//             const resultAction = await dispatch(logoutUserAction());
//             unwrapResult(resultAction);
//             console.log('Logout successful, navigating...');
//             navigate('/');
//         } catch (error) {
//             console.error('Logout failed:', error);
//             console.log('Forcing local logout despite API error...');
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('refreshToken');
//             localStorage.removeItem('user');
//             navigate('/');
//         }
//     };

//     return (
//         <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-16">
//                     <div className="flex-shrink-0">
//                         <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2">
//                             <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
//                             <span className="font-bold text-xl">PrivGuard</span>
//                         </Link>
//                     </div>
//                     <div className="hidden md:flex items-center space-x-1">
//                         {isLoggedIn ? (
//                             <>
//                                 <NavLinkItem to="/dashboard" icon={EyeIcon} label="Dashboard" />
//                                 <NavLinkItem to="/generator" icon={SparklesIcon} label="Generator" />
//                                 <NavLinkItem to="/breach-monitor" icon={BellAlertIcon} label="Breach Monitor" />
//                                 <NavLinkItem to="/vault" icon={LockClosedIcon} label="Vault" />
//                                 <NavLinkItem to="/profile" icon={UserCircleIcon} label="Profile" />
//                                 <NavLinkItem to="/settings" icon={Cog6ToothIcon} label="Settings" />
//                                 <div className="flex items-center space-x-3 ml-4">
//                                     <button onClick={toggleThemeIcon} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition duration-150 ease-in-out" aria-label="Toggle theme icon (visual only)">
//                                         {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
//                                     </button>
//                                     <button onClick={handleLogout} className="flex items-center text-sm rounded-md px-3 py-2 bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white transition duration-150 ease-in-out">
//                                         <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" /> Logout
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <>
//                                 <button onClick={toggleThemeIcon} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition duration-150 ease-in-out" aria-label="Toggle theme icon (visual only)">
//                                     {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
//                                 </button>
//                                 <button onClick={() => handleNavigate('/login')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ml-3">Login</button>
//                                 <button onClick={() => handleNavigate('/register')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">Register</button>
//                             </>
//                         )}
//                     </div>
//                     <div className="md:hidden flex items-center space-x-2">
//                         <button onClick={toggleThemeIcon} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out" aria-label="Toggle theme icon (visual only)">
//                             {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
//                         </button>
//                         <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMenuOpen}>
//                             <span className="sr-only">Open main menu</span>
//                             {isMenuOpen ? (<XMarkIcon className="block h-6 w-6" aria-hidden="true" />) : (<Bars3Icon className="block h-6 w-6" aria-hidden="true" />)}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`} id="mobile-menu">
//                 {isLoggedIn ? (
//                     <>
//                         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                             <MobileNavLinkItem to="/dashboard" icon={EyeIcon} label="Dashboard" onClick={toggleMenu} />
//                             <MobileNavLinkItem to="/generator" icon={SparklesIcon} label="Generator" onClick={toggleMenu} />
//                             <MobileNavLinkItem to="/breach-monitor" icon={BellAlertIcon} label="Breach Monitor" onClick={toggleMenu} />
//                             <MobileNavLinkItem to="/vault" icon={LockClosedIcon} label="Vault" onClick={toggleMenu} />
//                             <MobileNavLinkItem to="/profile" icon={UserCircleIcon} label="Profile" onClick={toggleMenu} />
//                             <MobileNavLinkItem to="/settings" icon={Cog6ToothIcon} label="Settings" onClick={toggleMenu} />
//                         </div>
//                         <div className="pt-4 pb-3 border-t border-gray-700">
//                             <div className="flex items-center px-5">
//                                 <button onClick={handleLogout} className="w-full text-left flex items-center text-base font-medium rounded-md p-2 bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white">
//                                     <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" /> Logout
//                                 </button>
//                             </div>
//                         </div>
//                     </>
//                 ) : (
//                     <>
//                         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"></div>
//                         <div className="pt-4 pb-3 border-t border-gray-700">
//                             <div className="flex flex-col items-stretch px-5 space-y-3">
//                                 <button onClick={() => handleNavigate('/login')} className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out">Login</button>
//                                 <button onClick={() => handleNavigate('/register')} className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out">Register</button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </nav>
//     );
// }

// const NavLinkItem = ({ to, icon: Icon, label }) => (
//     <Link to={to} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
//         <Icon className="h-5 w-5 mr-1" aria-hidden="true" />{label}
//     </Link>
// );

// const MobileNavLinkItem = ({ to, icon: Icon, label, onClick }) => (
//     <Link to={to} onClick={onClick} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out">
//         <Icon className="h-5 w-5 mr-2" aria-hidden="true" />{label}
//     </Link>
// );

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShieldCheckIcon, Bars3Icon, XMarkIcon, EyeIcon, SparklesIcon, BellAlertIcon,
    ArrowRightOnRectangleIcon, UserCircleIcon, SunIcon, MoonIcon,
    LockClosedIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
// Sahi action import karein (logoutUser async thunk)
import { logoutUser as logoutUserAction, getUserInfo } from '../redux/slice/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // isLoading state bhi le sakte hain agar logout ke time button disable karna hai
    const { accessToken, isLoading } = useSelector((state) => state.auth);
    const isLoggedIn = !!accessToken;
    const [showMoonIcon, setShowMoonIcon] = useState(true); // Visual only state

    useEffect(() => {
        // Agar logged in hai aur user data nahi hai, toh fetch karein
        // Note: Yeh logic optimize ho sakta hai taki har render par call na ho
        if (isLoggedIn) {
            dispatch(getUserInfo());
        }
    }, [dispatch, isLoggedIn]); // Dependencies theek hain

    const toggleThemeIcon = () => {
        setShowMoonIcon(!showMoonIcon);
        // Add actual theme toggling logic here (e.g., update body class, save preference)
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Mobile menu band karein
    };

    const handleLogout = async () => {
        console.log('Logout button clicked. Dispatching logoutUserAction...');
        try {
            // Sirf logout action dispatch karein
            const resultAction = await dispatch(logoutUserAction());
            // unwrapResult check karega ki thunk reject toh nahi hua (hamare case mein nahi hona chahiye)
            unwrapResult(resultAction);
            console.log('Logout thunk finished. Navigating to home...');
            // Navigate karein *jab* thunk successfully complete ho gaya ho (state clear ho chuka hai)
            navigate('/');
        } catch (error) {
            // Yeh catch block tabhi hit hoga agar unwrapResult ne error throw kiya,
            // ya dispatch mein hi koi issue aaya.
            console.error('Logout failed unexpectedly after dispatch:', error);
             // Fallback navigation, agar kuch gadbad ho. State clearing abhi bhi reducer mein honi chahiye thi.
            navigate('/');
        } finally {
            // Menu ko band karein agar khula tha
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2">
                            <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                            <span className="font-bold text-xl">PrivGuard</span>
                        </Link>
                    </div>

                    {/* Desktop Menu & Actions */}
                    <div className="hidden md:flex items-center space-x-1">
                        {isLoggedIn ? (
                            <>
                                {/* Logged In Links */}
                                <NavLinkItem to="/dashboard" icon={EyeIcon} label="Dashboard" />
                                <NavLinkItem to="/generator" icon={SparklesIcon} label="Generator" />
                                <NavLinkItem to="/breach-monitor" icon={BellAlertIcon} label="Breach Monitor" />
                                <NavLinkItem to="/vault" icon={LockClosedIcon} label="Vault" />
                                <NavLinkItem to="/profile" icon={UserCircleIcon} label="Profile" />
                                <NavLinkItem to="/settings" icon={Cog6ToothIcon} label="Settings" />
                                {/* Actions */}
                                <div className="flex items-center space-x-3 ml-4">
                                    <button onClick={toggleThemeIcon} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition duration-150 ease-in-out" aria-label="Toggle theme icon (visual only)">
                                        {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
                                    </button>
                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading} // Logout ke time disable karein (optional)
                                        className={`flex items-center text-sm rounded-md px-3 py-2 bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                                        {isLoading ? 'Logging out...' : 'Logout'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Logged Out Actions */}
                                <button onClick={toggleThemeIcon} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition duration-150 ease-in-out" aria-label="Toggle theme icon (visual only)">
                                    {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
                                </button>
                                <button onClick={() => handleNavigate('/login')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ml-3">Login</button>
                                <button onClick={() => handleNavigate('/register')} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">Register</button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button & Theme Toggle */}
                    <div className="md:hidden flex items-center space-x-2">
                         <button onClick={toggleThemeIcon} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150 ease-in-out" aria-label="Toggle theme icon (visual only)">
                            {showMoonIcon ? (<MoonIcon className="h-6 w-6" />) : (<SunIcon className="h-6 w-6" />)}
                        </button>
                        <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMenuOpen}>
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (<XMarkIcon className="block h-6 w-6" aria-hidden="true" />) : (<Bars3Icon className="block h-6 w-6" aria-hidden="true" />)}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`} id="mobile-menu">
                {isLoggedIn ? (
                    <>
                        {/* Mobile Links */}
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <MobileNavLinkItem to="/dashboard" icon={EyeIcon} label="Dashboard" onClick={toggleMenu} />
                            <MobileNavLinkItem to="/generator" icon={SparklesIcon} label="Generator" onClick={toggleMenu} />
                            <MobileNavLinkItem to="/breach-monitor" icon={BellAlertIcon} label="Breach Monitor" onClick={toggleMenu} />
                            <MobileNavLinkItem to="/vault" icon={LockClosedIcon} label="Vault" onClick={toggleMenu} />
                            <MobileNavLinkItem to="/profile" icon={UserCircleIcon} label="Profile" onClick={toggleMenu} />
                            <MobileNavLinkItem to="/settings" icon={Cog6ToothIcon} label="Settings" onClick={toggleMenu} />
                        </div>
                        {/* Mobile Logout */}
                        <div className="pt-4 pb-3 border-t border-gray-700">
                            <div className="flex items-center px-5">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoading} // Disable karein
                                    className={`w-full text-left flex items-center text-base font-medium rounded-md p-2 bg-gray-800 text-gray-300 hover:bg-red-700 hover:text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                     {isLoading ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mobile Logged Out Actions */}
                         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"></div> {/* Placeholder for potential future links */}
                         <div className="pt-4 pb-3 border-t border-gray-700">
                            <div className="flex flex-col items-stretch px-5 space-y-3">
                                <button onClick={() => handleNavigate('/login')} className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out">Login</button>
                                <button onClick={() => handleNavigate('/register')} className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out">Register</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

// Helper Components (inhi ko use karein)
const NavLinkItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
        <Icon className="h-5 w-5 mr-1" aria-hidden="true" />{label}
    </Link>
);

const MobileNavLinkItem = ({ to, icon: Icon, label, onClick }) => (
    <Link to={to} onClick={onClick} className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out">
        <Icon className="h-5 w-5 mr-2" aria-hidden="true" />{label}
    </Link>
);

export default Navbar;