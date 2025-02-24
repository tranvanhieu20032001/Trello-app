import React, { useEffect, useState } from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { MdDashboard, MdOutlineWorkspaces } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { GrTemplate } from "react-icons/gr";
import { IoIosAdd, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import AddNewWorkspace from "../Modal/AddNewWorkspace";
import { toast } from "react-toastify";
import { createWorkspace_API, getWorkspaceByUser_API } from "~/apis";

const Sidebar = () => {
  const [openWorkspaces, setOpenWorkspaces] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]); // Khởi tạo là mảng rỗng

  const toggleWorkspace = (id) => {
    setOpenWorkspaces((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddWorkSpace = async (title) => {
    if (!title.trim()) {
      toast.error("Please enter workspace name");
      return;
    }
    // Gọi API để tạo mới workspace
    const response = await createWorkspace_API({ title });

    if (response.data) {
      setWorkspaces((prev) => [...prev, response?.data?.data]);
    }
    toast.success(response.data?.message);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getWorkspaceByUser_API();

      console.log("datra",response.data.data);
      
      if (response.data) {
        setWorkspaces(response.data.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full text-primary px-4 py-8">
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 hover:bg-gray-200 hover:text-blue-600 px-2 py-1.5 rounded ${
              isActive ? "bg-gray-200 text-blue-600" : ""
            }`
          }
        >
          <BiHomeAlt2 size={20} />
          Home
        </NavLink>
        <NavLink
          to="/boards"
          className={({ isActive }) =>
            `flex items-center gap-2 hover:bg-gray-200 hover:text-blue-600 px-2 py-1.5 rounded ${
              isActive ? "bg-gray-200 text-blue-600" : ""
            }`
          }
        >
          <MdDashboard size={18} /> Boards
        </NavLink>
        <NavLink
          to="/templates"
          className={({ isActive }) =>
            `flex items-center gap-2 hover:bg-gray-200 hover:text-blue-600 px-2 py-1.5 rounded ${
              isActive ? "bg-gray-200 text-blue-600" : ""
            }`
          }
        >
          <GrTemplate size={18} /> Templates
        </NavLink>
        <hr />
        <div className="pt-4">
          <h1 className="text-xs flex items-center gap-1 justify-between">
            <span className="flex items-center gap-1">
              <MdOutlineWorkspaces size={15} />
              Workspace
            </span>
            <span
              className="p-1 rounded-sm hover:bg-gray-200"
              onClick={() => setIsOpen(true)}
            >
              <IoIosAdd size={20} />
            </span>
          </h1>

          {/* Các phần tử workspaces */}
          {workspaces?.map((workspace) => (
            <div className="relative w-full text-sm mt-2" key={workspace.id}>
              <div
                className={`flex items-center justify-between gap-2 hover:bg-gray-200 hover:text-blue-600 px-2 py-1.5 rounded cursor-pointer ${
                  openWorkspaces[workspace.id]
                    ? "bg-gray-200 text-blue-600"
                    : ""
                }`}
                onClick={() => toggleWorkspace(workspace.id)}
              >
                <span className="flex items-center gap-2">
                  {workspace?.name}
                </span>
                {openWorkspaces[workspace.id] ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </div>

              {openWorkspaces[workspace.id] && (
                <div className="mt-2 w-full bg-white z-10">
                  <ul className="py-2 text-sm text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-200 hover:text-blue-600 cursor-pointer">
                      My Workspace
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 hover:text-blue-600 cursor-pointer">
                      Team Projects
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 hover:text-blue-600 cursor-pointer">
                      Create New Workspace
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
      <AddNewWorkspace
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdd={handleAddWorkSpace}
      />
    </div>
  );
};

export default Sidebar;
