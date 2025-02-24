import React, { useState, useRef } from "react";
import "./styles.css";
import { PiWarningCircleLight } from "react-icons/pi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const InputComponent = ({
  label,
  name,
  type = "text",
  required = false,
  onChange,
  error,
}) => {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="mb-4">
      <div className="relative z-0 w-full mb-2">
        <input
          ref={inputRef}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          name={name}
          placeholder=" "
          // required={required}
          onChange={handleInputChange}
          className="p-1.5 rounded-md block w-full px-2 mt-0 bg-transparent text-base text-primary border appearance-none focus:outline-none focus:ring-0 focus:border-primary border-gray-200"
        />
        <label
          htmlFor={name}
          className="absolute duration-300 left-2 top-1/2 transform -translate-y-1/2 -z-1 origin-0 text-gray-500 bg-white text-base capitalize"
        >
          {label}
        </label>
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={18} />
            ) : (
              <AiOutlineEye size={18} />
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-red-500 flex items-center gap-2 text-xs">
          <PiWarningCircleLight size={18} />
          {error}
        </span>
      )}
    </div>
  );
};

export default InputComponent;
