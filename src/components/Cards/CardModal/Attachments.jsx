import { useState } from "react";
import { MdOutlineAttachFile } from "react-icons/md";
import { formatUploadTime } from "~/utils/formatters";
import {
  BsFileEarmarkPdf,
  BsFiletypeDocx,
  BsImage,
  BsThreeDots,
} from "react-icons/bs";
import AttachmentModal from "~/components/Modal/AttachmentModal";
import { deleteAttachment_API } from "~/apis";
import { useSelector } from "react-redux";
import { GoFile } from "react-icons/go";
import { LiaGoogleDrive } from "react-icons/lia";

const Attachments = ({ card, handleFetchData }) => {
  const attachments = card?.attachments;
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (fileId, filePath) => {
    await deleteAttachment_API(fileId, filePath);
    await handleFetchData();
  };

  return (
    <div className="space-y-2 relative">
      <div className="flex justify-between items-center">
        <span className="font-medium text-base flex items-center gap-2">
          <MdOutlineAttachFile size={20} />
          Attachments
        </span>
        <button
          className="text-sm bg-blue-600 text-white hover:bg-primary border border-blue-700 px-2 py-1 rounded-sm"
          onClick={() => setIsOpen(true)}
        >
          Add
        </button>
      </div>

      {attachments?.length > 0 ? (
        <ul className="space-y-2">
          {attachments.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between border border-gray-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <div className="flex items-center gap-3 w-full">
                {(() => {
                  if (file.type === "LOCAL") {
                    const ext = file.fileUrl.split(".").pop().toLowerCase();
                    if (ext === "docx" || ext === "doc")
                      return <BsFiletypeDocx size={20} />;
                    if (ext === "pdf") return <BsFileEarmarkPdf size={20} />;
                    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
                      return <BsImage size={20} />;
                    return <GoFile size={20} />;
                  } else {
                    return <LiaGoogleDrive size={20} />;
                  }
                })()}

                <div className="flex-1">
                  <div>
                    <a
                      href={file.fileUrl.replace(/\\/g, "/")}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={file.fileUrl?.split("\\").pop()}
                      className="text-blue-500 text-sm break-all"
                    >
                      {file?.type === "LOCAL"
                        ? file.fileUrl?.split("\\").pop()
                        : file.fileName}
                    </a>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-white">
                    {formatUploadTime(file.createdAt)}
                  </div>
                </div>

                {/* More button */}
                <div
                  className="p-2 hover:bg-gray-300 rounded-full cursor-pointer relative"
                  onClick={() =>
                    setOpenMenuIndex(openMenuIndex === index ? null : index)
                  }
                >
                  <BsThreeDots size={18} />
                  {openMenuIndex === index && (
                    <div className="absolute right-0 top-8 w-32 bg-white border shadow-md rounded-md z-20">
                      <a
                        href={file.fileUrl?.replace(/\\/g, "/")}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Download
                      </a>
                      {user?.id === file?.userId && (
                        <button
                          onClick={() =>
                            handleDelete(
                              file.id,
                              file.fileUrl?.split("\\").pop()
                            )
                          }
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-500"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-white italic">No attachments</p>
      )}
      {isOpen && (
        <AttachmentModal card={card} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default Attachments;
