import { Navigate } from "@/router";
import { toast } from "@/shadcn/ui/use-toast";
import { getJwt, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import { MdLeaderboard } from "react-icons/md";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { getLeaderboard } from "rhythia-api";
import { GiPoliceBadge } from "react-icons/gi";
import Pagination from "./pagiantions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { countryList } from "./countryLists";
import { IoMdBrush } from "react-icons/io";
import useLocalStorage from "use-local-storage";
import { BsHeartFill } from "react-icons/bs";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function Leaders({
  leaders,
  currentFlag,
}: {
  leaders: Awaited<ReturnType<typeof getLeaderboard>>;
  currentFlag?: string;
}) {
  const { userProfile } = useProfile();
  const [isSpin, _] = useLocalStorage("spin", false);

  const navigate = useNavigate();
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
      <div className="flex justify-between items-center max-md:justify-start max-md:flex-col max-md:items-start">
        <div className="flex flex-col gap-4">
          <div className="flex space-x-2 items-center">
            <MdLeaderboard size={24} />
            <div className="text-2xl font-bold">Leaderboards</div>
          </div>
          <div className="flex gap-2 max-md:flex-col">
            <Link to={`/leaderboards/mods`}>
              <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
                <GiPoliceBadge />
                Developers and Moderators
              </div>
            </Link>
            <Link to={`/maps/find`}>
              <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
                <IoMdBrush />
                Map Management
              </div>
            </Link>
          </div>
        </div>

        {leaders.userPosition ? (
          <div className="flex text-xs items-center gap-2 max-md:flex-row-reverse">
            <div className="flex flex-col items-end max-md:text-left max-md:items-start">
              <div>
                <Link to={`/player/${userProfile!.id}`} className="underline">
                  You
                </Link>{" "}
                are currently on #{leaders.userPosition} spot
              </div>
              <div>keep up the good work!</div>
            </div>
            <img
              className="h-11 w-11 mb-2"
              src={"/hello.png"}
              alt="Leaderboard man"
            />
          </div>
        ) : (
          <div className="flex text-xs items-center gap-2">
            <div className="flex flex-col items-end">
              <div>
                Please{" "}
                <Link to={`/`} className="underline">
                  log in
                </Link>{" "}
                to see your position
              </div>
              <div>on this leaderboard!</div>
            </div>
            <img
              className="h-11 w-11 mb-2"
              src={"/hello.png"}
              alt="Leaderboard man"
            />
          </div>
        )}
      </div>
      <hr />

      <div className="flex gap-2 items-center">
        <Select
          defaultValue={currentFlag}
          onValueChange={(value) => {
            navigate("/leaderboards/" + value.trim());
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={" "}>Global</SelectItem>
            {countryList.map((cnt) => (
              <SelectItem value={cnt}>{regionNames.of(cnt || "US")}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={isSpin ? "true" : "false"}
          onValueChange={(value) => {
            localStorage["spin"] = value === "true";
            location.reload();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"false"}>All scores</SelectItem>
            <SelectItem value={"true"}>Spin scores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="w-full p-0 px-4 text-sm border-[1px] border-transparent flex justify-between text-neutral-500">
          <div className="flex space-x-4 w-1/2">
            <div className="">Position</div>
          </div>
          <div className="flex space-x-4 w-1/3">
            <div className="w-1/2 text-center">Skill Points</div>
            <div className="w-1/2 text-center">Play count</div>
          </div>
        </div>
      </div>
      <div className="space-y-2 bg-neutral-950">
        {leaders.leaderboard.map((e, i) => {
          return (
            <div
              key={i}
              className="w-full bg-neutral-900 hover:bg-neutral-800 shadow-md rounded-sm p-1 px-4 text-sm border-[1px] border-neutral-800  flex justify-between items-center relative"
              style={{
                borderColor: e.verified ? "rgb(22 101 52)" : undefined,
              }}
            >
              {e.verified && (
                <BsHeartFill
                  className="text-green-800 absolute right-2 top-1/2 -translate-y-1/2 faa-pulse animated"
                  opacity={0.4}
                  size={32}
                />
              )}
              <div className="flex space-x-4 w-1/2 items-center">
                <div className="opacity-75 min-w-10 ">
                  {(e.skill_points || 0) > 0
                    ? `#${
                        i + 1 + leaders.viewPerPage * (leaders.currentPage - 1)
                      }`
                    : "-"}
                </div>
                <Link to={`/leaderboards/${e.flag}`}>
                  <img
                    src={`/flags/${e.flag || "US"}.` + "svg"}
                    className="min-w-8"
                  />
                </Link>

                <Link to={`/player/${e.id}`}>
                  <div className="font-bold">
                    {e.clans && (
                      <span className="cursor-pointer font-extrabold mr-1 text-indigo-500">
                        [{e.clans.acronym}]
                      </span>
                    )}
                    {e.username}
                  </div>
                </Link>
              </div>
              <div className="flex space-x-4 w-1/3">
                <div className="font-bold w-1/2 text-center">
                  {isSpin ? e.spin_skill_points : e.skill_points}
                </div>
                <div className="w-1/2 text-center">{e.play_count}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination
        currentPage={leaders.currentPage}
        totalItems={leaders.total}
        viewPerPages={leaders.viewPerPage}
      />
    </div>
  );
}
