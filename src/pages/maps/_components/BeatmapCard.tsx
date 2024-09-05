import { BsStarFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { ImHammer } from "react-icons/im";
import { PiTrophyFill } from "react-icons/pi";
import { RiHeartFill } from "react-icons/ri";
import { Link } from "react-router-dom";

export function BeatmapCard(props: {
  difficulty: string;
  status: string;
  title: string;
  artist: string;
}) {
  const { difficulty, status } = props;
  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );

  if (difficulty == "easy") {
    difficultyBadge = (
      <div className="bg-green-600 z-10 px-2 rounded-sm border-green-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> EASY
      </div>
    );
  }
  if (difficulty == "medium") {
    difficultyBadge = (
      <div className="bg-yellow-600 z-10 px-2 rounded-sm border-yellow-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> MEDIUM
      </div>
    );
  }
  if (difficulty == "tasukete") {
    difficultyBadge = (
      <div className="bg-neutral-800 z-10 px-2 rounded-sm border-neutral-700 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> TASUKETE
      </div>
    );
  }
  if (difficulty == "hard") {
    difficultyBadge = (
      <div className="bg-red-600 z-10 px-2 rounded-sm border-red-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> HARD
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 overflow-hidden shadow-lg rounded-sm text-sm border-[1px] border-neutral-800 flex flex-col">
      <div className="relative w-full h-32 overflow-hidden">
        <img
          src={""}
          alt=""
          className="absolute min-w-[400px] min-h-full resize-x opacity-45"
        />
        <div className="flex gap-2 absolute left-2 top-2 ">
          {status === "ranked" ? (
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
        </div>
        <Link
          to={`/beatmaps/0`}
          className="flex flex-col absolute left-2 bottom-2 gap-[-4px] justify-end"
        >
          <div className="text-2xl font-bold h-6 text-shadow shadow-neutral-900">
            {props.title}
          </div>
          <div className="text-lg h-6 text-shadow shadow-neutral-900">
            {props.artist}
          </div>
        </Link>
        <div className="flex flex-col absolute right-2 top-2 gap-1 justify-end items-end">
          {/* <=5 digits, X plays */}
          {/* 6 digits, X.X mil. plays */}
          <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center">
            11,345 plays
          </div>
          <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center h-[22px]">
            <div className="translate-y-[1px]">
              {/* <Odometer
                value={likesManager.likes?.[props.id]?.count || 0}
                format="(,ddd)"
              /> */}
            </div>
            <RiHeartFill />
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-900 p-2 px-4 italic flex justify-between border-t-neutral-800 border-t-[1px]">
        <Link to={`/player/0`}>
          Created by{" "}
          <span className="font-bold not-italic text-purple-400">takeshix</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* <Like beatmapId={props.id} myUuid={props.me.id} /> */}
          <a href={""} target="__blank">
            <FaDownload />
          </a>
        </div>
      </div>
    </div>
  );
}
