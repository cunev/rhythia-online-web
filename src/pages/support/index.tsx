import { Button } from "@/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";
import { HeartIcon } from "lucide-react";
import { useState } from "react";

const SupportDisplay = () => {
  return (
    <div className="flex flex-col max-md:items-center max-md:text-center">
      <div className="text-2xl">
        Support Rhythia with{" "}
        <span className="font-black text-purple-400">5$ per month</span>
      </div>
    </div>
  );
};
export default function SupportPage() {
  return (
    <div className="mt-80 max-md:mt-32 flex flex-col gap-6">
      <div className="bg-[url(/supportbanner.png)] border-b-[1px] shadow-lg absolute top-0 left-1/2 -translate-x-1/2 w-[100vw]  h-96 bg-cover bg-center max-md:h-48 min-[2000px]:mt-[-100px] min-[2000px]:h-[500px]" />
      <div
        className="top-[300px] max-md:top-[100px] left-0 overflow-hidden h-64 absolute w-full -z-20 "
        style={{
          backgroundImage: `url('/bg.png')`,
          filter: `hue-rotate(20deg)`,
        }}
      >
        <img
          src="https://static.rhythia.com/user-avatar-1735394823646-a2a8cfbe-af5d-46e8-a19a-be2339c1679a"
          className="w-[100vw]"
        ></img>
        <div className="bg-gradient-to-b from-transparent  to-neutral-950 absolute top-0 left-0 w-full h-64 via-[#0a0a0a73]"></div>
      </div>
      <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 ">
        <div className="px-16 relative">
          <QuoteMark className="absolute left-[-5px] rotate-180 min-w-14 h-14 opacity-20" />
          <div className="text-neutral-200 font-medium italic">
            From day one, I've run this project with one simple goal: creating
            the experience I'd want to have as a player. We've grown beyond what
            I ever imagined, but my principles remain the same - no pay-to-win
            mechanics, no intrusive ads, just pure enjoyment of the game.
            <br />
            <br /> Your support is entirely optional and will never give anyone
            a competitive edge (though you might get some sweet cosmetics to
            show off!). Every contribution goes directly into making this
            platform better - from keeping our servers running smoothly to
            funding community events and supporting our small but dedicated
            team. To everyone - testers, moderators, developers, who has
            supported the project along the way: thank you.
            <br />
            <br />
            You're the reason we can keep this game alive while staying true to
            the values.
          </div>
          <QuoteMark className="absolute right-0 bottom-0 min-w-14 h-14 opacity-20" />
        </div>
        <div className="mt-10 w-full flex justify-end opacity-50">
          - Dmitri (cunev) Cunev, the developer of Rhythia Website and Online
        </div>
      </div>
      <div className="w-full bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-col px-10 py-6">
        <div className="flex justify-between items-center max-md:flex-col max-md:items-stretch max-md:gap-6">
          <SupportDisplay />

          <Button
            onClick={() => {
              window.open("https://buymeacoffee.com/cunev/membership");
            }}
            className="flex gap-2 max-md:w-full"
          >
            <HeartIcon className="w-4" />
            Support now
          </Button>
        </div>
      </div>

      <hr />

      <div className="flex flex-col text-center">
        <div className="text-3xl font-black text-center">Additional Perks</div>
        <div className="text-lg text-neutral-400 font-black text-center">
          Some features are still work in progress, or generally available.
        </div>
      </div>

      <div className="w-full bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-row items-center gap-4 px-10 py-6">
        <img src="/downloads.png" className="w-28"></img>
        <div>
          <div className="text-xl font-black">Download all for Collections</div>
          <div className="text-lg text-neutral-300">
            You will be able to quickly download many maps at once from all the
            collections
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-row items-center gap-4 px-10 py-6">
        <img src="/tournaments.png" className="w-28"></img>
        <div>
          <div className="text-xl font-black">
            Organize and create tournaments
          </div>
          <div className="text-lg text-neutral-300">
            You will be able to create tournaments using the official tournament
            page and manage them.
          </div>
        </div>
      </div>

      <div className="w-full bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-row items-center gap-4 px-10 py-6">
        <img src="/discord.png" className="w-28"></img>
        <div>
          <div className="text-xl font-black">Profile Badge</div>
          <div className="text-lg text-neutral-300">
            You will get a special profile badge to represent your generosity.
          </div>
        </div>
      </div>

      <div className="w-full bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-row items-center gap-4 px-10 py-6">
        <img src="/online.png" className="w-28"></img>
        <div>
          <div className="text-xl font-black">Online Map Preview</div>
          <div className="text-lg text-neutral-300">
            You will be able to preview all maps online without downloading
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

export function QuoteMark({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="24"
      height="24"
      strokeWidth="2"
    >
      {" "}
      <path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"></path>{" "}
      <path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"></path>{" "}
    </svg>
  );
}

const Range: React.FC<{ value: number; onChange: (val: number) => void }> = ({
  value,
  onChange,
}) => {
  let offset = (1 - value / 100) * 28 - 14;
  return (
    <div className="relative h-7">
      <input
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        type="range"
        min={0}
        max={100}
        step={0.001}
        className="w-full absolute inset-0 z-10 opacity-0"
      />
      <div className="absolute inset-0 ">
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-l-lg bg-purple-600 h-[8px]"
          style={{
            width: `calc(${value}% - 14px + ${offset}px - 2px)`,
            outline: `3px solid rgba(38, 38, 240, 0.19)`,
            outlineOffset: `0px`,
          }}
        ></div>
        <div
          className="absolute w-[26px] h-[26px] bg-[#6D6C74] rounded-lg -translate-x-1/2 flex items-center justify-center space-x-[2px]"
          style={{ left: `calc(${value}% + ${offset}px)` }}
        >
          {[0, 1, 2].map((e) => (
            <div
              key={e}
              className="bg-[#C4C4C4] rounded-2xl w-[2px] h-[10px]"
            ></div>
          ))}
        </div>
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-lg bg-[#313133] h-[8px]"
          style={{
            width: `calc(${(value - 100) * -1}% - 14px - ${offset}px - 2px)`,
            outline: `1px solid rgba(41, 41, 43, 0.38)`,
            outlineOffset: `0px`,
          }}
        ></div>
      </div>
    </div>
  );
};
