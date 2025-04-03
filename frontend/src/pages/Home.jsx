import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();
  return (
    <div>
       
         <button onClick={() => navigate("/login")}>Login</button>
         <button onClick={() => navigate("/register")}>Register</button>
         Your Most WelCome To Prevgaurd...
    </div>
  )
}

export default Home