import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import progress from "~/assets/progress.png";

function Templates() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="dropdown relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
          isOpen ? "bg-gray-200 dark:bg-gray-700" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Templates <MdOutlineArrowDropDown size={20} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-light dark:bg-gray-700 border border-gray-200 p-2 rounded-md min-w-52 lg:min-w-72 h-52 z-10 text-primary dark:text-secondary flex justify-center items-center">
          <img src={progress} className="max-h-full max-w-full" alt="" />
        </div>
      )}
    </div>
  );
}

export default Templates;
