import React from 'react';

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
  disabled = false,
}) => {
  return (
    <div className="input-field w-full mb-4">
      <label htmlFor={name} className="block text-xl font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`border-2 rounded-md pl-2 py-2 w-full ${
          error ? 'border-red-500' : 'border-zinc-300'
        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
