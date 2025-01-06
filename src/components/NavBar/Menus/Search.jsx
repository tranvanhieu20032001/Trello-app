import React, { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Tooltip } from "react-tooltip";

function Search() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("searchInput").focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  return (
    <>
      <div id="search" className="relative transition-all">
        <input
          type="text"
          placeholder="Search..."
          id="searchInput"
          className="w-40 md:w-64 xl:focus:w-96 py-[6px] text-primary pl-8 pr-4 bg-gray-100 rounded-full outline-none transition-all border border-primary dark:border-secondary"
        />
        <div className="absolute inset-y-0 left-0 text-primary flex items-center pl-3">
          <CiSearch size={20} />
        </div>
      </div>
      <Tooltip anchorSelect="#search" clickable>
        Search <span className="px-2 py-1 bg-slate-600">/</span>
      </Tooltip>
    </>
  );
}

export default Search;
