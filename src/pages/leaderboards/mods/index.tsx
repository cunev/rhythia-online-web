import { LoaderData } from "@/types";
import { Link, useLoaderData } from "react-router-dom";
import { getBadgedUsers } from "rhythia-api";

export const Loader = async () => {
  return {
    dev: await getBadgedUsers({
      badge: "Developer",
    }),
    moderator: await getBadgedUsers({
      badge: "Global Moderator",
    }),
  };
};

export default function Criteria() {
  const leaders = useLoaderData() as LoaderData<typeof Loader>;

  return (
    <div className="space-y-5 text-neutral-300">
      <img
        src={"/addmascot.png"}
        width={500}
        alt=""
        className="absolute z-10 top-20 ml-14 select-none"
      />
      <div className="relative overflow-hidden h-36 rounded-md border-[1px] border-neutral-800 text-white">
        <video
          src="https://static.rhythia.com/bg.mp4#t=10"
          className="mt-[-200px] max-md:hidden"
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute top-0 w-full h-full bg-neutral-900 opacity-70"></div>
        <div className="absolute top-0 w-full h-full z-10 flex flex-col items-end justify-center p-10">
          <div className="text-2xl font-bold">Developers and Moderators</div>
          <div className="text-xl font-thin">
            List of people that will help you with any issue you enounter
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold -600 mb-4 text-white">
        List of Developers
      </h1>

      <div className="space-y-2">
        {leaders.dev.leaderboard!.map((e, i) => {
          return (
            <div
              key={i}
              className="w-full bg-neutral-900 hover:bg-neutral-800 shadow-md rounded-sm p-1 px-4 text-sm border-[1px] border-neutral-800 flex justify-between items-center"
            >
              <div className="flex space-x-4 w-1/2 items-center">
                <img
                  src={`/flags/${e.flag || "US"}.` + "svg"}
                  className="w-8"
                />
                <Link to={`/player/${e.id}`}>
                  <div className="font-bold">{e.username}</div>
                </Link>
              </div>
              <div className="flex space-x-4 ">
                <div className="w-1/2 text-center text-indigo-500 font-bold">
                  Developer
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h1 className="text-2xl font-bold -600 mb-4 text-white">
        List of Moderators
      </h1>

      <div className="space-y-2">
        {leaders.moderator.leaderboard!.map((e, i) => {
          return (
            <div
              key={i}
              className="w-full bg-neutral-900 hover:bg-neutral-800 shadow-md rounded-sm p-1 px-4 text-sm border-[1px] border-neutral-800 flex justify-between items-center"
            >
              <div className="flex space-x-4 w-1/2 items-center">
                <img
                  src={`/flags/${e.flag || "US"}.` + "svg"}
                  className="w-8"
                />
                <Link to={`/player/${e.id}`}>
                  <div className="font-bold">{e.username}</div>
                </Link>
              </div>
              <div className="flex space-x-4 ">
                <div className="w-25 text-center text-white font-bold">
                  Global Moderator
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
