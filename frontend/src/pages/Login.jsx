import useLoginForm from '../hooks/useLoginForm';
import InputField from '../components/forms/InputField';
 
function Login() {
  const { formData, handleChange, resetForm } = useLoginForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in User:", formData);
    resetForm();
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit}>
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
