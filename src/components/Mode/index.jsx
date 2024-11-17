import { useEffect, useState, useRef } from "react";
import { CiCloudMoon, CiDesktop, CiSun } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Tooltip } from "react-tooltip";

function ModeSelect() {
  const [selectedMode, setSelectedMode] = useState("system");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (
      currentTheme === "dark" ||
      (!currentTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (currentTheme) {
      setSelectedMode(currentTheme);
    } else {
      setSelectedMode("system");
    }
  }, []);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setDropdownOpen(false);

    if (mode === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const modes = [
    {
      value: "light",
      label: "Light",
      icon: <CiSun size={20} />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <CiCloudMoon size={20} />,
    },
    {
      value: "system",
      label: "System",
      icon: <CiDesktop size={20} />,
    },
  ];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        id="theme"
        className="flex items-center justify-center w-full appearance-none gap-1 border border-primary dark:border-secondary rounded-md p-1 lg:p-2"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        {modes.find((mode) => mode.value === selectedMode).icon}
        <MdOutlineKeyboardArrowDown size={20} />
      </button>
      <Tooltip anchorSelect="#theme" clickable className="z-20">
        Theme
      </Tooltip>
      {dropdownOpen && (
        <ul
          className="absolute z-10 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-secondary text-primary dark:text-secondary rounded-md shadow-lg"
        >
          {modes.map((mode) => (
            <li
              key={mode.value}
              className="flex items-center gap-1 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleModeChange(mode.value)}
            >
              {mode.icon}
              {mode.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ModeSelect;
