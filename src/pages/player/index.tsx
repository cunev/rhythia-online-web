import { toast } from "@/shadcn/ui/use-toast";
import { Navigate, useLoaderData } from "react-router-dom";
import { getBeatmaps, getProfile, getUserScores } from "rhythia-api";
import { getJwt } from "../../supabase";
import { LoaderData } from "../../types";
import { UserPage } from "./_components/UserPage";

const makeVirtualPath = (profileId: number | string) => {
  const newPath = `/player/${profileId}`; // or append something like '?key=value'
  window.history.pushState(null, "", newPath);
};

export const Loader = async ({ params }: any) => {
  const url = new URL(location.href);
  const jwt = await getJwt();

  return {
    getProfile: await getProfile({
      id: Number(params.id),
      session: jwt,
    }),
    scores: await getUserScores({
      id: Number(params.id),
      session: jwt,
      limit: 10,
    }),
    beatmaps: await getBeatmaps({
      page: Number(url.searchParams.get("page") || "1"),
      creator: Number(params.id),
      session: jwt,
    }),
  };
};
export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export default function MyProfile() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;

  if (!loaderData.getProfile.user) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }
  makeVirtualPath(loaderData.getProfile.user.id);
  return (
    <UserPage
      profile={loaderData.getProfile}
      scores={loaderData.scores}
      beatmaps={loaderData.beatmaps as any}
    />
  );
}
