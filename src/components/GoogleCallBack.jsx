import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "~/store/slices/authSlice";
import Loader from "./Loader/Loader";
import { API_ENDPOINT } from "~/utils/constants";

const GoogleCallBack = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const searchParams = new URLSearchParams(location.search);
      const accessToken = searchParams.get("token");
      if (accessToken) {
        try {
          const response = await axios.get(`${API_ENDPOINT}/v1/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          dispatch(setUser({ user: response.data, accessToken }));
          navigate("/", { replace: true });
        } catch (error) {
          navigate("/login");
        }
      }
    };

    fetchUser();
  }, [dispatch, navigate, location]);

  return <Loader />;
};

export default GoogleCallBack;
