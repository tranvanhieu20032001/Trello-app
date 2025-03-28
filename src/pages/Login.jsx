import { useState } from "react";
import { FaTrello } from "react-icons/fa6";
import InputComponent from "~/components/Input/InputComponent";
import GoogleLogo from "../assets/Google.svg";
import { login_API } from "~/apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "~/store/slices/authSlice";
import { API_ENDPOINT } from "~/utils/constants";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Xóa lỗi khi có thay đổi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await login_API(formData);
      toast.success(response.message);
      dispatch(
        setUser({ user: response.data.user, accessToken: response.data.accessToken })
      );
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log("error", error);
      
      toast.error(error.response.data.message);
    }
  };

  const handleLoginGoogle = async () => {
    window.location.href = `${API_ENDPOINT}/auth/google/login`;
  };

  return (
    <div className="w-full h-screen bg-[url('assets/register.jpg')] lg:bg-[url('assets/login.png')] bg-cover">
      <div className="bg-black bg-opacity-10 h-full dark:bg-opacity-50 relative text-primary">
        <div className="absolute px-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl w-96 h-[500px] bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center gap-1 mt-5">
            <FaTrello size={25} /> Trello
          </div>
          <span className="flex items-center justify-center text-xs my-2">
            Author: VanHieu02
          </span>
          <form onSubmit={handleSubmit} className="mt-5">
            <InputComponent
              label="Email"
              name="email"
              required
              onChange={(value) => handleChange("email", value)} // Cập nhật trường email
              error={errors.email}
            />
            <InputComponent
              label="password"
              name="password"
              type="password"
              required
              onChange={(value) => handleChange("password", value)} // Cập nhật trường email
              error={errors.password}
            />
            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white p-2 text-base rounded hover:bg-primary capitalize"
            >
              Login
            </button>
          </form>
          <div className="relative w-full my-4 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 bg-white text-sm text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <button
            onClick={handleLoginGoogle}
            type="submit"
            className="w-full flex items-center justify-center gap-2 text-blue-600 p-2 text-base rounded capitalize border border-blue-600"
          >
            <img src={GoogleLogo} alt="" />
            Google
          </button>
          <div className="relative w-full mt-4 mb-2 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 bg-white text-sm text-gray-500">
              Have no account yet ?
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <span className="flex items-center justify-center text-sm">
            <a
              href="register"
              className=" text-blue-600 hover:border-b border-b-blue-600"
            >
              Create account !
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
