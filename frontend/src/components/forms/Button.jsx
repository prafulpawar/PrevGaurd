// src/components/forms/Button.jsx
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', 
 
  isLoading = false,
  className = '',
  fullWidth = true,
  ...props 
}) => {
 
  const isEffectivelyDisabled = isLoading; 

  const baseStyle = `
    flex justify-center items-center
    py-2 px-4 border border-transparent rounded-md shadow-sm
    text-base font-medium focus:outline-none focus:ring-2
    focus:ring-offset-2 transition duration-150 ease-in-out
    ${fullWidth ? 'w-full' : ''}
    ${isEffectivelyDisabled ? 'opacity-50 cursor-not-allowed' : ''} // Style depends only on isLoading
  `;

  const variantStyles = {
    primary: `
      text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500
      ${isEffectivelyDisabled ? 'bg-indigo-400 hover:bg-indigo-400' : ''} // Style depends only on isLoading
    `,
    secondary: `
      text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500
       ${isEffectivelyDisabled ? 'bg-indigo-50 hover:bg-indigo-50 text-indigo-400' : ''} // Style depends only on isLoading
    `,
    link: `
      text-indigo-600 hover:text-indigo-500 focus:ring-indigo-500
      border-none shadow-none bg-transparent p-0 font-medium text-sm
      ${isEffectivelyDisabled ? 'text-indigo-300 hover:text-indigo-300' : ''} // Style depends only on isLoading
    `,
    
  };

  return (
    <button
      type={type}
      onClick={onClick}
    
     
      className={`${baseStyle} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
        
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying... 
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;