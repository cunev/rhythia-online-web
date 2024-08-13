import { MdLeaderboard } from "react-icons/md";
import { Link } from "react-router-dom";

export default function LeaderboardPage() {
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
        {new Array(25).fill(0).map((e, i) => (
          <div
            key={i}
            className="w-full bg-neutral-900 hover:bg-neutral-800 shadow-md rounded-sm p-1 px-4 text-sm border-[1px] border-neutral-800 flex justify-between items-center"
          >
            <div className="flex space-x-4 w-1/2 items-center">
              <div className="opacity-75 w-10">#{i + 1}</div>
              <img src={`/flags/US.` + "svg"} className="w-7" />
              <Link to={`/player/${0}`}>
                <div className="font-bold">Developer</div>
              </Link>
            </div>
            <div className="flex space-x-4 w-1/2">
              <div className="font-bold w-1/3 text-center">201</div>
              <div className="w-1/3 text-center">1502</div>
              <div className="w-1/3 text-center">25401</div>
            </div>
          </div>
        ))}
      </div>
      <button className="">Next page</button>
    </div>
  );
}
