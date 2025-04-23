import { useEffect, useRef } from "react";

const ConfirmAction = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  position = "top-0 right-0",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute ${position} z-20  flex items-center justify-center`}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-gray-400 shadow-sm w-96"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <p
          className="mt-2 text-sm font-normal"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-2 py-1 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-sm text-sm border flex items-center gap-1"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-sm bg-blue-600 text-white hover:bg-primary border px-2 py-1 rounded-sm flex items-center gap-1"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAction;
