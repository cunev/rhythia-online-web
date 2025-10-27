import { supabase, useProfile } from "@/supabase";
import { ChevronRight, Download } from "lucide-react";
import { BsDiscord } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { getPublicStats } from "rhythia-api";
import { isMobile } from "react-device-detect";
import { BeatmapCard } from "./maps/_components/BeatmapCard";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shadcn/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { RctBanner } from "./maps/_components/RctBanner";
const chartConfig = {
  value: {
    label: "Players",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;
export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;
import { useAsync } from "react-async";
import { useCallback, useEffect } from "react";

export default function Home() {
  const me = useProfile();
  const loadStats = useCallback(async () => await getPublicStats({}), []);
  const { data: stats, isPending, error, run: runStats } = useAsync({
    deferFn: loadStats,
  });
  useEffect(() => {
    runStats();
  }, [runStats]);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 text-white ">
      <div
        style={{
          background:
            "url(/dots.png), linear-gradient(to right, #1d1023, #311c44)",
        }}
        className="relative rounded-md w-full mb-4 md:h-48 p-4 md:p-0"
      >
        <img
          src="/rhythia-steam.png"
          id="albumcover"
          alt="Rhythia on Steam"
          className="rounded-lg"
        />

        <div className="flex flex-col md:ml-[15rem] py-4 md:py-6 gap-2 pr-2 items-center md:items-start text-center md:text-left">
          <div className="font-black text-xl sm:text-2xl text-purple-200">
            Rhythia is coming to Steam Platform
          </div>
          <div className="font-medium text-purple-300 text-sm sm:text-base">
            We're happy to announce that Rhythia will be launched on Steam
            Platform in December of 2025. You can wishlist the game now!
          </div>
          <a
            href="https://store.steampowered.com/app/2250500/Rhythia/"
            target="_blank"
            className="bg-[#71b02e] w-full sm:w-64 md:w-52 rounded px-3 py-2 text-center font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            Wishlist on Steam
          </a>
        </div>
      </div>

      <img
        src={"/mascot.png"}
        width={400}
        alt=""
        className="absolute z-10 top-72 ml-14 max-md:hidden"
      />
      <div className="relative overflow-hidden h-96 max-md:h-64">
        {!isMobile && (
          <video
            src="https://static.rhythia.com/bg.mp4#t=10"
            className="mt-[-100px] max-md:hidden"
            autoPlay
            muted
            loop
          ></video>
        )}

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
          <div className="font-bold text-xl text-neutral-200">Applications</div>
          <div className="font-bold text-xl text-neutral-200">
            Latest ranked maps
          </div>
          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            {isPending && (
              <div className="text-neutral-400">Loading stats...</div>
            )}
            {!isPending &&
              stats?.lastBeatmaps?.map((e) => (
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
            <Link
              to={"/downloads"}
              className="flex p-3 border-[1px] rounded-md w-full mt-2 text-white items-center gap-3 border-neutral-600 hover:border-neutral-500 transition-all "
            >
              <Download className="fill-white w-6 h-6" />
              Download
            </Link>
            <a
              href="https://discord.com/invite/rhythia"
              className="flex p-3 border-[1px] rounded-md w-full mt-2 text-white items-center gap-3 border-neutral-600 hover:border-neutral-500 transition-all "
            >
              <BsDiscord className="fill-white w-6 h-6" />
              Join our Discord
            </a>
          </div>
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 ">
            {isPending ? (
              <div className="text-neutral-400 mb-3">Loading stats...</div>
            ) : (
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={(stats as any)?.countChart || []}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="id"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => ""}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="value"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            )}
            <div className="text-neutral-500 font-extrabold">STATS</div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Online players:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className="">
                {" "}
                {isPending ? "Loading..." : stats?.onlineUsers}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Total players:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className="">
                {" "}
                {isPending ? "Loading..." : stats?.profiles}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Scores submitted:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className="">
                {" "}
                {isPending ? "Loading..." : stats?.scores}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Beatmaps:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className="">
                {" "}
                {isPending ? "Loading..." : stats?.beatmaps}
              </div>
            </div>
          </div>

          <div className=" bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 flex flex-col items-center gap-4">
            <div className="w-full flex items-end justify-center gap-5">
              {isPending && (
                <div className="text-neutral-400">Loading stats...</div>
              )}
              {!isPending &&
                stats?.topUsers?.map((e, i) => (
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
