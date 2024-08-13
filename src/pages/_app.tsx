import { Outlet } from "react-router-dom";
import { createUser } from "rhythia-api";
import "shadcn-react/style.css";
import { Navbar } from "./_components/Navbar";

export default function HomeLayout() {
  createUser({ name: "savaj", age: 12 });
  return (
    <div className="bg-neutral-950 dark h-[100vh] text-white">
      <Navbar />
      <div className="mx-auto max-w-[1100px] px-6 pt-12 pb-36">
        <Outlet />
      </div>
      <div className="w-full flex-col text-neutral-500 flex items-center justify-center">
        <div className="text-xs">Made with love.</div>
        <div className="text-xs mb-6">Rhythia Online 2024.</div>
      </div>
    </div>
  );
}
