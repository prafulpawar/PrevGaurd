import { useState } from "react";

const useLoginForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target; // Fix: Correctly access `name` and `value`
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Fix: Update state using the correct `name`
    }));
  };

  const resetForm = () => setFormData(initialState);

  return { formData, handleChange, resetForm };
};

export default useLoginForm;
