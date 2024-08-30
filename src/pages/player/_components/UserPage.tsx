import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";
import { useProfile } from "@/supabase";
import { CatIcon, TrendingUp } from "lucide-react";
import { BsCircleFill, BsStarFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { PiBirdFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { getProfile, getUserScores } from "rhythia-api";
import { EditProfile } from "./EditUser";
type ValueOf<T> = T[keyof T];
type RemoveUndefined<T> = T extends undefined ? never : T;

const badges: Record<string, JSX.Element> = {
  Developer: (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-purple-600 fill-purple-600">
      <BsStarFill size={14} className="faa-spin animated " />
    </div>
  ),
  "Early Bird": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-green-600 fill-green-600">
      <PiBirdFill size={14} className="faa-tada animated" />
    </div>
  ),
  uwu: (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-pink-600 fill-green-600">
      <CatIcon size={14} className="faa-passing animated" />
    </div>
  ),
};
export function UserPage({
  profile,
  scores,
}: {
  profile: Awaited<ReturnType<typeof getProfile>>;
  scores: Awaited<ReturnType<typeof getUserScores>>;
}) {
  const beatmaps = [];
  const me = useProfile();
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  if (!profile.user) {
    return <>User malformed</>;
  }

  return (
    <div className="space-y-3 text-white">
      <div className="max-md:flex-col max-md:items-center w-full bg-neutral-900 shadow-md rounded-sm p-6 text-sm border-[1px] border-neutral-800 flex gap-8">
        <img
          src={profile.user.avatar_url || "https://a.ppy.sh/u/1"}
          onError={(event) => {
            (event.target as HTMLImageElement).src = `https://a.ppy.sh/u/1`;
          }}
          className="h-40 min-w-40 rounded-full border-8 max-md:w-40"
        />

        <div className="flex flex-col h-36 justify-center max-md:items-center">
          <div className="flex gap-4 items-center">
            <div className="text-neutral-100 text-5xl drop-shadow-lg font-bold ">
              {profile.user.username}
            </div>

            {profile.user.verified && (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger className="flex items-center justify-center mt-3">
                    <MdVerified className="fill-white w-8 h-8" />
                  </TooltipTrigger>
                  <TooltipContent>Verified user!</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex gap-5 min-w-[400px] mt-1 max-md:min-w-0 max-md:justify-center">
            <div className="flex gap-2 items-center">
              <img
                src={`/flags/${profile.user.flag || "US"}.` + "svg"}
                className="w-8"
              />
              <div className="text-lg font-semibold text-neutral-300">
                {regionNames.of(profile.user.flag || "US")}
              </div>
              {/*  */}
            </div>
            <div className="flex gap-2 items-center">
              <BsCircleFill className="w-4 h-4 fill-red-600" />
              <div className="text-lg font-semibold text-neutral-300">
                Not online
              </div>
              {/*  */}
            </div>
          </div>
          <div className="flex gap-2 mt-3 max-md:justify-center">
            {(profile.user.badges as Array<string>).map((badge) => {
              return (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>{badges[badge] || <></>}</TooltipTrigger>
                    <TooltipContent>{badge}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          <div className="text-base font-semibold text-neutral-300 mt-2 max-md:text-center">
            Here since:{" "}
            {profile.user.created_at
              ? new Date(profile.user.created_at).toDateString()
              : "the beginning"}
          </div>
        </div>
        <div className="max-md:items-center max-md:h-24 flex flex-col w-full h-40 items-end justify-center text-white">
          <div className="text-neutral-100 text-5xl drop-shadow-lg font-bold">
            #{profile.user.position}
          </div>
          <div className="text-sm">
            Skill Points: {profile.user.skill_points}
          </div>
          {/* <Chart data={chartdata} /> */}
        </div>
      </div>
      <div className="flex gap-3 max-md:flex-col">
        <div className="flex flex-col w-1/4 gap-3 max-md:w-full">
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold">STATS</div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Skill Points:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {profile.user.skill_points}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Play count:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {profile.user.play_count}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Squares hit:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {profile.user.squares_hit}</div>
            </div>
            {/* <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Total score:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {profile.user.total_score}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Beatmaps:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {beatmaps.length}</div>
            </div> */}
          </div>
          {profile.user.uid === me.user?.id && (
            <EditProfile user={profile.user} />
          )}
        </div>
        <div className="flex flex-col gap-3 w-3/4 max-md:w-full">
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold mb-4">
              TOP 10 SCORES
            </div>
            <div className="flex flex-col gap-3">
              {scores.top?.length ? (
                scores.top.map((score) => {
                  return <ProfileScore score={score} />;
                })
              ) : (
                <div className="text-white w-full flex flex-col justify-center items-center gap-2">
                  <img
                    src={"/not_found.png"}
                    width={40}
                    height={40}
                    alt="Notfound"
                  />
                  <div className="opacity-75 italic">No scores submitted</div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold mb-4">
              LAST 10 SCORES
            </div>
            <div className="flex flex-col gap-3">
              {scores.lastDay?.length ? (
                scores.lastDay.map((score) => {
                  return <ProfileScore score={score} />;
                })
              ) : (
                <div className="text-white w-full flex flex-col justify-center items-center gap-2">
                  <img
                    src={"/not_found.png"}
                    width={40}
                    height={40}
                    alt="Notfound"
                  />
                  <div className="opacity-75 italic">No scores submitted</div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold">USER BEATMAPS</div>
            {beatmaps.length ? (
              <div className="w-full grid grid-cols-2 gap-4 pt-4">
                {/* <LikeManager myUUID={user.id} likes={likesMap}>
                    {beatmaps.map((beatmap) => (
                      <BeatmapCard me={user} key={beatmap.id} {...beatmap} />
                    ))}
                  </LikeManager> */}
              </div>
            ) : (
              <div className="text-white w-full flex flex-col justify-center items-center gap-2">
                <img
                  src={"/not_found.png"}
                  width={40}
                  height={40}
                  alt="Notfound"
                />
                <div className="opacity-75 italic">No beatmaps created</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function ProfileScore({
  score,
}: {
  score: ArrayElement<
    RemoveUndefined<Awaited<ReturnType<typeof getUserScores>>["lastDay"]>
  >;
}) {
  if (score.misses == null || !score.beatmapNotes || !score.beatmapDifficulty)
    return <></>;

  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );

  if (score.beatmapDifficulty == 1) {
    difficultyBadge = (
      <div className="bg-green-600 z-10 px-2 rounded-sm border-green-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> EASY
      </div>
    );
  }
  if (score.beatmapDifficulty == 2) {
    difficultyBadge = (
      <div className="bg-yellow-600 z-10 px-2 rounded-sm border-yellow-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> MEDIUM
      </div>
    );
  }
  if (score.beatmapDifficulty == 5) {
    difficultyBadge = (
      <div className="bg-neutral-800 z-10 px-2 rounded-sm border-neutral-700 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> TATSUKETE
      </div>
    );
  }
  if (score.beatmapDifficulty == 3) {
    difficultyBadge = (
      <div className="bg-red-600 z-10 px-2 rounded-sm border-red-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> HARD
      </div>
    );
  }

  const acc = Math.round((1 - score.misses / score.beatmapNotes) * 10000) / 100;
  let letterRank = "F";
  let color = "#ff8282";

  if (acc == 100) {
    letterRank = "SS";
    color = "#91fffa";
  } else if (acc >= 98) {
    letterRank = "S";
    color = "#91fffa";
  } else if (acc >= 95) {
    letterRank = "A";
    color = "#91ff92";
  } else if (acc >= 90) {
    letterRank = "B";
    color = "#e7ffc0";
  } else if (acc >= 85) {
    letterRank = "C";
    color = "#fcf7b3";
  } else if (acc >= 80) {
    letterRank = "D";
    color = "#fcd0b3";
  }
  return (
    <div className="border-[1px] px-4 py-2 rounded-md border-neutral-700 bg-neutral-800">
      <div className="flex gap-2 items-center">
        <div
          className="text-4xl w-14 mr-2 flex items-center justify-center"
          style={{ color }}
        >
          {letterRank}
        </div>

        <div className="w-full">
          <div className="flex w-full justify-between items-center">
            <Link to={`/score/${score.id}`}>
              <div className="font-extrabold text-2xl w-20 flex items-center hover:underline">
                {acc}%
              </div>
            </Link>

            {difficultyBadge}
          </div>
          <div className="flex w-full justify-between items-start">
            <div className="flex flex-col justify-center">
              <Link to={`/maps/${score.beatmapHash}`}>
                <div className="text-base hover:underline">
                  {score.beatmapTitle}
                </div>
              </Link>
              <div className="text-xs text-neutral-400">
                played on {new Date(score.created_at).toUTCString()}
              </div>
            </div>
            {score.awarded_sp ? (
              <div className="bg-transparent z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex items-center justify-start mt-1">
                <TrendingUp className="mr-2 w-4 fill-green-500 text-green-500" />
                <span>{Math.round(score.awarded_sp || 0)}</span>
                <span className="text-xs">pp</span>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
