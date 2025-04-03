import React from 'react'
function Register() {
   const [formData , setFormData] = ({ 
        username:"",
        email:"",
        password:"",
   })

   const handleSubmit = (e)=>{
       e.preventDefault()
   }



  return (

    <div>
         <form onSubmit={handleSubmit} >
               <input type="text"  placeholder='Enter Your Username'/>
               <input type="password" placeholder='Enter Your Password' />
               <input type="email" placeholder='Enter Your Email' />
         </form>
         
    </div>

  )
}

export default Register