import { Button } from "@/shadcn/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { toast } from "@/shadcn/ui/use-toast";
import { CommandLoading } from "cmdk";
import { Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { searchUsers } from "rhythia-api";
import { useDebounce } from "use-debounce";
import { supabase, useProfile } from "../../supabase";
export function Navbar() {
  const { user } = useProfile();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
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
    if (value.length) setLoading(true);
  }, [value]);
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
          <Link to={"/leaderboards"} className="cursor-pointer">
            Leaderboards
          </Link>
          {/* <Link to={"/beatmaps"} className="cursor-pointer hidden md:block">
            Beatmaps
          </Link> */}
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

          {user ? (
            <div className="flex gap-2">
              <Link to="/player">
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
                if (localStorage.getItem("n00b_filter") !== "hexa") {
                  toast({
                    title: "Oops",
                    description: "Login is disabled during development",
                    variant: "destructive",
                  });
                  return;
                }
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
