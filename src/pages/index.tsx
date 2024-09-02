import { supabase, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import { SiWindows11 } from "react-icons/si";
import { Link, useLoaderData } from "react-router-dom";
import { getPublicStats } from "rhythia-api";

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export const Loader = async ({ params }: any) => {
  return await getPublicStats({});
};

export default function Home() {
  const me = useProfile();
  const stats = useLoaderData() as LoaderData<typeof Loader>;

  return (
    <div className="flex flex-col gap-4 text-white ">
      <img
        src={"/mascot.png"}
        width={400}
        alt=""
        className="absolute z-10 top-12 ml-14 max-md:hidden"
      />
      <div className="relative overflow-hidden h-96 max-md:h-64">
        <video
          src="https://cdn.discordapp.com/attachments/1075518762733817949/1280233851137953872/bg.mp4?ex=66d7562f&is=66d604af&hm=e87612ea8857957cb3bf93f92419ffcf28922f2288fa3c749f009188f52a15c1&#t=10"
          className="mt-[-100px] max-md:mt-[-50px]"
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute top-0 w-full h-full bg-neutral-900 opacity-70"></div>
        <div className="absolute top-0 w-full h-full z-10 flex flex-col items-end justify-center p-10 ">
          <div className="text-2xl font-bold">
            the most fun rhythm game is now online
          </div>
          <div className="text-2xl font-thin">start playing now!</div>
          {me.user ? (
            <Link to={`/player`} className="cursor-pointer">
              <button className="w-48 h-14 border-[1px] max-md:border-2 max-md:border-white mt-8 rounded-md hover:border-neutral-500 transition-all">
                Go to your profile
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                supabase.auth.signInWithOAuth({
                  provider: "discord",
                  options: {
                    redirectTo: document.location.origin,
                  },
                });
              }}
              className="w-48 h-14 border-[1px] mt-8 rounded-md hover:border-neutral-500 transition-all"
            >
              Sign up now
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex gap-4 max-md:flex-col-reverse">
        <div className="flex flex-col gap-4 w-full">
          <input
            className="bg-neutral-900 h-14 shadow-md rounded-sm outline-none placeholder:text-neutral-700 px-4 text-xl font-medium text-white border-[1px] border-neutral-800"
            placeholder="search player by username..."
          />
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold">
              RHYTHIA ONLINE
            </div>
            <div className="text-neutral-200 font-normal">
              Rhythia Online is the standalone hub for rhythia, a modern yet
              familiar online rhythm game. View your stats, scores and
              leaderboards here! Enter a username above to view it, or check out
              some of the shortcuts below.
            </div>
            <div className="w-full h-[1px] bg-neutral-700 my-4" />
            <div className="text-neutral-500 font-extrabold">
              HOW DOES IT WORK
            </div>
            <div className="text-neutral-200 font-normal">
              We made it as easy as possible for players to share scores and
              beatmaps.
              <div className="flex flex-col my-2">
                <div className="flex gap-2 ml-2">
                  <span className="font-bold">1.</span>Download our client for
                  free
                </div>
                <div className="flex gap-2 ml-2">
                  <span className="font-bold">2.</span>Login with your Discord
                </div>
                <div className="flex gap-2 ml-2">
                  <span className="font-bold">3.</span>Start submitting scores
                </div>
              </div>
              Rhythia Online is built on top of the original Rhythia game
              without altering or modifying the game, and you can still enjoy
              updates from the developers. Ultimately, our goal is to branch out
              a separate game client.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-1/2 max-md:w-full">
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
            <div className="text-neutral-500 font-extrabold">
              DOWNLOAD ONLINE
            </div>
            <button className="flex p-3 border-[1px] rounded-md w-full mt-2 text-white items-center gap-3 border-neutral-600 hover:border-neutral-500 transition-all ">
              <SiWindows11 className="fill-white w-6 h-6" />
              Download for Windows (Soon)
            </button>
          </div>
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 ">
            <div className="text-neutral-500 font-extrabold">STATS</div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Total players:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {stats.profiles}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">
                Scores submitted:
              </div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {stats.scores}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-neutral-200 font-normal ">Beatmaps:</div>
              <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
              <div className=""> {stats.beatmaps}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
