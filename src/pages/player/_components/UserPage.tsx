import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";
import { getJwt, useProfile } from "@/supabase";
import {
  AlertCircle,
  CatIcon,
  Edit,
  FlaskConical,
  Percent,
  Save,
  TrendingUp,
} from "lucide-react";
import { BsCircleFill, BsStarFill } from "react-icons/bs";
import { GiChicken } from "react-icons/gi";
import { MdSpeed, MdVerified } from "react-icons/md";
import {
  PiBirdFill,
  PiBugBeetleBold,
  PiCrownBold,
  PiCrownFill,
  PiWarningBold,
} from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import {
  editAboutMe,
  getBeatmapPageById,
  getProfile,
  getUserScores,
} from "rhythia-api";
import { EditProfile } from "./EditUser";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Textarea } from "@/shadcn/ui/textarea";
import { visit } from "unist-util-visit";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert";
import { getBeatmaps } from "rhythia-api/api/getBeatmaps";
import { BeatmapCard } from "@/pages/maps/_components/BeatmapCard";
import { EditPasskey } from "./EditPasskey";
import { TbRefresh } from "react-icons/tb";
import { TimeAgo } from "@/pages/_components/TimeAgo";
import { Button } from "@/shadcn/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";

const huntBadges = [
  {
    name: "The Start of an Era",
    icon: "/q.png",
  },
  {
    name: "New Farm",
    icon: "/mario.png",
  },
  {
    name: "Spinnin",
    icon: "/bug.png",
  },
  {
    name: "Old Farm",
    icon: "/mario2.png",
  },
  {
    name: "Birb",
    icon: "/bird.png",
  },
  {
    name: "Cats!",
    icon: "/cat.png",
  },
];

function BadgeHuntSection({ userBadges }: { userBadges: string[] }) {
  const unlockedBadges = huntBadges.filter((badge) =>
    userBadges.includes(badge.name)
  );
  const progress = (unlockedBadges.length / huntBadges.length) * 100;

  return (
    <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
      <div className="text-neutral-500 font-extrabold mb-3">
        BADGE HUNT 2025
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-grow">
          <div className="w-full bg-neutral-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="text-neutral-300 font-semibold">
          {unlockedBadges.length}/{huntBadges.length}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {huntBadges.map((badge) => {
          const isUnlocked = userBadges.includes(badge.name);
          return (
            <div
              key={badge.name}
              className={`
                w-12 h-12 bg-neutral-800 rounded-lg border-[1px] border-neutral-700
                flex items-center justify-center
                ${isUnlocked ? "opacity-100" : "opacity-30"}
              `}
            >
              <img
                src={badge.icon}
                alt={badge.name}
                className="w-8 h-8 object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
// Content Creator
const filterTags = () => {
  return (tree: any) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        [
          "meta",
          "html",
          "style",
          "body",
          "script",
          "iframe",
          "applet",
        ].includes(node.tagName)
      ) {
        // Remove the node from the tree
        parent.children.splice(index, 1);
      }
    });
  };
};

type ValueOf<T> = T[keyof T];
type RemoveUndefined<T> = T extends undefined ? never : T;

export const badges: Record<string, JSX.Element> = {
  "Global Moderator": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-white fill-white">
      <BsStarFill size={14} className="faa-spin animated " />
    </div>
  ),
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
  Tester: (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-blue-600 fill-blue-600">
      <FlaskConical size={14} className="faa-passing animated" />
    </div>
  ),
  "Bug Hunter": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-yellow-600 fill-yellow-600">
      <PiBugBeetleBold size={14} className="faa-horizontal animated" />
    </div>
  ),
  "Content Creator": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-yellow-600 fill-yellow-600">
      <img src="/tiktok.png" className="w-[30px] contrast-0" />
    </div>
  ),
  Bot: (
    <div className="flex items-center justify-center bg-neutral-800 px-4 h-7 rounded text-yellow-600 fill-yellow-600 font-bold">
      Bot Account managed by Rhythia Staff
    </div>
  ),
  uwu: (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-pink-600 fill-green-600">
      <CatIcon size={14} className="faa-passing animated" />
    </div>
  ),
  RCT: (
    <div className="flex items-center justify-center bg-neutral-800 w-12 h-7 rounded text-yellow-600 fill-green-600 font-bold">
      RCT
    </div>
  ),
  Chicken: (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-white-600 fill-green-600 font-bold">
      🐔
    </div>
  ),
  MMT: (
    <div className="flex items-center justify-center bg-neutral-800 w-12 h-7 rounded text-purple-600 fill-green-600 font-bold">
      MMT
    </div>
  ),
  $$$: (
    <div className="flex items-center justify-center bg-neutral-800 w-12 h-7 rounded text-lime-600 fill-lime-600 font-bold">
      $
    </div>
  ),
  "!": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded text-sky-400 fill-sky-400 font-bold">
      <span className="faa-passing animated">!</span>
    </div>
  ),
  "The Start of an Era": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded">
      <img src="/q.png" className="w-6 h-6" />
    </div>
  ),
  "New Farm": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded">
      <img src="/mario.png" className="w-6 h-6" />
    </div>
  ),
  Spinnin: (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded">
      <img src="/bug.png" className="w-6 h-6" />
    </div>
  ),
  "Old Farm": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded">
      <img src="/mario2.png" className="w-6 h-6" />
    </div>
  ),
  Birb: (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded">
      <img src="/bird.png" className="w-6 h-6" />
    </div>
  ),
  "Cats!": (
    <div className="flex items-center justify-center bg-neutral-800 w-10 h-7 rounded">
      <img src="/cat.png" className="w-6 h-6" />
    </div>
  ),
};

