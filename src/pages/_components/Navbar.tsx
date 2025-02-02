import { Button } from "@/shadcn/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { CommandLoading } from "cmdk";
import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProfile, searchUsers } from "rhythia-api";
import { useDebounce } from "use-debounce";
import { supabase, useProfile } from "../../supabase";

export function Navbar({
  user,
}: {
  user: Awaited<ReturnType<typeof getProfile>>["user"];
}) {
  const profile = useProfile();
  const [open, setOpen] = useState(false);
  const [showFade, setShowFade] = useState(true);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [rotation, setRotation] = useState(45);
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<Awaited<ReturnType<typeof searchUsers>>>(
    {}
  );
  const [debounced] = useDebounce(value, 500);
  useEffect(() => {
    async function search() {
      if (debounced == "") {
        setUsers({});
        setLoading(false);

        return;
      }
      setUsers(await searchUsers({ text: debounced }));
      setLoading(false);
    }
    search();
  }, [debounced]);

  useEffect(() => {
    setRotation(45);
    if (
      location.pathname.startsWith("/player") ||
      location.pathname.startsWith("/support")
    ) {
      setShowFade(false);
    } else {
      setShowFade(true);
    }
    if (location.pathname.startsWith("/maps")) {
      setRotation(0);
    }
    if (location.pathname.startsWith("/support")) {
      setRotation(20);
    }
    if (location.pathname.startsWith("/leaderboards")) {
      setRotation(240);
    }
    if (location.pathname.startsWith("/collections")) {
      setRotation(110);
    }
  }, [location]);

  useEffect(() => {
    if (value.length) setLoading(true);
  }, [value]);
  return (
    <>
      {showFade && (
        <div
          className="top-[60px] left-0 overflow-hidden h-64 absolute w-full opacity-40 -z-20"
          style={{
            backgroundImage: `url('/bg.png')`,
            filter: `hue-rotate(${rotation}deg)`,
          }}
        >
          <img
            src="https://static.rhythia.com/user-avatar-1735394823646-a2a8cfbe-af5d-46e8-a19a-be2339c1679a"
            className="w-[100vw]"
          ></img>
          <div className="bg-gradient-to-b from-transparent  to-neutral-950 absolute top-0 left-0 w-full h-64 via-[#0a0a0a9f]"></div>
        </div>
      )}
      <div
        className="w-full h-[60px] bg-repeat bg-center  bg-[length:72px_100px] shadow-lg drop-shadow-sm flex justify-center items-center relative z-10 border-b-2 border-neutral-950"
        style={{
          backgroundImage: `url('/bg.png')`,
          filter: `hue-rotate(${rotation}deg)`,
        }}
      >
        <div className="flex w-full items-center max-w-[1100px] p-2 h-full px-6 gap-3 ">
          <Link to={"/"} className="h-full flex items-center">
            <img src={"/navlogo.png"} width={136} alt="Rhythia" />
          </Link>

          <div className="w-[1px] h-1/2 bg-[#6220EC] mx-2 max-md:hidden"></div>
          <div className="flex gap-5 text-sm text-white">
            <Link to={"/leaderboards"} className="cursor-pointer">
              Leaderboards
            </Link>
            <Link to={"/maps"} className="cursor-pointer">
              Maps
            </Link>
            <Link to={"/collections"} className="cursor-pointer">
              Collections
            </Link>
          </div>

          <div className="flex gap-10 text-sm text-white font-medium justify-center items-center h-full  ml-auto">
            <div className="flex gap-2 h-full">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="border-[1px] max-md:hidden px-4 my-2 rounded-md text-xs border-[#6220EC] flex items-center gap-3 bg-transparent outline-none h-8 mr-2 hover:bg-transparent w-[200px]"
                  >
                    Search users
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command className="bg-transparent ">
                    <CommandInput
                      value={value}
                      onInput={async (event) => {
                        setValue((event.target as HTMLInputElement).value);
                      }}
                      placeholder="Type a username..."
                    />
                    <CommandList>
                      {loading ? (
                        <CommandLoading className="h-10 flex items-center px-4">
                          Loading..
                        </CommandLoading>
                      ) : (
                        users.results &&
                        users.results.map((user) => (
                          <CommandItem
                            className="hover:bg-transparent px-0"
                            key={`word-${user.username}`}
                            value={user.username || ""}
                          >
                            <Button
                              className="bg-transparent text-white hover:bg-transparent w-full h-6 flex justify-start px-3"
                              onClick={() => {
                                navigate(`/player/${user.id}`);
                                setOpen(false);
                                setValue("");
                              }}
                            >
                              <User className="mr-2 h-4 w-4" />
                              <span>{user.username}</span>
                            </Button>
                          </CommandItem>
                        ))
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <img
                src={"/search.png"}
                alt=""
                width={44}
                height={44}
                className="max-md:hidden"
              />
            </div>

            {profile.user && user ? (
              <div className="flex gap-2">
                <Link to={`/player/${user?.id}`}>
                  <img
                    src={user?.avatar_url || ""}
                    alt="Profile Picture"
                    width={24}
                    height={24}
                    className="cursor-pointer border-[2px] rounded-full w-8 h-8 object-cover"
                    style={{
                      filter: `hue-rotate(${-rotation}deg)`,
                    }}
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
    </>
  );
}
