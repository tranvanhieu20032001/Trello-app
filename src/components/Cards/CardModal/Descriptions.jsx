import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { updateCardDescription_API } from "~/apis";
import { BsTextLeft } from "react-icons/bs";

export default function Descriptions({ card }) {
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialContent, setInitialContent] = useState("");

  useEffect(() => {
    setInitialContent(card?.description || "");
  }, [card?.description]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    try {
      const content = editorRef.current.getContent();
      await updateCardDescription_API(card?.id, content);
      setInitialContent(content);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  return (
    <div className="space-y-2">
      <span className="font-medium text-base flex items-center gap-2">
        <BsTextLeft size={20} />
        Description
      </span>

      {!isEditing ? (
        <div
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {initialContent ? (
            <div dangerouslySetInnerHTML={{ __html: initialContent }} />
          ) : (
            <span className="text-gray-400 dark:text-white italic">
              Add a more detailed description...
            </span>
          )}
        </div>
      ) : (
        <div>
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            apiKey="10lpxjmyvyly4rdb88xil2fxm3y11ava3j2s5rn9tl5btib8"
            initialValue={initialContent}
            init={{
              height: 200,
              menubar: false,
              plugins: ["link", "lists", "table", "wordcount", "emoticons"],
              toolbar:
                "undo redo | bold italic | bullist numlist | link | removeformat",
              file_picker_types: "image",
            }}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