export const badgeMap: Record<string, string> = {
  RCT: "Ranked Curation Team",
  MMT: "Map Management Team",
  Bot: "Bot",
  "The Start of an Era": "Badge Hunt 2025: The Start of an Era",
  "New Farm": "Badge Hunt 2025: New Farm",
  Spinnin: "Badge Hunt 2025: Spinnin",
  "Old Farm": "Badge Hunt 2025: Old Farm",
  Birb: "Badge Hunt 2025: Bird",
  "Cats!": "Badge Hunt 2025: Cats!",
};

// Badge Hunt Event Flag - set to true during the event
const BADGE_HUNT_EVENT_ACTIVE = false;

export function UserPage({
  profile,
  scores,
  beatmaps,
}: {
  profile: Awaited<ReturnType<typeof getProfile>>;
  scores: Awaited<ReturnType<typeof getUserScores>>;
  beatmaps: Awaited<ReturnType<typeof getBeatmaps>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutMe, setAboutMe] = useState(profile.user?.about_me);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const navigate = useNavigate();
  const me = useProfile();
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  if (!profile.user) {
    return <>User malformed</>;
  }
  const imMod = me && me.userProfile?.badges.includes("Global Moderator");
  const imUser = me && profile.user.id === me.userProfile?.id;

  if (!imMod) {
    // Don't show, visual only
    if (profile.user.ban == "excluded") {
      scores.lastDay = [];
      scores.top = [];
      beatmaps.beatmaps = [];
      profile.user.play_count = 0;
      profile.user.squares_hit = 0;
      profile.user.flag = "US";
      profile.user.avatar_url = "";
      profile.user.about_me = "";
      profile.user.profile_image = "";
      profile.user.username = "excluded_";
      profile.user.badges = [];
      profile.user.clans = undefined;
      (profile.user.position as any) = "-";
      (profile.user.skill_points as any) = 0;
    }

    if (profile.user.ban == "silenced") {
      profile.user.about_me = "";
      profile.user.profile_image = "";
    }
  }

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>External Link Warning</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to visit an external website:{" "}
              <b className="text-white">{pendingUrl}</b>
              <br />
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.open(pendingUrl, "_blank");
                setIsOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {profile.user.profile_image && (
        <div className="top-[60px] left-0 overflow-hidden h-64 absolute w-full">
          <img src={profile.user.profile_image} className="w-[100vw]"></img>
          <div className="bg-gradient-to-b from-transparent  to-neutral-950 absolute top-0 left-0 w-full h-64 via-[#0a0a0a9f]"></div>
        </div>
      )}

      <div className="space-y-3 text-white z-50 relative">
        {imMod && (
          <Alert className="bg-neutral-900" variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Moderator View</AlertTitle>
            <AlertDescription>
              You are currently viewing this page as a moderator, you will see
              all the data related to this user.
            </AlertDescription>
          </Alert>
        )}
        {profile.user.ban == "excluded" && (
          <Alert className="bg-neutral-900" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This user has been marked as <b>Excluded</b>, which means the
              profile has been blocked due to highest level of Rhythia Online
              rules infringement. Please refer to support@rhythia.com for an
              appeal. You must read the{" "}
              <Link className="underline" to="/rules">
                rules
              </Link>{" "}
              before appealing
            </AlertDescription>
          </Alert>
        )}
        {profile.user.ban == "silenced" && (
          <Alert className="bg-neutral-900" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This user has been marked as <b>Silenced</b>, which means the user
              has blocked access to communication using the website.
            </AlertDescription>
          </Alert>
        )}
        {profile.user.ban == "restricted" && (
          <Alert className="bg-neutral-900" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This user has been marked as <b>Restricted</b>, which means the
              user cannot submit scores due to rule infringements. Please refer
              to support@rhythia.com for an appeal.
            </AlertDescription>
          </Alert>
        )}

        <div className="max-md:flex-col max-md:items-center w-full bg-neutral-900 shadow-md drop-shadow-md rounded-sm p-6 text-sm border-[1px] border-neutral-800 flex gap-8">
          <div className="relative h-40 min-w-40 max-md:w-40">
            <img
              src={profile.user.avatar_url || "https://a.ppy.sh/u/1"}
              onError={(event) => {
                (event.target as HTMLImageElement).src = `https://a.ppy.sh/u/1`;
              }}
              className="rounded-full w-full h-full border-8 object-cover"
            />
            {profile.user.badges && profile.user.badges.includes("bday") && (
              <img
                src="/bday.png"
                className="absolute -left-8 -top-12 w-24 h-24 -rotate-[45deg]"
              ></img>
            )}
          </div>

          <div className="flex flex-col h-36 justify-center max-md:items-center">
            <div className="text-neutral-100 text-5xl drop-shadow-lg font-bold ">
              {profile.user.clans && (
                <Link to={"/clans/" + profile.user.clans.id}>
                  <span className="cursor-pointer font-extrabold text-4xl mr-2 text-indigo-500">
                    [{profile.user.clans.acronym}]
                  </span>
                </Link>
              )}
              {profile.user.username}
            </div>

            <div className="flex gap-5 min-w-[400px] mt-1 max-md:min-w-0 max-md:justify-center">
              <Link to={"/leaderboards/" + profile.user.flag || "US"}>
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
              </Link>

              {profile.user.is_online ? (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <div className="flex gap-2 items-center">
                        <BsCircleFill className="w-4 h-4 fill-green-600" />
                        <div className="text-lg font-semibold text-neutral-300">
                          Online
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      This user was active in the last 30 minutes.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className="flex gap-2 items-center">
                  <BsCircleFill className="w-4 h-4 fill-red-600" />
                  <div className="text-lg font-semibold text-neutral-300">
                    Not online
                  </div>
                </div>
              )}
              {/*  */}
            </div>
            <div className="flex gap-2 mt-3 max-md:justify-center">
              {(profile.user.badges as Array<string>)
                .filter((badge) => !huntBadges.some((hb) => hb.name === badge))
                .map((badge) => {
                  return (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          {badges[badge] || <></>}
                        </TooltipTrigger>
                        <TooltipContent>
                          {badgeMap[badge] ? badgeMap[badge] : badge}
                        </TooltipContent>
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
              Rhythm Points: {profile.user.skill_points}
            </div>
            {/* <Chart data={chartdata} /> */}
          </div>
        </div>
        <div className="flex gap-3 max-md:flex-col">
          <div className="flex flex-col w-1/4 gap-3 max-md:w-full">
            {profile.user.verified && (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger className="flex items-center justify-center">
                    <div
                      className="text-sm w-full rounded-md text-center font-bold relative overflow-hidden flex items-center justify-center"
                      onClick={() => navigate("/support")}
                    >
                      <div className="bg-[url(/unkimg.png)] w-full h-full absolute top-0 -z-10 saturate-0 opacity-100"></div>
                      <div className="bg-purple-700 w-full h-full absolute top-0 -z-10 opacity-30 "></div>
                      <img
                        src="/supporter.png"
                        className="w-full max-w-64 px-4 py-2"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    This user has donated or has contributed to the project!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
              <div className="text-neutral-500 font-extrabold">STATS</div>
              <div className="flex items-center gap-4">
                <div className="text-neutral-200 font-normal ">
                  Rhythm Points:
                </div>
                <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
                <div className=""> {profile.user.skill_points}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-neutral-200 font-normal ">Play count:</div>
                <div className="border-t-[1px] flex-grow bg-neutral-500 border-dashed"></div>
                <div className=""> {profile.user.play_count}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-neutral-200 font-normal ">
                  Squares hit:
                </div>
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
            {profile.user.uid === me.user?.id && <EditPasskey />}
          </div>
          <div className="flex flex-col gap-3 w-3/4 max-md:w-full">
            <BadgeHuntSection userBadges={profile.user.badges} />
            <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
              <div className="flex gap-2 items-center">
                <div className="text-neutral-500 font-extrabold">ABOUT ME</div>
                {profile.user.uid === me.user?.id &&
                  (isEditing == false ? (
                    <Edit
                      className="text-neutral-500 hover:text-neutral-300 cursor-pointer"
                      onClick={() => {
                        setAboutMe(profile.user?.about_me);
                        setIsEditing((curr) => !curr);
                      }}
                      width={14}
                    />
                  ) : (
                    <Save
                      className="text-neutral-500 hover:text-neutral-300 cursor-pointer"
                      onClick={async () => {
                        await editAboutMe({
                          session: await getJwt(),
                          data: {
                            about_me: aboutMe || "",
                          },
                        });
                        setIsEditing((curr) => !curr);
                        if (profile.user) {
                          profile.user.about_me = aboutMe || "";
                        }
                      }}
                      width={14}
                    />
                  ))}
              </div>

              {isEditing ? (
                <>
                  <div className="text-neutral-600 font-bold flex gap-2 items-center border-[1px] p-2 rounded-md mt-2">
                    <PiWarningBold className="w-8 h-8" />
                    Warning: Any innapropriate content will result in permanent
                    ban or restriction from the website. This includes links to
                    NSFW contents, images or explicit descriptions.
                  </div>
                  <Textarea
                    value={aboutMe || ""}
                    onChange={(ev) => {
                      setAboutMe(ev.target.value);
                    }}
                    className="h-96 mt-4"
                  />
                </>
              ) : profile.user.about_me?.length ? (
                <Markdown
                  className={
                    "prose prose-sm dark:prose-invert prose-neutral dark max-h-96 overflow-y-scroll min-w-full prose-h1:mb-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-li:my-0 prose-ol:m-0 prose-ul:m-0 overflow-hidden relative"
                  }
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            props.href?.startsWith("https://www.rhythia.com")
                          ) {
                            window.open(props.href, "_blank");
                            return;
                          }
                          setPendingUrl(props.href || "");
                          setIsOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-600 cursor-pointer"
                      />
                    ),
                  }}
                  remarkPlugins={[remarkGfm]}
                >
                  {profile.user.about_me}
                </Markdown>
              ) : (
                <div className="text-white w-full flex flex-col justify-center items-center gap-2">
                  <img
                    src={"/not_found.png"}
                    width={40}
                    height={40}
                    alt="Notfound"
                  />
                  <div className="opacity-75 italic">
                    No about me information
                  </div>
                </div>
              )}
            </div>
            {!!(scores.reign && scores.reign.length) && (
              <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-yellow-800">
                <div className="text-yellow-500 font-extrabold mb-4 flex items-center gap-2">
                  <PiCrownFill />
                  TOP 10 REIGNING SCORES
                </div>
                <div className="flex flex-col gap-3">
                  {scores.reign.map((score, i) => {
                    return (
                      <ProfileScore
                        score={{
                          id: score.id,
                          created_at: score.created_at,
                          awarded_sp: score.awarded_sp,
                          beatmapHash: score.beatmapHash,
                          misses: score.misses,
                          passed: score.passed,
                          songId: score.songId,
                          userId: profile.user!.id || 0,
                          beatmapNotes: score.beatmapNotes || 0,
                          beatmapTitle: score.beatmapTitle,
                          beatmapDifficulty: score.difficulty,
                          spin: score.spin,
                          speed: score.speed,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
              <div className="text-neutral-500 font-extrabold mb-4">
                TOP SCORES
              </div>
              <div className="flex flex-col gap-3">
                {scores.top?.length ? (
                  <>
                    {scores.top.map((score, i) => {
                      return <ProfileScore score={score} order={i} />;
                    })}
                    <Link
                      to={`/player/${profile.user.id}/scores`}
                      className="w-full"
                    >
                      <Button className="w-full" variant={"ghost"}>
                        View score report
                      </Button>
                    </Link>
                  </>
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
                {BADGE_HUNT_EVENT_ACTIVE && !(imUser || imMod) ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm z-10 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg mb-2">
                          🏆 Badge Hunt Event Active
                        </div>
                        <div className="text-neutral-400">
                          Recent scores hidden during event
                        </div>
                      </div>
                    </div>
                    <div className="opacity-20 pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="border-[1px] px-4 py-2 rounded-md border-neutral-700 bg-neutral-800 mb-3"
                        >
                          <div className="flex gap-2 items-center">
                            <div className="text-3xl w-10 mr-2 flex items-center justify-center font-extrabold text-neutral-600">
                              ?
                            </div>
                            <div className="w-full">
                              <div className="flex w-full justify-between items-center">
                                <div className="font-extrabold text-xl w-20 flex items-center">
                                  ??%
                                </div>
                                <div className="bg-neutral-900 z-10 px-2 h-full rounded-sm border-neutral-700 py-[1px] border-[1px] font-bold">
                                  HIDDEN
                                </div>
                              </div>
                              <div className="text-xs text-neutral-400">
                                Hidden during event
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : scores.lastDay?.length ? (
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
              <div className="text-neutral-500 font-extrabold">
                USER BEATMAPS
              </div>
              {beatmaps?.beatmaps?.length ? (
                <div className="w-full grid grid-cols-2 max-md:grid-cols-1 gap-4 pt-4">
                  {(beatmaps?.beatmaps || []).map((beatmap) => (
                    <BeatmapCard
                      starRating={beatmap.starRating || 0}
                      id={beatmap.id}
                      title={beatmap.title || ""}
                      difficulty={beatmap.difficulty || 0}
                      image={beatmap.image || ""}
                      status={beatmap.status || "UNRANKED"}
                      owner={beatmap.owner || 0}
                      ownerUsername={beatmap.ownerUsername || ""}
                      playcount={beatmap.playcount || 0}
                      url={beatmap.beatmapFile || ""}
                      length={beatmap.length || 0}
                      videoUrl={beatmap.videoUrl || ""}
                    />
                  ))}
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
    </div>
  );
}

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export function calculateWeight(n: number) {
  let weight = 100;

  let i = 0;
  while (i < n && weight >= 5) {
    weight *= 0.97;
    i++;
  }

  return weight / 100;
}

export function ProfileScore({
  score,
  order,
}: {
  score: ArrayElement<
    RemoveUndefined<Awaited<ReturnType<typeof getUserScores>>["lastDay"]>
  >;
  order?: number;
}) {
  const navigate = useNavigate();
  if (
    score.misses == null ||
    !score.beatmapNotes ||
    score.beatmapDifficulty === null ||
    score.beatmapDifficulty === undefined
  )
    return <></>;
  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );

  if (score.beatmapDifficulty == 0) {
    difficultyBadge = (
      <div className="bg-neutral-600 z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> N/A
      </div>
    );
  }
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
        <BsStarFill /> TASUKETE
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
          className="text-3xl w-10 mr-2 flex items-center justify-center font-extrabold"
          style={{ color }}
        >
          {letterRank}
        </div>

        <div className="w-full">
          <div className="flex w-full justify-between items-center">
            <Link to={`/score/${score.id}`}>
              <div className="font-extrabold text-xl w-20 flex items-center hover:underline">
                {acc}%
              </div>
            </Link>

            <div className="flex gap-2 items-center">
              {score.spin ? (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <div className="bg-neutral-900 z-10 px-2 h-full rounded-sm border-neutral-700 py-[1px] border-[1px] font-bold flex gap-2 items-center">
                        <TbRefresh size={18} />
                        SPIN
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Played with Camera Unlock ON and Grid Parallax 0
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <></>
              )}
              {difficultyBadge}
            </div>
          </div>
          <div className="flex w-full justify-between items-start">
            <div className="flex flex-col justify-center">
              <div
                onClick={async () => {
                  const id = await getBeatmapPageById({
                    session: await getJwt(),
                    mapId: score.beatmapHash!,
                  });
                  window.open("/maps/" + id.beatmap!.id, "_blank")!.focus();
                }}
              >
                <div className="hover:underline cursor-pointer text-xs">
                  {score.beatmapTitle}
                </div>
              </div>
              <div className="text-xs text-neutral-400">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <TimeAgo timestamp={score.created_at}></TimeAgo>
                    </TooltipTrigger>
                    <TooltipContent>
                      {new Date(score.created_at).toUTCString()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex gap-2 max-md:flex-col text-xs">
              <div className="bg-transparent z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex items-center justify-start mt-1">
                <MdSpeed className="mr-2 w-4 fill-blue-500 text-blue-500" />
                <span>{Math.round((score.speed || 1) * 100) / 100}</span>
                <span className="text-xs">x</span>
              </div>
              {score.awarded_sp ? (
                <>
                  <div className="bg-transparent z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex items-center justify-start mt-1">
                    <TrendingUp className="mr-2 w-4 fill-green-500 text-green-500" />
                    <span>{Math.round(score.awarded_sp || 0)}</span>
                    <span className="text-xs">rp</span>
                  </div>
                  {order !== undefined ? (
                    <div className="bg-transparent z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex items-center justify-start mt-1">
                      <Percent className="mr-2 w-4 fill-red-500 text-red-500" />
                      <span>
                        {Math.round(
                          (score.awarded_sp || 0) * calculateWeight(order)
                        )}
                      </span>
                      <span className="text-xs">rp</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
