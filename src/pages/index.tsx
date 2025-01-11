import { Button } from "@/shadcn/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { supabase, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import { CommandLoading } from "cmdk";
import { ChevronRight, Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { SiWindows11 } from "react-icons/si";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getPublicStats, searchUsers } from "rhythia-api";
import { useDebounce } from "use-debounce";
import { BeatmapCard } from "./maps/_components/BeatmapCard";

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export const Loader = async ({ params }: any) => {
  return await getPublicStats({});
};

export default function Home() {
  const me = useProfile();
  const stats = useLoaderData() as LoaderData<typeof Loader>;
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<Awaited<ReturnType<typeof searchUsers>>>(
    {}
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
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
    <div className="flex flex-col gap-4 text-white ">
      <img
        src={"/mascot-christmas.png"}
        width={400}
        alt=""
        className="absolute z-10 top-12 ml-14 max-md:hidden"
      />
      <div className="relative overflow-hidden h-96 max-md:h-64">
        <video
          src="https://static.rhythia.com/bg.mp4#t=10"
          className="mt-[-100px] max-md:mt-[-50px]"
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute top-0 w-full h-full bg-neutral-900 opacity-70"></div>
        <div className="absolute top-0 w-full h-full z-10 flex flex-col items-end justify-center p-10 ">
          <div className="text-2xl font-bold">
            the most fun rhythm game is now online
          </div>
          <div className="text-2xl font-thin">start playing now!</div>
          {me.user ? (
            <Link to={`/player`} className="cursor-pointer">
              <button className="w-48 h-14 border-[1px] max-md:border-2 max-md:border-white mt-8 rounded-md hover:border-neutral-500 transition-all">
                Go to your profile
              </button>
            </Link>
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
              className="w-48 h-14 border-[1px] mt-8 rounded-md hover:border-neutral-500 transition-all"
            >
              Sign up now
            </button>
          )}
        </div>
      </div>
      <Link
        to={
          "https://github.com/cunev/rhythia-online-release/releases/download/development/rhythia-online.zip"
        }
      >
        <div className="bg-[url(/bgdownload.png)] h-36 rounded-md border-[1px] border-neutral-800 relative overflow-hidden flex flex-col justify-center px-8">
          <img
            src="/magic.png"
            alt=""
            className="absolute w-[400px] -right-12 top-1/2 -translate-y-1/2"
          />
          <div className="text-xl font-extrabold">You have been invited to</div>
          <div className="flex gap-2 items-center">
            <div className="text-2xl font-normal cursor-pointer">
              Download public beta version
            </div>
            <ExternalLink />
          </div>
        </div>
      </Link>

      <div className="w-full flex gap-4 max-md:flex-col-reverse">
        <div className="flex flex-col gap-4 w-full">
          <div className="font-bold text-xl text-neutral-200">About</div>
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-200 font-normal">
              Rhythia Online is the standalone hub for rhythia, a modern yet
              familiar online rhythm game. View your stats, scores and
              leaderboards here! Enter a username above to view it, or check out
              some of the shortcuts below.
            </div>
          </div>
          <div className="font-bold text-xl text-neutral-200">
            Latest ranked maps
          </div>
          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            {stats.lastBeatmaps.map((e) => (
              <div>
                <BeatmapCard {...(e as any)} url={e.beatmapFile} />
              </div>
            ))}
          </div>

          <div
            onClick={() => {
              navigate("/maps");
            }}
            className="text-neutral-400 transition-all hover:cursor-pointer hover:text-neutral-100 w-full items-center font-bold bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 flex justify-between"
          >
            View more maps
            <ChevronRight />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-1/2 max-md:w-full">
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold">LINKS</div>
            <a
              href="https://github.com/cunev/rhythia-online-release/releases/download/development/rhythia-online.zip"
              className="flex p-3 border-[1px] rounded-md w-full mt-2 text-white items-center gap-3 border-neutral-600 hover:border-neutral-500 transition-all "
            >
              <Download className="fill-white w-6 h-6" />
              Download Online
            </a>
            <a
              href="https://github.com/David20122/sound-space-plus/releases"
              className="flex p-3 border-[1px] rounded-md w-full mt-2 text-white items-center gap-3 border-neutral-600 hover:border-neutral-500 transition-all "
            >
              <Download className="fill-white w-6 h-6" />
              Download Stable
            </a>
            <a
              href="https://discord.com/invite/rhythia"
              className="flex p-3 border-[1px] rounded-md w-full mt-2 text-white items-center gap-3 border-neutral-600 hover:border-neutral-500 transition-all "
            >
              <BsDiscord className="fill-white w-6 h-6" />
              Join our Discord
            </a>
          </div>
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 ">
            <div className="text-neutral-500 font-extrabold">STATS</div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Online players:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {stats.onlineUsers}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Total players:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {stats.profiles}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Scores submitted:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {stats.scores}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Beatmaps:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {stats.beatmaps}</div>
            </div>
          </div>

          <div className=" bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 flex flex-col items-center gap-4">
            <div className="w-full flex items-end justify-center gap-5">
              {stats.topUsers.map((e, i) => (
                <div className="flex flex-col gap-2 items-center">
                  <img
                    src={e.avatar_url || "https://a.ppy.sh/u/1"}
                    onError={(event) => {
                      (
                        event.target as HTMLImageElement
                      ).src = `https://a.ppy.sh/u/1`;
                    }}
                    className="max-h-20 max-w-20 w-20 h-20 rounded-full border-8  object-cover"
                  />
                  <div className="bg-neutral-800 px-4 py-1 border-[1px] border-neutral-700 rounded-md text-center w-full">
                    #{i + 1}{" "}
                    <span
                      onClick={() => {
                        navigate("/player/" + e.id);
                      }}
                      className="font-semibold text-purple-400 cursor-pointer"
                    >
                      {e.username.slice(0, 8)}
                    </span>
                  </div>
                  <div className="rounded-md text-center w-full">
                    <span className="font-bold">
                      {Math.round(e.skill_points)}
                    </span>
                    rp
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full h-[1px] bg-neutral-800" />
            <div
              onClick={() => {
                navigate("/leaderboards");
              }}
              className="text-neutral-400 hover:text-neutral-100 cursor-pointer flex gap-1 items-center"
            >
              View leaderboards <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
