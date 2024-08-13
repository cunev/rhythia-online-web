import { BsCircleFill, BsStarFill, BsTrophyFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shadcn-react/ui";

export default function UserPage() {
  const beatmaps = [];
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  return (
    <div className="space-y-3 text-white">
      <div className="w-full bg-neutral-900 shadow-md rounded-sm p-6 text-sm border-[1px] border-neutral-800 flex gap-8">
        <img
          src={"https://avatars.githubusercontent.com/u/42537021?v=4"}
          className="h-40 rounded-full border-8"
        />
        <div className="flex flex-col h-36 justify-center min-w-72">
          <div className="flex gap-4 items-center">
            <div className="text-neutral-100 text-5xl drop-shadow-lg font-bold">
              {/* {user.name} */}username
            </div>

            {true && (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <MdVerified className="fill-white w-8 h-8" />
                  </TooltipTrigger>
                  <TooltipContent>Verified user!</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex gap-5">
            <div className="flex gap-2 items-center">
              <img src={`/flags/US.` + "svg"} className="w-8" />
              <div className="text-lg font-semibold text-neutral-300">
                {regionNames.of("US")}
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
          <div className="flex gap-2 mt-3">
            {/* {(fetched.badges as Array<string>).map((badge) => {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger>{badges[badge] || <></>}</TooltipTrigger>
          <TooltipContent>{badge}</TooltipContent>
        </Tooltip>
      );
    })} */}
          </div>
          <div className="text-base font-semibold text-neutral-300 mt-2">
            Player since: {new Date(0).toDateString()}
          </div>
        </div>
        <div className="flex flex-col w-full h-40 items-end justify-center text-white">
          <div className="text-neutral-100 text-5xl drop-shadow-lg font-bold">
            #1
          </div>
          <div className="text-sm">Skill Points: 3239</div>
          {/* <Chart data={chartdata} /> */}
        </div>
      </div>
      <div className="flex gap-3 ">
        <div className="flex flex-col w-1/4 gap-3">
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold">STATS</div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Skill Points:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {3600}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Play count:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {121}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Squares hit:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {365}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Total score:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {24024}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Beatmaps:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {beatmaps.length}</div>
            </div>
          </div>
          {/* {me?.id === user.id && <EditProfile user={user} />} */}
        </div>
        <div className="flex flex-col gap-3 w-3/4">
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold">TOP 10 SCORES</div>
            <div className="text-white w-full flex flex-col justify-center items-center gap-2">
              <img
                src={"/not_found.png"}
                width={40}
                height={40}
                alt="Notfound"
              />
              <div className="opacity-75 italic">No scores submitted</div>
            </div>
          </div>
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold mb-4">
              LAST 24 HOUR SCORES
            </div>
            <div className="flex flex-col gap-3">
              <div className="border-[1px] px-4 py-2 rounded-md border-neutral-700 bg-neutral-800">
                <div className="flex w-full justify-between items-center">
                  <div className="font-extrabold text-2xl w-20 flex items-center">
                    97.48%
                  </div>

                  <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
                    <BsStarFill /> LOGIC
                  </div>
                </div>
                <div className="flex w-full justify-between">
                  <div className="flex flex-col justify-center">
                    <Link to={`/beatmaps/1`}>
                      <div className="text-base hover:underline">
                        Sample Map - Title
                      </div>
                    </Link>
                    <div className="text-xs text-neutral-400">
                      played on 24.06.2024 at 23:00
                    </div>
                  </div>
                  <div className="flex gap-2 items-center font-bold">
                    242 SP
                    <BsTrophyFill />
                  </div>
                </div>
              </div>
              <div className="border-[1px] px-4 py-2 rounded-md border-neutral-700 bg-neutral-800">
                <div className="flex w-full justify-between items-center">
                  <div className="font-extrabold text-2xl w-20 flex items-center">
                    97.48%
                  </div>

                  <div className="bg-red-600 z-10 px-2 rounded-sm border-red-500 border-[1px] font-bold flex gap-2 items-center">
                    <BsStarFill /> HARD
                  </div>
                </div>
                <div className="flex w-full justify-between">
                  <div className="flex flex-col justify-center">
                    <Link to={`/beatmaps/1`}>
                      <div className="text-base hover:underline">
                        Sample Map - Title
                      </div>
                    </Link>
                    <div className="text-xs text-neutral-400">
                      played on 24.06.2024 at 23:00
                    </div>
                  </div>
                  <div className="flex gap-2 items-center font-bold">
                    242 SP
                    <BsTrophyFill />
                  </div>
                </div>
              </div>
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
