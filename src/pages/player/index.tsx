import { toast } from "@/shadcn/ui/use-toast";
import { Navigate, useLoaderData } from "react-router-dom";
import { getProfile, getUserScores } from "rhythia-api";
import { getJwt } from "../../supabase";
import { LoaderData } from "../../types";
import { UserPage } from "./_components/UserPage";

const makeVirtualPath = (profileId: number | string) => {
  const newPath = `/player/${profileId}`; // or append something like '?key=value'
  window.history.pushState(null, "", newPath);
};

export const Loader = async () => {
  const profile = await getProfile({
    session: await getJwt(),
  });

  return {
    getProfile: profile,
    scores: await getUserScores({
      id: Number(profile.user?.id),
      session: await getJwt(),
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
    <UserPage profile={loaderData.getProfile} scores={loaderData.scores} />
  );
}
