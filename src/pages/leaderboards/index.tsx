import { Navigate } from "@/router";
import { toast } from "@/shadcn/ui/use-toast";
import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import { MdLeaderboard } from "react-icons/md";
import { Link, useLoaderData } from "react-router-dom";
import { getLeaderboard } from "rhythia-api";

export const Loader = async ({ params }: any) => {
  return await getLeaderboard({
    page: 0,
    session: await getJwt(),
  });
};

export default function LeaderboardPage() {
  const leaders = useLoaderData() as LoaderData<typeof Loader>;
  if (!leaders.leaderboard) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }
  if (!leaders.total) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <MdLeaderboard size={24} />
          <div className="text-2xl font-bold">Leaderboards</div>
        </div>
        <div className="flex text-xs items-center gap-2">
          <div className="flex flex-col items-end">
            <div>
              <Link to={`/player/0`} className="underline">
                You
              </Link>{" "}
              are currently on #1 spot
            </div>
            <div>keep up the good work!</div>
          </div>
          <img
            className="h-11 w-11 mb-2"
            src={"/hello.png"}
            alt="Leaderboard man"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full p-0 px-4 text-sm border-[1px] border-transparent flex justify-between text-neutral-500">
          <div className="flex space-x-4 w-1/2">
            <div className="">Position</div>
          </div>
          <div className="flex space-x-4 w-1/2">
            <div className="w-1/3 text-center">Skill Points</div>
            <div className="w-1/3 text-center">Play count</div>
            <div className="w-1/3 text-center">Total score</div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {leaders.leaderboard.map((e, i) => (
          <div
            key={i}
            className="w-full bg-neutral-900 hover:bg-neutral-800 shadow-md rounded-sm p-1 px-4 text-sm border-[1px] border-neutral-800 flex justify-between items-center"
          >
            <div className="flex space-x-4 w-1/2 items-center">
              <div className="opacity-75 w-10">#{i + 1}</div>
              <img src={`/flags/${e.flag || "US"}.` + "svg"} className="w-7" />
              <Link to={`/player/${e.id}`}>
                <div className="font-bold">{e.username}</div>
              </Link>
            </div>
            <div className="flex space-x-4 w-1/2">
              <div className="font-bold w-1/3 text-center">
                {e.skill_points}
              </div>
              <div className="w-1/3 text-center">{e.play_count}</div>
              <div className="w-1/3 text-center">{e.total_score}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
