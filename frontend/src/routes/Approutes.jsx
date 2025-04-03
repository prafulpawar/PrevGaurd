import React from 'react'
import {BrowserRouter as Router ,Routes ,Route } from 'react-router-dom'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Home from '../pages/Home'

function Approutes() {
  return (
       <Router>
            <Routes>
                  <Route path='/' element={ <Home/>}/>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/register' element={<Register/>}/>
            </Routes>
       </Router>
  )
}

export default  Approutes