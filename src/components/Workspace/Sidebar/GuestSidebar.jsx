import { HiOutlineHome } from "react-icons/hi2";
import { SlLock } from "react-icons/sl";
import { Link } from "react-router-dom";
const GuestSidebar = () => {
  return (
    <div className="col-span-1 shadow-md h-screen p-3 space-y-4 bg-light dark:bg-dark text-primary dark:text-secondary text-sm">
      <div className="flex items-center gap-2 pb-3 border-b">
        <SlLock size={20} /> Private Workspace
      </div>
      <p className="text-xs pb-3 border-b">
        Since you’re not a member of this Workspace, you can’t see its boards or
        other information.
      </p>
      <div className="flex text-xs pb-2 gap-2">
        <div><HiOutlineHome size={23} /></div>
        <p>To see Workspaces and boards you’re a member of, you can visit your <Link className="hover:border-b hover:border-b-blue-500" to="/">home page</Link>.</p>
      </div>
    </div>
  );
};

export default GuestSidebar;
