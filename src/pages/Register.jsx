import { useEffect, useState } from "react";
import { FaTrello } from "react-icons/fa6";
import InputComponent from "~/components/Input/InputComponent";
import { createUser_API } from "~/apis";
import { toast } from "react-toastify";
import { PiWarningCircleLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "~/store/slices/loadingSlice";

const Register = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [notification, setNotification] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: "",
      password: "",
      confirmpassword: "",
    };
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

    if (!formData.confirmpassword.trim()) {
      newErrors.confirmpassword = "Confirm password is required.";
    } else if (formData.password.trim() !== formData.confirmpassword.trim()) {
      newErrors.confirmpassword = "Passwords do not match.";
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      dispatch(startLoading());
      const response = await createUser_API(formData);
      toast.success(response.data.message);
      setNotification(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      setNotification(null);
    } finally {
      dispatch(stopLoading());
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="w-full h-screen bg-[url('assets/register.jpg')] lg:bg-[url('assets/login.png')] bg-cover">
      <div className="bg-black bg-opacity-10 h-full dark:bg-opacity-50 relative text-primary">
        <div className="absolute px-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl w-96 min-h-[500px] py-5 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center gap-1">
            <FaTrello size={25} /> Trello
          </div>
          <span className="flex items-center justify-center text-xs my-2">
            Author: VanHieu02
          </span>
          {notification && (
            <span className="text-green-500 flex items-center gap-2 text-xs">
              <PiWarningCircleLight size={18} />
              {notification}
            </span>
          )}
          <form onSubmit={handleSubmit} className="mt-5">
            <InputComponent
              label="Email"
              name="email"
              required
              onChange={(value) => handleChange("email", value)}
              error={errors.email}
            />
            <InputComponent
              label="password"
              name="password"
              type="password"
              required
              onChange={(value) => handleChange("password", value)}
              error={errors.password}
            />
            <InputComponent
              label="confirm password"
              name="confirmpassword"
              type="password"
              required
              onChange={(value) => handleChange("confirmpassword", value)}
              error={errors.confirmpassword}
            />
            <button
              type="submit"
              className="mt-2 w-full bg-blue-600 text-white p-2 text-base rounded-md hover:bg-primary capitalize"
            >
              Register
            </button>
          </form>
          <div className="relative w-full mt-4 mb-2 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 bg-white text-sm text-gray-500 dark:bg-gray-900">
              Already have an account ?
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <span className="flex items-center justify-center text-sm">
            <a
              href="login"
              className=" text-blue-600 hover:border-b border-b-blue-600"
            >
              Log in !
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
