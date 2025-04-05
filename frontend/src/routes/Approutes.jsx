import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Existing Pages
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';

// Import the new Feature Pages
import SharedDataDashboard from '../pages/SharedDataDashboard'; // Adjust path if needed
import FakeDataGenerator from '../pages/FakeDataGenerator';   // Adjust path if needed
import BreachMonitor from '../pages/BreachMonitor';         // Adjust path if needed

// Optional: Import your ProtectedRoute component if you have one
// import ProtectedRoute from '../components/auth/ProtectedRoute';

function Approutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* --- Add Routes for Feature Pages --- */}

        {/* Option 1: Add directly (if not implementing Protected Routes yet) */}
        <Route path='/dashboard' element={<SharedDataDashboard />} />
        <Route path='/generator' element={<FakeDataGenerator />} />
        <Route path='/breach-monitor' element={<BreachMonitor />} />
        {/* Add other public routes if any (e.g., /privacy-policy, /terms) */}

        {/* Option 2: Wrap in ProtectedRoute (Recommended for logged-in features) */}
        {/*
                <Route element={<ProtectedRoute />}> // Wrap routes needing auth
                   <Route path='/dashboard' element={<SharedDataDashboard />} />
                   <Route path='/generator' element={<FakeDataGenerator />} />
                   <Route path='/breach-monitor' element={<BreachMonitor />} />
                   {/* Add other protected routes like /profile here */}
        {/*      </Route>
                */}

        {/* Optional: Catch-all/Not Found Route */}
        {/* <Route path="*" element={<div>Page Not Found</div>} /> */}

      </Routes>
    </Router>
  );
}

export default Approutes;