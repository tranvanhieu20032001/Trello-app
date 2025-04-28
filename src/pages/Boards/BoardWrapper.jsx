import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Workspace/Sidebar/Sidebar";

const BoardWrapper = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [wrapperHeight, setWrapperHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        setWrapperHeight(`calc(100vh - ${navbarHeight}px)`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="flex w-screen mx-auto text-primary" style={{ height: wrapperHeight }}>
      <div
        className={`${
          !isSidebarOpen ? "min-w-8" : "min-w-64"
        } relative shadow-md flex flex-col bg-light dark:bg-dark text-primary dark:text-secondary`}
      >
        {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} />}
        <button
          className="absolute -right-0 top-2 p-1.5 rounded-full shadow-md hover:bg-gray-200"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <IoIosArrowBack size={15} /> : <IoIosArrowForward size={15} />}
        </button>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default BoardWrapper;
