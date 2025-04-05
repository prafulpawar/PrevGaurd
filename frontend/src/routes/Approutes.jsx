// src/routes/Approutes.jsx (या जहाँ भी आपकी फाइल है)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- पेज कंपोनेंट्स इम्पोर्ट करें ---

// प्रमाणीकरण और पब्लिक पेज
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';

// फीचर पेज
import SharedDataDashboard from '../pages/SharedDataDashboard'; // Adjust path if needed
import FakeDataGenerator from '../pages/FakeDataGenerator';   // Adjust path if needed
import BreachMonitor from '../pages/BreachMonitor';         // Adjust path if needed
// Vault - वर्तमान में WebAuthn डेमो का उपयोग कर रहे हैं
// import Vault from '../pages/Vault'; // पुराना पासवर्ड वाला वॉल्ट (अगर रखना चाहें)
import WebAuthnVaultDemo from '../pages/WebAuthnVaultDemo';   // Adjust path if needed

// नए यूजर पेज
import Profile from '../pages/Profile';                     // <-- Profile इम्पोर्ट करें (पथ एडजस्ट करें)
import Settings from '../pages/Settings';                   // <-- Settings इम्पोर्ट करें (पथ एडजस्ट करें)

// वैकल्पिक: प्रोटेक्टेड रूट
// import ProtectedRoute from '../components/auth/ProtectedRoute';

// वैकल्पिक: 404 पेज
// import NotFound from '../pages/NotFound';


function Approutes() {
  return (
    <Router>
      {/* आप चाहें तो एक लेआउट कंपोनेंट बना सकते हैं जिसमें Navbar हो */}
      {/* <Layout> */}
      <Routes>
        {/* पब्लिक रूट्स */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* अन्य पब्लिक रूट (जैसे /privacy-policy) यहाँ जोड़ें */}

        {/* फीचर रूट्स (अभी प्रोटेक्टेड नहीं हैं) */}
        {/* अगर ProtectedRoute लागू करते हैं, तो इन्हें नीचे वाले सेक्शन में ले जाएं */}
        <Route path='/dashboard' element={<SharedDataDashboard />} />
        <Route path='/generator' element={<FakeDataGenerator />} />
        <Route path='/breach-monitor' element={<BreachMonitor />} />
        <Route path='/vault' element={<WebAuthnVaultDemo />} /> {/* Vault डेमो का उपयोग */}
        <Route path='/profile' element={<Profile />} />         {/* <-- Profile रूट जोड़ा गया */}
        <Route path='/settings' element={<Settings />} />       {/* <-- Settings रूट जोड़ा गया */}


        {/* प्रोटेक्टेड रूट्स का उदाहरण (जब प्रमाणीकरण लागू हो) */}
        {/*
        <Route element={<ProtectedRoute />}>
           // ऊपर वाले फीचर रूट्स को यहाँ ले आएं
           // <Route path='/dashboard' element={<SharedDataDashboard />} />
           // <Route path='/generator' element={<FakeDataGenerator />} />
           // <Route path='/breach-monitor' element={<BreachMonitor />} />
           // <Route path='/vault' element={<WebAuthnVaultDemo />} /> // या वास्तविक Vault
           // <Route path='/profile' element={<Profile />} />
           // <Route path='/settings' element={<Settings />} />
        </Route>
        */}

        {/* कैच-ऑल / 404 रूट (वैकल्पिक) */}
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="*" element={ // सिंपल 404 प्लेसहोल्डर
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