const ImageUpload = ({ name, onChange }) => {
  return (
    <div className="input-field ">
      <label htmlFor={name}>Upload Image</label>
      <input id={name} type="file" name={name} onChange={onChange}
        className="border-2 rounded-md border-zinc-300 pl-1"
      />
    </div>
  );
};

export default ImageUpload;
