import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Home/Sidebar/Sidebar";

function Home() {
  return (
    <>
      <main className="grid grid-cols-5 max-w-screen-2xl mx-auto">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-4">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default Home;
