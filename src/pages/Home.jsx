import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Home/Sidebar/Sidebar";

function Home() {
  return (
    <>
      <main className="grid grid-cols-4 max-w-screen-lg mx-auto">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-3">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Home;
