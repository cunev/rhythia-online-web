import { getJwt, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import { FaDownload, FaVoteYea } from "react-icons/fa";
import { ImHammer } from "react-icons/im";
import { PiTrophyFill } from "react-icons/pi";
import { Link, useLoaderData } from "react-router-dom";
import {
  approveMap,
  getBeatmapPage,
  getProfile,
  nominateMap,
} from "rhythia-api";
import dayjs from "dayjs";
import { BsStarFill } from "react-icons/bs";
import { ArrowRight, Dot, Star } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Progress } from "@/shadcn/ui/progress";
import { MdApproval } from "react-icons/md";
import { toast } from "@/shadcn/ui/use-toast";
export const Loader = async ({ params }: any) => {
  return {
    getBeatmap: await getBeatmapPage({
      id: Number(params.id),
      session: await getJwt(),
    }),
  };
};

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export default function UserProfile() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const { userProfile } = useProfile();
  if (!loaderData.getBeatmap.beatmap) return;

  const map = loaderData.getBeatmap.beatmap;

  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );
  if (map.difficulty == 0) {
    difficultyBadge = (
      <div className="bg-neutral-600 z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> N/A
      </div>
    );
  }
  if (map.difficulty == 1) {
    difficultyBadge = (
      <div className="bg-green-600 z-10 px-2 rounded-sm border-green-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> EASY
      </div>
    );
  }
  if (map.difficulty == 2) {
    difficultyBadge = (
      <div className="bg-yellow-600 z-10 px-2 rounded-sm border-yellow-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> MEDIUM
      </div>
    );
  }
  if (map.difficulty == 5) {
    difficultyBadge = (
      <div className="bg-neutral-800 z-10 px-2 rounded-sm border-neutral-700 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> TASUKETE
      </div>
    );
  }
  if (map.difficulty == 3) {
    difficultyBadge = (
      <div className="bg-red-600 z-10 px-2 rounded-sm border-red-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> HARD
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-neutral-900 overflow-hidden shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-col ">
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={map.image || ""}
            alt=""
            className="absolute min-w-[400px] w-full resize-x opacity-45 -translate-y-1/4"
          />
          <div className="flex items-center gap-2 absolute left-2 top-2 ">
            {map.status == "RANKED" ? (
              <div className="bg-blue-600 z-10 px-2 rounded-sm border-blue-500 border-[1px] font-bold flex gap-2 items-center">
                <PiTrophyFill />
                RANKED
              </div>
            ) : map.status == "APPROVED" ? (
              <div className="bg-yellow-600 z-10 px-2 rounded-sm border-yellow-500 border-[1px] font-bold flex gap-2 items-center">
                <PiTrophyFill />
                LEGACY
              </div>
            ) : (
              <div className="bg-gray-600 z-10 px-2 rounded-sm border-gray-500 border-[1px] font-bold flex gap-2 items-center">
                <ImHammer />
                UNRANKED
              </div>
            )}
            {difficultyBadge}
          </div>

          <div className="flex flex-col absolute right-2 top-2 gap-1 justify-end items-end">
            <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {Math.round((map.starRating || 0) * 100) / 100}
              <Star className="h-4" />
            </div>
            <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {map.playcount} plays
            </div>
          </div>

          <div className="flex absolute bottom-4 left-4 flex-col justify-end">
            <div className="text-3xl font-bold h-8 text-shadow shadow-neutral-900">
              {map.title}
            </div>
          </div>
        </div>
        <div className="p-4 flex justify-between border-t-[1px] border-t-neutral-800 items-center">
          <div className="flex items-center gap-2">
            <Link to={`/player/${map.owner}`}>
              <img
                src={map.ownerAvatar || ""}
                alt=""
                className="rounded-full border-8 border-neutral-800 w-16 h-16"
              />
            </Link>
            <div className="flex flex-col items-start h-full justify-center text-xs text-shadow shadow-neutral-900 text-neutral-400">
              <Link to={`/player/${map.owner}`}>
                <div>
                  Mapped by{" "}
                  <span className="text-purple-400">{map.ownerUsername}</span>
                </div>
              </Link>
              <div>
                Posted on{" "}
                <span className="text-white">
                  {dayjs(map.created_at).format("MM.DD.YYYY")}
                </span>
              </div>
              <div>
                Updated on{" "}
                <span className="text-white">
                  {dayjs(map.created_at).format("MM.DD.YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={async () => {
                const res = await nominateMap({
                  session: await getJwt(),
                  mapId: map.id!,
                });
                if (res.error) {
                  toast({
                    title: "Oops",
                    description: res.error,
                    variant: "destructive",
                  });
                  return;
                }
                document.location.reload();
              }}
              disabled={
                !userProfile?.badges.includes("RCT") ||
                map.status == "RANKED" ||
                (map.nominations as number[]).length >= 2
              }
            >
              <FaVoteYea className="mr-2 h-3 w-3" />
              Nominate
            </Button>
            <Button
              variant="secondary"
              disabled={
                !userProfile?.badges.includes("MMT") ||
                map.status == "RANKED" ||
                map.status == "APPROVED"
              }
              onClick={async () => {
                const res = await approveMap({
                  session: await getJwt(),
                  mapId: map.id!,
                });
                if (res.error) {
                  toast({
                    title: "Oops",
                    description: res.error,
                    variant: "destructive",
                  });
                  return;
                }
                document.location.reload();
              }}
            >
              <MdApproval className="mr-2 h-3 w-3" />
              Approve
            </Button>

            <a href={map.beatmapFile || ""} target="__blank">
              <Button variant="secondary">
                <FaDownload className="mr-2 h-3 w-3" />
                Download
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 px-8 text-sm border-[1px] border-neutral-800 flex justify-between items-center">
        <div className="flex gap-2 items-end">
          <div className="flex flex-col gap-2">
            <div className="opacity-75 font-bold flex gap-3 justify-center items-center">
              <FaVoteYea />
              {2 - (map.nominations?.length || 0)} more nominations required.
            </div>
            <Progress
              value={(map.nominations?.length || 0) * 50}
              max={2}
              className="w-64"
            />
          </div>
          <ArrowRight className="w-4" />
          <div className="flex flex-col gap-2">
            <div className="opacity-75 font-bold flex gap-3 justify-center items-center">
              <MdApproval />1 approval required.
            </div>
            <Progress
              value={map.status == "RANKED" ? 100 : 0}
              max={1}
              className="w-64"
            />
          </div>
        </div>

        {map.status !== "RANKED" && (
          <div className="flex text-xs items-center gap-2">
            <div className="flex flex-col items-end">
              <div>This beatmap is currently unranked, to be able</div>
              <div>
                to earn rhythm points it should be nominated and approved.
              </div>
            </div>
            <img
              className="h-11 w-11 mb-2"
              src={"/help.png"}
              alt="Help man"
            ></img>
          </div>
        )}
      </div>
    </div>
  );
}
