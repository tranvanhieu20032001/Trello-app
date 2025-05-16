import React, { useEffect, useState } from "react";
import { CiCreditCard2, CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { getWorkspaceByUser_API } from "~/apis";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("searchInput").focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWorkspaceByUser_API();
        const data = response?.data?.data || [];
        console.log("data", data);

        setWorkspaces(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();

    const filtered = [];

    workspaces.forEach((workspace) => {
      const workspaceMatch = workspace.name?.toLowerCase().includes(lowerTerm);
      if (workspaceMatch) {
        filtered.push({
          type: "Workspace",
          id: workspace.id,
          name: workspace.name,
        });
      }

      workspace.boards?.forEach((board) => {
        const boardMatch = board.title?.toLowerCase().includes(lowerTerm);
        if (boardMatch) {
          filtered.push({
            type: "Board",
            id: board.id,
            name: board.title,
            background: board.background, // thêm background
            workspace: workspace.name,
          });
        }

        board.Card?.forEach((card) => {
          const cardMatch = card.title?.toLowerCase().includes(lowerTerm);
          if (cardMatch) {
            filtered.push({
              type: "Card",
              id: card.id,
              name: card.title,
              board: board.title,
              workspace: workspace.name,
            });
          }
        });
      });
    });

    setResults(filtered);
  }, [searchTerm, workspaces]);

  return (
    <div className="relative w-fit">
      <div id="search" className="relative transition-all">
        <input
          type="text"
          placeholder="Search..."
          id="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-40 md:w-64 xl:focus:w-96 py-[6px] text-primary pl-8 pr-4 bg-gray-100 rounded-full outline-none transition-all border border-primary dark:border-secondary"
        />
        <div className="absolute inset-y-0 left-0 text-primary flex items-center pl-3">
          <CiSearch size={20} />
        </div>
      </div>

      <Tooltip anchorSelect="#search" clickable>
        Search <span className="px-2 py-1 bg-slate-600">/</span>
      </Tooltip>

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 border rounded shadow-lg max-h-60 overflow-auto">
          {results.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm"
            >
              {item.type === "Card" && (
                <>
                  <div
                    className="text-primary flex items-center gap-2"
                    onClick={() => navigate(`/card/${item.id}`)}
                  >
                    <CiCreditCard2 size={20} /> {item.name}
                  </div>
                  <span className="text-[10px] font-normal text-gray-500">
                    Board: {item.board} | Workspace: {item.workspace}
                  </span>
                </>
              )}

              {item.type === "Board" && (
                <>
                  <div
                    className="text-primary flex items-center gap-2"
                    onClick={() => navigate(`/board/${item.id}`)}
                  >
                    <img
                      className="w-9 h-6 object-cover"
                      src={item.background}
                      alt=""
                    />
                    <div className="space-y-1">
                      <h1>{item.name}</h1>
                      <span className="text-[10px] font-normal text-gray-500">
                        Workspace: {item.workspace}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {item.type === "Workspace" && (
                <div className="text-primary">
                  <div
                    className="rounded-md flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate(`/workspace/${item.id}`)}
                  >
                    <span className="w-8 h-8 rounded-sm flex justify-center items-center bg-blue-300 uppercase font-semibold">
                      {item.name.charAt(0)}
                    </span>
                    {item.name}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
