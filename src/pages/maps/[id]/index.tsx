import { getJwt, useProfile } from "@/supabase";
import { LoaderData } from "@/types";
import { FaDownload, FaEdit, FaPlus, FaVoteYea } from "react-icons/fa";
import { ImHammer } from "react-icons/im";
import { PiTrophyFill } from "react-icons/pi";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  approveMap,
  createBeatmap,
  deleteBeatmapPage,
  getBeatmapComments,
  getBeatmapPage,
  getMapUploadUrl,
  getProfile,
  nominateMap,
  postBeatmapComment,
  updateBeatmapPage,
} from "rhythia-api";
import dayjs from "dayjs";
import { BsFillCircleFill, BsStarFill } from "react-icons/bs";
import { ArrowRight, Circle, Clock, Dot, InfoIcon, Star } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Progress } from "@/shadcn/ui/progress";
import { MdApproval } from "react-icons/md";
import { toast } from "@/shadcn/ui/use-toast";
import { Textarea } from "@/shadcn/ui/textarea";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";
import { badgeMap, badges } from "@/pages/player/_components/UserPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { useEffect, useRef, useState } from "react";
import { getIntrinsicToken } from "@/pages/_components/IntrinsicGen";
import { formatTime } from "../_components/BeatmapCard";
import { AddToCollection } from "@/pages/collections/_components/AddToCollection";
export const Loader = async ({ params }: any) => {
  return {
    getBeatmap: await getBeatmapPage({
      id: Number(params.id),
      session: await getJwt(),
    }),
    getBeatmapComments: await getBeatmapComments({
      page: Number(params.id),
    }),
  };
};

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

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [doubleConfirm, setDoubleConfirm] = useState(false);
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const { userProfile } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [loadedNominators, setLoadedNominators] = useState(false);
  const [nominators, setNominators] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Uploading...");
  const [newDescription, setNewDescription] = useState("");
  const navigate = useNavigate();

  if (!loaderData.getBeatmap.beatmap) return;

  const map = loaderData.getBeatmap.beatmap!;
  const scores = loaderData.getBeatmap.scores;
  const comments = loaderData.getBeatmapComments.comments;

  useEffect(() => {
    if (loadedNominators) return;
    const nominators: any[] = [];

    async function main() {
      for (const nominator of map.nominations || []) {
        const profile = await getProfile({
          session: await getJwt(),
          id: nominator,
        });
        if (profile.user) {
          nominators.push(profile.user);
        }
      }
      setNominators(nominators);
      setLoadedNominators(true);
    }
    main();
  }, []);

  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );
  if (map.difficulty == 0) {
    difficultyBadge = (
      <div className="bg-neutral-600 z-10 px-2 rounded-sm border-neutral-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> N/A
      </div>
    );
  }
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
    <div className="w-full space-y-4">
      <div className="bg-neutral-900 overflow-hidden shadow-md rounded-sm text-sm border-[1px] border-neutral-800 flex flex-col">
        <div className="relative w-full h-[200px] overflow-hidden">
          <div
            className="absolute h-full w-full opacity-45 bg-cover bg-center max-md:blur-0 blur-sm"
            style={{
              backgroundImage: `url("${encodeURI(map.imageLarge!)}")`,
            }}
          ></div>
          <div className="flex items-center gap-2 absolute left-2 top-2 ">
            {map.status == "RANKED" ? (
              <div className="bg-blue-600 z-10 px-2 rounded-sm border-blue-500 border-[1px] font-bold flex gap-2 items-center">
                <PiTrophyFill />
                RANKED
              </div>
            ) : map.status == "APPROVED" ? (
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

          <div className="flex flex-col absolute right-48 max-md:right-2 top-3 max-md:top-2 gap-1 justify-end items-end">
            <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {Math.round((map.starRating || 0) * 100) / 100}
              <Star className="h-4" />
            </div>
            <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {formatTime(map.length || 0)}
              <Clock className="h-4" />
            </div>
            <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-xl">
              {map.playcount} plays
            </div>
          </div>
          <div
            className="absolute h-44 w-44  right-2 top-1/2 -translate-y-1/2 opacity-100 bg-cover bg-center rounded-md max-md:hidden"
            style={{
              backgroundImage: `url("${encodeURI(map.imageLarge!)}")`,
            }}
          ></div>

          <div className="flex absolute bottom-4 left-4 flex-col justify-end">
            <div className="text-3xl font-bold h-8 text-shadow shadow-neutral-900">
              {map.title}
            </div>
          </div>
        </div>
        <div className="p-4 flex justify-between border-t-[1px] border-t-neutral-800 items-center">
          <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
            <Link to={`/player/${map.owner}`}>
              <img
                src={map.ownerAvatar || ""}
                alt=""
                className="rounded-full border-8 border-neutral-800 w-16 h-16"
              />
            </Link>
            <div className="flex flex-col items-start h-full justify-center text-xs text-shadow shadow-neutral-900 text-neutral-400 ">
              <Link to={`/player/${map.owner}`}>
                <div>
                  Mapped by{" "}
                  <span className="text-purple-400">{map.ownerUsername}</span>
                </div>
              </Link>
              <div>
                Posted on{" "}
                <span className="text-white">
                  {new Date(map.created_at!).toUTCString()}
                </span>
              </div>
              <div>
                Updated on{" "}
                <span className="text-white">
                  {map.updated_at
                    ? new Date(map.updated_at!).toUTCString()
                    : new Date(map.created_at!).toUTCString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 max-md:flex-col">
            <Button
              variant="secondary"
              onClick={async () => {
                const res = await nominateMap({
                  session: await getJwt(),
                  mapId: map.id!,
                });
                if (res.error) {
                  toast({
                    title: "Oops",
                    description: res.error,
                    variant: "destructive",
                  });
                  return;
                }
                document.location.reload();
              }}
              disabled={
                !userProfile?.badges.includes("RCT") ||
                map.status == "RANKED" ||
                (map.nominations as number[]).length >= 2
              }
            >
              <FaVoteYea className="mr-2 h-3 w-3" />
              Nominate
            </Button>
            <Button
              variant="secondary"
              disabled={
                !userProfile?.badges.includes("MMT") ||
                map.status == "RANKED" ||
                map.status == "APPROVED"
              }
              onClick={async () => {
                const res = await approveMap({
                  session: await getJwt(),
                  mapId: map.id!,
                });
                if (res.error) {
                  toast({
                    title: "Oops",
                    description: res.error,
                    variant: "destructive",
                  });
                  return;
                }
                document.location.reload();
              }}
            >
              <MdApproval className="mr-2 h-3 w-3" />
              Approve
            </Button>

            {(map.owner == userProfile?.id ||
              userProfile?.badges.includes("Global Moderator") ||
              userProfile?.badges.includes("Developer")) && (
              <Dialog
                open={open}
                onOpenChange={(val) => {
                  if (val) {
                    setNewDescription(map.description || "");
                  }
                  setOpen(val);
                }}
              >
                <DialogTrigger>
                  <Button variant="secondary">
                    <FaEdit className="mr-2 h-3 w-3" />
                    Update
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[625px]">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Delete beatmap</DialogTitle>
                      <DialogDescription>
                        This will remove the beatmap forever, no return.
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      className="mt-3"
                      variant={"destructive"}
                      onClick={async () => {
                        if (!doubleConfirm) {
                          setDoubleConfirm(true);
                          return;
                        }
                        const res = await deleteBeatmapPage({
                          id: map.id!,
                          session: await getJwt(),
                        });
                        if (res.error) {
                          toast({
                            title: "Oops",
                            description: res.error.toString(),
                            variant: "destructive",
                          });
                        }
                        navigate("/maps");
                      }}
                    >
                      {!doubleConfirm
                        ? "Remove beatmap forever"
                        : "REMOVE FOR SURE? DANGER!?"}
                    </Button>
                    <hr className="my-4" />

                    <DialogHeader>
                      <DialogTitle>Update beatmap</DialogTitle>
                      <DialogDescription>
                        Upload a new beatmap file to update the current page.
                        Plays will be reseted to 0.
                      </DialogDescription>
                    </DialogHeader>

                    {uploading && (
                      <div className="space-y-3 mt-4">
                        <hr />
                        <div className="space-y-0">
                          <p className="text-lg opacity-75">{progressText}</p>
                        </div>

                        <Progress value={progress} />
                        <hr />
                      </div>
                    )}
                    <Input
                      id="name"
                      type="file"
                      accept=".sspm"
                      disabled={uploading}
                      className="col-span-3 file:text-white text-transparent mt-4"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = async (e) => {
                            try {
                              setUploading(true);

                              const jwt = await getJwt();
                              setProgressText("Retrieving upload url...");
                              setProgress(25);
                              const intrinsicToken = await getIntrinsicToken();
                              const res = await getMapUploadUrl({
                                session: jwt,
                                contentLength: (e.target?.result as ArrayBuffer)
                                  .byteLength,
                                contentType: "application/octet-stream",
                                intrinsicToken,
                              });

                              setProgressText("Uploading beatmap file...");
                              setProgress(50);

                              const result = await fetch(res.url!, {
                                method: "PUT",
                                body: e.target?.result as ArrayBuffer,
                                headers: {
                                  "Content-Type": "application/octet-stream",
                                },
                              });

                              setProgressText("Parsing beatmap file...");
                              setProgress(75);

                              const url = `https://static.rhythia.com/${res.objectKey}`;
                              const beatmap = await createBeatmap({
                                url,
                                session: jwt,
                                updateFlag: true,
                              });

                              if (beatmap.error) {
                                throw beatmap.error;
                              }

                              if (!beatmap.hash) {
                                return;
                              }

                              setProgress(95);

                              await updateBeatmapPage({
                                session: jwt,
                                beatmapHash: beatmap.hash,
                                id: map.id!,
                                description: "",
                                tags: "",
                              });
                              setProgressText("Redirecting to beatmap page...");
                              setProgress(100);

                              setTimeout(() => {
                                location.reload();
                              });
                            } catch (error: any) {
                              toast({
                                title: "Oops",
                                description: error.toString(),
                                variant: "destructive",
                              });
                            }
                          };
                          reader.readAsArrayBuffer(file);
                        }
                      }}
                    />
                    <hr className="my-4" />

                    <DialogHeader>
                      <DialogTitle>Update description</DialogTitle>
                      <DialogDescription>
                        Write a small description for the beatmap
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      className="my-3"
                      value={newDescription || ""}
                      onChange={(ev) => setNewDescription(ev.target.value)}
                      placeholder="A small description..."
                    />
                    <Button
                      className="mt-3"
                      onClick={async () => {
                        await updateBeatmapPage({
                          session: await getJwt(),
                          id: map.id!,
                          description: newDescription,
                        });
                        document.location.reload();
                      }}
                    >
                      Update description
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            <AddToCollection beatmapId={map.id || -1} />

            <a href={map.beatmapFile || ""} target="__blank">
              <Button variant="secondary">
                <FaDownload className="mr-2 h-3 w-3" />
                Download
              </Button>
            </a>
          </div>
        </div>

        {
          <div className="px-6 py-4 space-y-4 flex">
            <hr />
            <div className="w-full">
              <Markdown
                className={
                  "prose min-w-[100%] h-full prose-sm dark:prose-invert prose-neutral dark prose-h1:mb-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-li:my-0 prose-ol:m-0 prose-ul:m-0 "
                }
                remarkPlugins={[remarkGfm]}
              >
                {map.description ? map.description : "No map description"}
              </Markdown>
            </div>
          </div>
        }
      </div>
      <hr />

      <div className="space-y-2">
        <div className="w-full p-0 px-4 text-sm border-[1px] border-transparent flex justify-between text-neutral-500">
          <div className="flex space-x-4 w-1/2">
            <div className="">Position</div>
          </div>
          <div className="flex space-x-4 w-1/3">
            <div className="w-1/2 text-center">Awarded RP</div>
            <div className="w-1/2 text-center">Speed</div>
            <div className="w-1/2 text-center">Mods</div>
          </div>
        </div>
      </div>
      {scores!.map((score, i) => (
        <div className="w-full bg-neutral-900 hover:bg-neutral-800 shadow-md rounded-sm p-1 px-4 text-sm border-[1px] border-neutral-800 flex justify-between items-center">
          <div className="flex space-x-4 w-1/2 items-center">
            <div className="opacity-75 min-w-10">#{i + 1}</div>
            <Link to={`/player/${score.userId}`}>
              <div className="flex gap-3 items-center w-64 justify-start">
                <img
                  src={score.avatar_url || "https://a.ppy.sh/u/1"}
                  className="rounded-md w-8 h-8"
                />
                <div className="font-bold w-1/2 ">{score.username}</div>
              </div>
            </Link>
          </div>
          <div className="flex space-x-4 w-1/3">
            <div className="w-1/2 text-center">{score.awarded_sp}</div>
            <div className="w-1/2 text-center">{score.speed}</div>
            <div className="w-1/2 text-center">
              {!score.mods.length
                ? "None"
                : (score.mods as any as string[])
                    .join(", ")
                    .replace(/mod_hardrock/g, "HR")}
            </div>
          </div>
        </div>
      ))}
      <hr />

      <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 px-8 text-sm border-[1px] border-neutral-800 flex justify-between items-center max-md:flex-col  max-md:gap-8">
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-2 items-end max-md:flex-col max-md:mb-4 max-md:gap-4">
            <div className="flex flex-col gap-2 ">
              <div className="opacity-75 font-bold flex gap-3 justify-center items-center">
                <FaVoteYea />
                {2 - (map.nominations?.length || 0)} more nominations required
              </div>
              <Progress
                value={(map.nominations?.length || 0) * 50}
                max={2}
                className="w-64"
              />
            </div>

            <ArrowRight className="w-4 max-md:hidden" />
            <div className="flex flex-col gap-2">
              <div className="opacity-75 font-bold flex gap-3 justify-center items-center">
                <MdApproval />
                {map.status == "RANKED" || map.status == "APPROVED"
                  ? "0 approvals required"
                  : "1 approval required"}
              </div>
              <Progress
                value={
                  map.status == "RANKED" || map.status == "APPROVED" ? 100 : 0
                }
                max={1}
                className="w-64"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {nominators.map((nomi) => (
              <div className="flex items-center gap-2 border-2 px-4 py-1 rounded-md pl-3">
                <img
                  src={nomi.avatar_url || ""}
                  alt=""
                  className="rounded-full border-4 border-neutral-800 min-w-6 min-h-6 w-6 h-6"
                />
                <a
                  className="text-purple-400 hover:underline"
                  href={`/player/${nomi.id}`}
                >
                  {nomi.username}
                </a>
                <BsFillCircleFill className="w-1"></BsFillCircleFill>
                <div className="italic text-xs">Nominated</div>
              </div>
            ))}
          </div>
        </div>

        {map.status !== "RANKED" && map.status !== "APPROVED" && (
          <div className="flex text-xs items-center gap-2">
            <div className="flex flex-col items-end">
              <div>This beatmap is currently unranked, to be able</div>
              <div>
                to earn rhythm points it should be nominated and approved.
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
      <div className="flex flex-col">
        <div className="font-bold">Map preview</div>
        <div className="text-sm text-neutral-400">
          Click and press Space to visualize
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src="https://rhythia-online-visualizer.vercel.app/"
        height={440}
        className="overflow-hidden rounded-lg w-full border-[1px] shadow-md max-md:hidden"
        onLoad={() => {
          iframeRef.current?.contentWindow?.postMessage(
            { type: "map", map: map.id },
            "*"
          );
        }}
      ></iframe>
      <hr />

      <form
        className="flex flex-col items-end "
        onSubmit={async (event) => {
          event.preventDefault();

          const value = (
            (event.currentTarget.elements as any).comment as HTMLTextAreaElement
          ).value;

          if (!value) {
            toast({
              title: "Oops",
              description: "Make sure to write something before posting!",
              variant: "destructive",
            });
            return;
          }

          await postBeatmapComment({
            session: await getJwt(),
            content: value,
            page: map.id || -1,
          });
          location.reload();
        }}
      >
        <div className="flex justify-between w-full mt-5">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold ">Post a comment</h1>
            <h1 className="text-sm text-neutral-500">Markdown is enabled</h1>
          </div>
          <Button type="submit">Post comment</Button>
        </div>

        <Textarea
          placeholder="Your comment..."
          name="comment"
          className="h-32 mt-4"
        />
      </form>

      {comments
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((comment) => (
          <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 px-4 text-sm border-[1px] border-neutral-800 flex flex-col gap-4 ">
            <div className="flex gap-2 items-start max-md:flex-col">
              <div className="flex items-center gap-2 border-2 px-4 py-1 rounded-md pl-3">
                <img
                  src={comment.profiles.avatar_url || ""}
                  alt=""
                  className="rounded-full border-4 border-neutral-800 min-w-6 min-h-6 w-6 h-6"
                />
                <a
                  className="text-purple-400 hover:underline"
                  href={`/player/${comment.owner}`}
                >
                  {comment.profiles.username}
                </a>
                <BsFillCircleFill className="w-1"></BsFillCircleFill>
                <div className="italic text-xs">
                  {new Date(comment.created_at).toDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-1 rounded-md pl-3 -mt-3 ">
                <div className="flex gap-2 mt-3 max-md:justify-center max-md:-ml-2 max-md:flex-wrap">
                  {(comment.profiles.badges as Array<string>).map((badge) => {
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
              </div>
            </div>
            <hr />
            <div className="w-full h-full relative overflow-hidden">
              <Markdown
                className={
                  "prose min-w-[100%] h-full prose-sm dark:prose-invert prose-neutral dark prose-h1:mb-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-li:my-0 prose-ol:m-0 prose-ul:m-0 "
                }
                remarkPlugins={[remarkGfm]}
              >
                {comment.content}
              </Markdown>
            </div>
          </div>
        ))}
    </div>
  );
}
