import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import OtpVerification from '../pages/OtpVerification';

import SharedDataDashboard from '../pages/SharedDataDashboard';
import FakeDataGenerator from '../pages/FakeDataGenerator';
import BreachMonitor from '../pages/BreachMonitor';


import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import VaultPage from '../pages/VaultPage';

import {Ierror} from '../redux/slice/registerSlice'
import { useDispatch, useSelector } from 'react-redux';



function Approutes() {
  const error = useSelector(Ierror);
  console.log(error)
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/otp-verification' element={<OtpVerification />} />

        <Route path='/dashboard' element={<SharedDataDashboard />} />
        <Route path='/generator' element={<FakeDataGenerator />} />
        <Route path='/breach-monitor' element={<BreachMonitor />} />
        <Route path='/vault' element={<VaultPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />

        <Route path="*" element={
            <div className="flex justify-center items-center min-h-screen">
                <h1 className="text-2xl text-gray-600">404 - Page Not Found</h1>
            </div>
        } />

      </Routes>
    </Router>
  );
}

export default Approutes;