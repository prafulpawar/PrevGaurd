import { useState } from "react";

const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const resetForm = () => setFormData(initialState);

  return { formData, handleChange, resetForm };
};

export default useForm;
