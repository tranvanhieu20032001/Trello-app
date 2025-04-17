import { useState } from "react";
import CreateBoardModal from "~/components/Modal/CreateBoardModal";

const Create = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(true)} className="bg-primary text-white p-2 rounded">Create</button>
      <CreateBoardModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Create;
