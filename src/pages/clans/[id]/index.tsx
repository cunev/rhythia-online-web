import { badges } from "@/pages/player/_components/UserPage";
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
import { Card, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import { useState } from "react";
import Markdown from "react-markdown";
import { useLoaderData } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { getClan } from "rhythia-api";

export const Loader = async ({ params }: any) => {
  const jwt = await getJwt();
  return {
    getClan: await getClan({
      id: Number(params.id),
      session: jwt,
    }),
  };
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export default function SpecificClan() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const [isOpen, setIsOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");

  const clan = loaderData.getClan;
  console.log(loaderData);
  return (
    <>
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
      <div className="grid grid-cols-3 gap-4 items-start">
        <div className="flex flex-col gap-4">
          <Card className="bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800">
            <CardHeader className="w-full flex items-center gap-3">
              <img
                src={clan.avatar_url || ""}
                className="rounded-md border-8 h-28 w-28"
                onError={(event) => {
                  (
                    event.target as HTMLImageElement
                  ).src = `https://a.ppy.sh/u/1`;
                }}
              />
              <div className="flex flex-col items-center">
                <div className="text-lg font-bold">
                  <span className="font-extrabold text-indigo-500">
                    [{clan.acronym}]
                  </span>{" "}
                  {clan.name}
                </div>
                <div className="opacity-65">Rhythia Clan</div>
              </div>
            </CardHeader>
          </Card>
          <div className="flex flex-col">
            <div className="font-bold">Active members</div>
            <div className="text-xs opacity-75">
              List of members that contribute to this clan
            </div>
          </div>

          {clan.users.map((user) => (
            <div
              className="flex flex-col items-end justify-between w-full bg-neutral-900 shadow-md drop-shadow-md rounded-sm p-2 text-sm border-[1px] border-neutral-800 gap-2 relative overflow-hidden bg-cover"
              style={{ backgroundImage: `url(${user.profile_image})` }}
            >
              <div className="bg-gradient-to-b from-transparent  to-neutral-900 absolute top-0 left-0 w-full h-16 via-[#0a0a0a9f] -z-20"></div>
              <div className="bg-neutral-900 absolute top-16 left-0 h-full -z-10 w-full"></div>
              <div className="bg-neutral-900 absolute top-0 left-0 h-full -z-10 w-full opacity-65"></div>

              <div className="flex items-start justify-between w-full">
                <div className="flex items-center h-full gap-2">
                  <img
                    src={user.avatar_url || "https://a.ppy.sh/u/1"}
                    onError={(event) => {
                      (
                        event.target as HTMLImageElement
                      ).src = `https://a.ppy.sh/u/1`;
                    }}
                    className="h-12 min-w-12 rounded-full border-4 w-12 object-cover"
                  />
                  <div className="flex-col">
                    <div className="font-bold text-lg h-6 p-0 -mt-2 text-left">
                      {user.username}
                    </div>
                    <div className="flex gap-2 items-center mt-[1px] min-w-9">
                      <img
                        src={`/flags/${user.flag || "US"}.` + "svg"}
                        className="w-4"
                      />
                      <div className="text-xs font-semibold text-neutral-300 ">
                        {regionNames.of(user.flag || "US")}
                      </div>
                      {/*  */}
                    </div>
                  </div>
                </div>

                <div className="flex-col justify-end min-w-12 mr-1">
                  <div className="z-40 text-white text-xl font-extrabold  text-right">
                    {user.skill_points}{" "}
                    <span className="text-sm font-medium">RP</span>
                  </div>
                  <div className="text-sm h-6 p-0 -mt-1 text-right">
                    Place #{user.position}
                  </div>
                </div>
              </div>

              {user.badges.length ? (
                <div className="w-full">
                  <div className="w-full h-[1px] bg-neutral-800 my-1 mb-2"></div>
                  <div className="flex gap-[-1px] flex-wrap justify-end">
                    {(user.badges as Array<string>).map((badge) => {
                      return (
                        <div className="scale-[0.7] -mr-1">
                          {badges[badge] || <></>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full col-span-2 ">
          <Card className="bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800 p-4">
            <div className="font-bold text-neutral-500 text-base">
              Description
            </div>
            <hr className="my-4" />
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
                      setPendingUrl(props.href || "");
                      setIsOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  />
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {clan.description || "No description provided"}
            </Markdown>
          </Card>
          <Card className="bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800 p-4">
            <div className="font-bold text-neutral-500 text-base">
              Tournaments
            </div>
            <hr className="my-4" />
            <div className="text-white w-full flex flex-col justify-center items-center gap-2">
              <img
                src={"/not_found.png"}
                width={40}
                height={40}
                alt="Notfound"
              />
              <div className="opacity-75 italic">
                This clan hasn't participated in any tournament
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
