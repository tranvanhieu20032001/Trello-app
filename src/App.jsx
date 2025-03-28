import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "./store/slices/loadingSlice";
import Loader from "./components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import { WorkspaceProvider } from "./context/WorkspaceContext";

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const location = useLocation();

  useEffect(() => {
    dispatch(startLoading());
    const timeout = setTimeout(() => dispatch(stopLoading()), 900);
    return () => clearTimeout(timeout);
  }, [location.pathname, dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoading && <Loader />}
      <WorkspaceProvider>
        <main>
          <Outlet />
        </main>
      </WorkspaceProvider>
    </>
  );
}

export default App;
