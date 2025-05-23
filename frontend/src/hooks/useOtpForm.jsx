// src/hooks/useOtpForm.jsx
import { useState } from "react";

const useOtpForm = (initialState = { otp: '' }) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
   

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => setFormData(initialState);

 
  const setOtpValue = (value) => {
    setFormData((prev) => ({
      ...prev,
      otp: value,
    }));
  }

  return { formData, handleChange, resetForm, setOtpValue };
};

export default useOtpForm;