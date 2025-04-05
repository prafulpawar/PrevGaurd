import useForm from "../hooks/useForm";
import InputField from "../components/forms/InputField";
import ImageUpload from "../components/forms/ImageUpload";

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline'; // For logo

const Register = () => {
  const { formData, handleChange, resetForm, setFormData } = useForm({ // Assuming setFormData is available for ImageUpload
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // Added confirm password field
    image: null,
  });
  const navigate = useNavigate();

  // More specific handler for image if useForm doesn't handle files well
   const handleImageChange = (file) => {
       setFormData(prev => ({ ...prev, image: file }));
   };


  const handleSubmit = (e) => {
    e.preventDefault();
     if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!"); // Simple validation
        return;
    }
    // Prepare data for API (likely FormData if uploading image)
    const registrationData = new FormData();
    registrationData.append('username', formData.username);
    registrationData.append('email', formData.email);
    registrationData.append('password', formData.password);
    if (formData.image) {
        registrationData.append('profileImage', formData.image); // Check backend field name
    }

    console.log('Registering User:', formData); // Log original state
    console.log('Sending FormData:', registrationData); // Log what would be sent

    // Add actual registration logic here (API call)
    // e.g., registerUser(registrationData).then(() => navigate('/login'));
    // resetForm(); // Maybe reset only on success/failure after API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
         {/* Logo and Brand */}
         <Link to="/" className="flex justify-center items-center mb-6">
            <ShieldCheckIcon className="h-10 w-auto text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">PrivGuard</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Use 'multipart/form-data' if uploading files */}
          <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
            <InputField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />

            <InputField
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min 8 chars)"
              // Add pattern/minLength attributes for better validation
              minLength="8"
            />

             <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword" // Separate field
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />

            {/* Profile Picture Upload - Relies on internal styling of ImageUpload */}
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture (Optional)
                 </label>
                {/* Pass the specific handler if needed, or ensure useForm handles files */}
                 <ImageUpload
                    name="image"
                    onChange={handleImageChange} // Or just handleChange if useForm handles it
                    // Pass existing image URL for preview if applicable
                    // currentImageUrl={formData.imageUrl}
                 />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;