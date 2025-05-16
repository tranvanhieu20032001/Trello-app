import React, { useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { uploadAttachment_API, uploadAttachmentPath_API } from "~/apis";
import { BE_URL } from "~/utils/constants";

const AttachmentModal = ({ card, onClose }) => {
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    const filePath = [];
    if (selectedFiles.length > 0) {
      const res = await uploadAttachment_API(selectedFiles);
      res.data.map((props) => {
        filePath.push(BE_URL + "/" + props.filePath);
      });

      await uploadAttachmentPath_API(card?.id, "LOCAL", filePath);
      toast.success("Upload file successfully");
      setSelectedFiles([]);
    } else {
      alert("Please select or drop files to upload.");
    }
  };

  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <div className="absolute top-0 left-full bg-white dark:bg-gray-600 px-6 py-4 rounded-2xl border shadow-lg w-96 z-50">
      <div className="flex justify-center items-center mb-4 relative">
        <h1 className="text-center font-medium">Attachments</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black text-lg font-bold absolute top-0 right-2"
        >
          <LiaTimesSolid size={20} className="cursor-pointer" />
        </button>
      </div>

      {selectedFiles.length === 0 ? (
        <div
          ref={dropAreaRef}
          className={`border-2 border-dashed rounded-md p-6 mt-2 cursor-pointer transition-all duration-300 ${
            isDraggingOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h1 className="font-normal text-center">Drag and drop files here</h1>
          <h3 className="font-light text-xs mt-2 text-center">
            or{" "}
            <button
              onClick={handleButtonClick}
              className="text-blue-500 hover:underline"
            >
              browse
            </button>{" "}
            from your computer
          </h3>
        </div>
      ) : (
        <div>
          <h1 className="font-normal mb-2">Selected Files:</h1>
          <ul>
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpload}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-primary transition"
          >
            Upload
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
    </div>
  );
};

export default AttachmentModal;
