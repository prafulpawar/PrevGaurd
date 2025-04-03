import React from 'react'
import {BrowserRouter as Router ,Routes ,Route } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'

function Approutes() {
  return (
       <Router>
            <Routes>
                 <Route path='/login' element={Login}/>
                 <Route path='/register' element={Register}/>
            </Routes>
       </Router>
  )
}

export default  Approutes