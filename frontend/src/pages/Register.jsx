import useForm from "../hooks/useForm";
import InputField from "../components/forms/InputField";
import ImageUpload from "../components/forms/ImageUpload";

const Register = () => {
  const { formData, handleChange, resetForm } = useForm({
    username: "",
    email: "",
    password: "",
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering User:", formData);
    resetForm();
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <form onSubmit={handleSubmit} className="register-form">
          <InputField label="Username" type="text" name="username" value={formData.username} onChange={handleChange} />
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
          <ImageUpload name="image" onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
