import { useState, useRef, useEffect } from "react";
import { MdFilterList } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  setMembersFilter,
  setStatusFilter,
  setDueDateFilter,
  setLabelsFilter,
} from "~/store/slices/filterSlice";
import { GoClock } from "react-icons/go";
import { IoCalendarOutline } from "react-icons/io5";

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const dispatch = useDispatch();
  const boardData = useSelector((state) => state.board);
  const board = boardData?.board?.data;
  const mockMembers = board?.BoardMembers || [];
  const mockLabels = board?.labels || [];

  const {
    members = [],
    status = [],
    dueDate = [],
    labels = [],
  } = useSelector((state) => state.filter);

  const hasActiveFilters =
    members.length > 0 ||
    status !== null ||
    dueDate.length > 0 ||
    labels.length > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (value, list, action) => {
    const newList = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];

    dispatch(action(newList));
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className={`flex items-center gap-2 p-1 ${
          isOpen ? "bg-gray-500 rounded-sm" : ""
        }`}
      >
        <button
          id="filter"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-sm flex items-center gap-1 text-sm hover:bg-gray-700 p-1"
        >
          <MdFilterList size={20} />
          <span className="hidden sm:inline-block">Filter</span>
        </button>
        {hasActiveFilters && (
          <button
            className="rounded-sm flex items-center gap-1 text-sm hover:bg-gray-700 p-1"
            onClick={() => {
              dispatch(setMembersFilter([]));
              dispatch(setStatusFilter(null));
              dispatch(setDueDateFilter([]));
              dispatch(setLabelsFilter([]));
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <Tooltip anchorSelect="#filter" className="z-10" place="bottom">
        Filter{" "}
        <span className="px-2 py-0.5 bg-slate-600 text-white rounded">F</span>
      </Tooltip>

      {isOpen && (
        <div className="absolute bg-white text-primary right-0 mt-2 w-72 shadow-lg rounded-lg p-4 z-50 border space-y-4 text-sm dark:bg-gray-700 dark:text-secondary">
          <div className="max-h-56 overflow-y-auto">
            <p className="font-medium mb-1">Card Members</p>
            {mockMembers
              .filter((member) => member?.user?.id)
              .map((member, index) => (
                <label key={index} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={members.includes(member.user.id)}
                    onChange={() =>
                      toggleSelection(member.user.id, members, setMembersFilter)
                    }
                  />
                  <span>{member.user.username}</span>
                </label>
              ))}
            <hr />
          </div>

          <div>
            <p className="font-medium mb-1">Card Status</p>
            {[
              { label: "Marked as complete", value: true },
              { label: "Not marked as complete", value: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={status === item.value}
                  onChange={() => {
                    if (status === item.value) {
                      dispatch(setStatusFilter(null));
                    } else {
                      dispatch(setStatusFilter(item.value));
                    }
                  }}
                />
                <span>{item.label}</span>
              </label>
            ))}
            <hr />
          </div>

          <div>
            <p className="font-medium mb-1">Due Date</p>
            {[
              { label: "Overdue", icon: <GoClock /> },
              { label: "No dates", icon: <IoCalendarOutline /> },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={dueDate.includes(item.label)}
                  onChange={() =>
                    toggleSelection(item.label, dueDate, setDueDateFilter)
                  }
                />
                <span
                  className={`flex items-center gap-2 ${
                    item.label === "Overdue" ? "text-red-500" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </span>
              </label>
            ))}
            <hr />
          </div>

          <div>
            <p className="font-medium mb-1">Card Labels</p>
            {mockLabels
              .filter((label) => label?.id)
              .map((label, index) => (
                <label key={index} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={labels.includes(label.id)}
                    onChange={() =>
                      toggleSelection(label.id, labels, setLabelsFilter)
                    }
                  />
                  <div
                    className="min-w-16 text-white rounded-sm text-xs font-medium flex items-center justify-center"
                    style={{ backgroundColor: label?.color }}
                  >
                    {label?.name}
                  </div>
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
