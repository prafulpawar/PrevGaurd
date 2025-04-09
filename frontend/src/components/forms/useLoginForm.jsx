import { useState } from 'react';

const useLoginForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return { formData, handleChange, resetForm };
};

export default useLoginForm;