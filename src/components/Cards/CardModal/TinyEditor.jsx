// components/TinyEditor.jsx
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

const TinyEditor = ({ onChangeRef, initialValue = "", mentionsData = [] }) => {
  const localRef = useRef(null);
  const TINY_KEY = import.meta.env.VITE_TINY_KEY;

  const mentionsFetch = (query, success) => {
    const filtered = mentionsData
      .filter((user) =>
        user.name.toLowerCase().includes(query.term.toLowerCase())
      )
      .slice(0, 5);
    success(filtered);
  };

  const mentionsMenuComplete = (editor, userInfo) => {
    const span = editor.getDoc().createElement("span");
    span.className = "mymention";
    span.setAttribute("data-mention-id", userInfo.id);
    span.appendChild(editor.getDoc().createTextNode("@" + userInfo.name));
    return span;
  };

  return (
    <Editor
      onInit={(evt, editor) => {
        localRef.current = editor;
        if (onChangeRef) onChangeRef(editor); // ✅ fix quan trọng
      }}
      initialValue={initialValue}
      apiKey={TINY_KEY} // ✅ fix cú pháp
      init={{
        height: 150,
        menubar: false,
        plugins: ["link", "lists", "wordcount", "emoticons", "mentions"],
        toolbar:
          "bold italic underline | bullist numlist | emoticons | undo redo",
        mentions_selector: ".mymention",
        mentions_fetch: mentionsFetch,
        mentions_menu_complete: mentionsMenuComplete,
        mentions_item_type: "profile",
        content_style: `.mymention { color: #3b82f6; } body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }`,
      }}
    />
  );
};

export default TinyEditor;
