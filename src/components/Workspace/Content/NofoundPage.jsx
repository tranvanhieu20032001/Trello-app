import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout_API } from "~/apis";
import ball from "~/assets/ball.png";
import { logout } from "~/store/slices/authSlice";

const NofoundPage = () => {
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await logout_API(user.id);
      toast.success(response.message);
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-slate-400 px-6">
      <div className="flex items-center text-8xl font-bold">
        <span>4</span>
        <img src={ball} alt="Ball" className="w-20 h-20 mx-2 animate-bounce" />
        <span>4</span>
      </div>

      <p className="text-lg text-white my-2">Oops! Page not found.</p>
      <p className="text-sm text-white max-w-md">
        This page may be private. If someone gave you this link, you may need to
        be a board or Workspace member to access it.
      </p>

      {user && (
        <p className="text-sm mt-3">
          Not <span className="font-semibold">{user.username}</span>?
          <button
            onClick={() => handleLogout()}
            className="text-blue-600 hover:underline ml-1"
          >
            Switch accounts
          </button>
        </p>
      )}
    </div>
  );
};

export default NofoundPage;
