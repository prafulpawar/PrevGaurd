const ImageUpload = ({ name, onChange }) => {
  return (
    <div className="input-field">
      <label htmlFor={name}>Upload Image</label>
      <input id={name} type="file" name={name} onChange={onChange} />
    </div>
  );
};

export default ImageUpload;
