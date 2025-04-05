// src/hooks/useOtpForm.jsx
import { useState } from "react";

const useOtpForm = (initialState = { otp: '' }) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Optionally restrict input to numbers only, depending on desired UX
    // const numericValue = value.replace(/[^0-9]/g, ''); // Uncomment to allow only digits

    setFormData((prev) => ({
      ...prev,
      [name]: value, // or numericValue if using restriction
    }));
  };

  const resetForm = () => setFormData(initialState);

  // Optional: Allow setting the OTP value directly (e.g., for pasting)
  const setOtpValue = (value) => {
    setFormData((prev) => ({
      ...prev,
      otp: value,
    }));
  }

  return { formData, handleChange, resetForm, setOtpValue };
};

export default useOtpForm;