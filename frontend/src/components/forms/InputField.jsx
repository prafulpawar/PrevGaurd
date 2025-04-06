const InputField = ({ label, type = "text", name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="input-field w-48  ">
      <label htmlFor={name} className=" text-xl"  >{label}  </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border-2 rounded-md border-zinc-300 pl-1"
      />
    </div>
  );
};

export default InputField;
