import { supabase, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import { ChevronRight, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { getPublicStats, searchUsers } from "rhythia-api";
import { isMobile } from "react-device-detect";
import { useDebounce } from "use-debounce";
import { BeatmapCard } from "./maps/_components/BeatmapCard";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shadcn/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { RctBanner } from "./maps/_components/RctBanner";

function BadgeHuntAnnouncement() {
  const [timeLeft, setTimeLeft] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const targetDate = new Date("2025-09-11T00:00:00Z").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Event has ended!");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={() => navigate("/hunt")}
      className="w-full bg-gradient-to-r from-neutral-800 to-neutral-850 shadow-md rounded-sm p-6 text-sm border-[1px] border-neutral-700 cursor-pointer hover:from-neutral-750 hover:to-neutral-800 transition-all"
    >
      <div className="flex items-center justify-between max-md:flex-col max-md:gap-2">
        <div>
          <div className="text-white font-bold text-lg mb-1">
            Rhythia Badge Hunt 2025
          </div>
          <div className="text-neutral-300">
            Discover and unlock exclusive badges by completing challenges!
          </div>
        </div>
        <div className="text-right max-md:text-center">
          <div className="text-white font-bold">Next Badge Drop:</div>
          <div className="text-amber-300 font-mono text-lg">{timeLeft}</div>
        </div>
      </div>
    </div>
  );
}
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

export const Loader = async () => {
  return await getPublicStats({});
};

export default function Home() {
  const me = useProfile();
  const stats = useLoaderData() as LoaderData<typeof Loader>;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 text-white ">
      <img
        src={"/mascot.png"}
        width={400}
        alt=""
        className="absolute z-10 top-12 ml-14 max-md:hidden"
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
          <BadgeHuntAnnouncement />
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
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={stats.countChart}
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
