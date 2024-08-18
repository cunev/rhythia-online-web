import { BiLogIn, BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { supabase, useProfile } from "../../supabase";

export function Navbar() {
  const { user } = useProfile();
  const navigate = useNavigate();
  return (
    <div
      className="w-full h-[60px] bg-repeat bg-center  bg-[length:72px_100px] shadow-md flex justify-center items-center hue-rotate-[45deg]"
      style={{ backgroundImage: `url('/bg.png')` }}
    >
      <div className="flex w-full items-center max-w-[1100px] p-2 h-full px-6 gap-4">
        <Link to={"/"} className="h-full flex items-center gap-4 invert-0">
          <img src={"/rhythia.png"} width={40} height={40} alt="Rhythia" />
          <div className="flex flex-col">
            <p className="text-white font-bold">Rhythia</p>
            <p className="text-white font-medium text-xs">Online</p>
          </div>
        </Link>

        <div className="w-[1px] h-1/2 bg-[#6220EC] mx-2"></div>
        <div className="flex gap-5 text-sm text-white">
          <Link to={"/leaderboards"} className="cursor-pointer hidden md:block">
            Leaderboards
          </Link>
          {/* <Link to={"/beatmaps"} className="cursor-pointer hidden md:block">
            Beatmaps
          </Link> */}
        </div>

        <div className="flex gap-10 text-sm text-white font-medium justify-center items-center h-full ml-auto">
          <div className="flex gap-2 h-full">
            <input
              className="border-[1px] px-4 my-2 rounded-md text-xs border-[#6220EC] flex items-center gap-3 bg-transparent outline-none"
              placeholder="Search players"
            ></input>
            <img src={"/search.png"} alt="" width={44} height={44} />
          </div>

          {user ? (
            <div className="flex gap-2">
              <Link to="/player" onClick={async () => {}}>
                <img
                  src={user.user_metadata.avatar_url || ""}
                  alt="Profile Picture"
                  width={24}
                  height={24}
                  className="cursor-pointer border-[2px] rounded-full hue-rotate-[-45deg] w-8"
                />
              </Link>
              <button
                type="submit"
                className=" px-4 py-1 rounded-md text-xs flex items-center gap-3"
                onClick={() => {
                  supabase.auth.signOut();
                }}
              >
                <BiLogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                supabase.auth.signInWithOAuth({
                  provider: "discord",
                  options: {
                    redirectTo: document.location.origin,
                  },
                });
              }}
              className=" px-1rounded-md text-xs flex items-center gap-3"
            >
              <BiLogIn size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
