import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import { FaDownload } from "react-icons/fa";
import { ImHammer } from "react-icons/im";
import { PiTrophyFill } from "react-icons/pi";
import { Link, useLoaderData } from "react-router-dom";
import { getBeatmapPage, getProfile } from "rhythia-api";
import dayjs from "dayjs";
import { BsStarFill } from "react-icons/bs";
import { Star } from "lucide-react";
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
  console.log(loaderData);
  if (!loaderData.getBeatmap.beatmap) return;

  const map = loaderData.getBeatmap.beatmap;

  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );

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
    <div className="w-full">
      <div className="bg-neutral-900 overflow-hidden shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-col">
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={map.image || ""}
            alt=""
            className="absolute min-w-[400px] w-full resize-x opacity-45 -translate-y-1/4"
          />
          <div className="flex items-center gap-2 absolute left-2 top-2 ">
            {map.ranked ? (
              <div className="bg-blue-600 z-10 px-2 rounded-sm border-blue-500 border-[1px] font-bold flex gap-2 items-center">
                <PiTrophyFill />
                RANKED
              </div>
            ) : (
              <div className="bg-gray-600 z-10 px-2 rounded-sm border-gray-500 border-[1px] font-bold flex gap-2 items-center">
                <ImHammer />
                UNRANKED
              </div>
            )}
            {difficultyBadge}
            <a href={map.beatmapFile || ""} target="__blank" className="ml-4">
              <FaDownload />
            </a>
          </div>

          <div className="flex flex-col absolute right-2 top-2 gap-1 justify-end items-end">
            <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {Math.round((map.starRating || 0) * 100) / 100}
              <Star className="h-4" />
            </div>
            <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {map.playcount} plays
            </div>

            {/* <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {beatmap.likesCount} <RiHeartFill />
            </div> */}
          </div>

          <div className="flex absolute bottom-4 left-4 flex-col justify-end">
            <div className="text-3xl font-bold h-8 text-shadow shadow-neutral-900">
              {map.title}
            </div>
          </div>
        </div>
        <div className="p-4 flex justify-between border-t-[1px] border-t-neutral-800">
          <div className="flex items-center gap-2">
            <Link to={`/player/${map.owner}`}>
              <img
                src={map.ownerAvatar || ""}
                alt=""
                className="rounded-full border-8 border-neutral-800 w-16"
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

          {!map.ranked && (
            <div className="flex text-xs items-center gap-2">
              <div className="flex flex-col items-end">
                <div>This beatmap is currently unranked, to be able</div>
                <div>
                  to earn skill points it should be approved by a nominator.
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
    </div>
  );
}
