import { Clock, Star } from "lucide-react";
import { BsStarFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { ImHammer } from "react-icons/im";
import { MdDelete, MdFolderDelete } from "react-icons/md";
import { PiTrophyFill } from "react-icons/pi";
import { Link } from "react-router-dom";

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function BeatmapCard(props: {
  difficulty: number;
  playcount: number;
  status: string;
  title: string;
  image: string;
  owner: number;
  ownerUsername: string;
  id: number;
  starRating: number;
  length: number;
  url: string;
  onRemove?: () => void;
}) {
  const {
    difficulty,
    status,
    playcount,
    owner,
    ownerUsername,
    id,
    starRating,
    length,
    url,
    onRemove,
  } = props;
  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );

  if (difficulty == 0) {
    difficultyBadge = (
      <div className="bg-neutral-600 z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> N/A
      </div>
    );
  }
  if (difficulty == 1) {
    difficultyBadge = (
      <div className="bg-green-600 z-10 px-2 rounded-sm border-green-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> EASY
      </div>
    );
  }
  if (difficulty == 2) {
    difficultyBadge = (
      <div className="bg-yellow-600 z-10 px-2 rounded-sm border-yellow-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> MEDIUM
      </div>
    );
  }
  if (difficulty == 5) {
    difficultyBadge = (
      <div className="bg-neutral-800 z-10 px-2 rounded-sm border-neutral-700 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> TASUKETE
      </div>
    );
  }
  if (difficulty == 3) {
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
          src={props.image}
          className="absolute min-w-[400px] min-h-full resize-x w-full opacity-45"
          onError={(event) => {
            (event.target as HTMLImageElement).src = `/unkimg.png`;
          }}
        />
        <div className="flex gap-2 absolute left-2 top-2 ">
          {status == "RANKED" ? (
            <div className="bg-blue-600 z-10 px-2 rounded-sm border-blue-500 border-[1px] font-bold flex gap-2 items-center">
              <PiTrophyFill />
              RANKED
            </div>
          ) : status == "APPROVED" ? (
            <div className="bg-orange-600 z-10 px-2 rounded-sm border-orange-500 border-[1px] font-bold flex gap-2 items-center">
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
        <Link
          to={`/maps/${id}`}
          className="flex flex-col absolute left-2 bottom-2 gap-[-4px] justify-end"
        >
          <div className="text-xl font-bold h-6 text-shadow shadow-neutral-900">
            {props.title}
          </div>
        </Link>
        <div className="flex flex-col absolute right-2 top-2 gap-1 justify-end items-end">
          {/* <=5 digits, X plays */}
          {/* 6 digits, X.X mil. plays */}
          <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center ">
            {Math.round((starRating || 0) * 100) / 100}
            <Star className="h-4 w-4" />
          </div>
          <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center ">
            {formatTime(length)}
            <Clock className="h-4 w-4" />
          </div>
          <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center ">
            {playcount} plays
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-900 p-2 px-4 italic flex justify-between border-t-neutral-800 border-t-[1px]">
        <Link to={`/player/${owner}`}>
          Created by{" "}
          <span className="font-bold not-italic text-purple-400">
            {ownerUsername}
          </span>
        </Link>
        <div className="flex gap-4">
          {onRemove && (
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => {
                onRemove();
              }}
            >
              <MdDelete />
            </div>
          )}
          <div className="flex items-center gap-4">
            <a href={url} target="__blank">
              <FaDownload />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
