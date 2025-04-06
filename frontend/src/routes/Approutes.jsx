// src/routes/Approutes.jsx (या जहाँ भी आपकी फाइल है)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Register from '../pages/Register'; // Adjust path if needed
import Login from '../pages/Login';     // Adjust path if needed
import Home from '../pages/Home';       // Adjust path if needed
import OtpVerification from '../pages/OtpVerification'; // <-- MAKE SURE TO ADD THIS IMPORT

// फीचर पेज
import SharedDataDashboard from '../pages/SharedDataDashboard';
import FakeDataGenerator from '../pages/FakeDataGenerator';
import BreachMonitor from '../pages/BreachMonitor';
import WebAuthnVaultDemo from '../pages/WebAuthnVaultDemo';

// नए यूजर पेज
import Profile from '../pages/Profile';     // Adjust path if needed
import Settings from '../pages/Settings';   // Adjust path if needed

// वैकल्पिक: प्रोटेक्टेड रूट
// import ProtectedRoute from '../components/auth/ProtectedRoute';

// वैकल्पिक: 404 पेज
// import NotFound from '../pages/NotFound';


function Approutes() {
  return (
    <Router>
      {/* <Layout> */}
      <Routes>
        {/* पब्लिक रूट्स */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* --- ADD OTP ROUTE HERE --- */}
        <Route path='/otp-verification' element={<OtpVerification />} />

        {/* फीचर रूट्स (वर्तमान में प्रोटेक्टेड नहीं) */}
        <Route path='/dashboard' element={<SharedDataDashboard />} />
        <Route path='/generator' element={<FakeDataGenerator />} />
        <Route path='/breach-monitor' element={<BreachMonitor />} />
        <Route path='/vault' element={<WebAuthnVaultDemo />} />
        <Route path='/profile' element={<Profile />} />   {/* <-- Profile रूट सही है */}
        <Route path='/settings' element={<Settings />} /> {/* <-- Settings रूट सही है */}


        {/* प्रोटेक्टेड रूट्स का उदाहरण */}
        {/*
        <Route element={<ProtectedRoute />}>
           // <Route path='/dashboard' element={<SharedDataDashboard />} />
           // ... other protected routes ...
           // <Route path='/profile' element={<Profile />} />
           // <Route path='/settings' element={<Settings />} />
        </Route>
        */}

        {/* कैच-ऑल / 404 रूट */}
        <Route path="*" element={
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-2xl text-gray-600">404 - Page Not Found</h1>
            </div>
        } />

      </Routes>
      {/* </Layout> */}
    </Router>
  );
}

export default Approutes;