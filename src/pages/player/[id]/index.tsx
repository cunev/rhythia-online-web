import { Navigate } from "@/router";
import { toast } from "@/shadcn/ui/use-toast";
import { useLoaderData } from "react-router-dom";
import { getProfile, getUserScores } from "rhythia-api";
import { getJwt } from "../../../supabase";
import { LoaderData } from "../../../types";
import { UserPage } from "../_components/UserPage";

export const Loader = async ({ params }: any) => {
  return {
    getProfile: await getProfile({
      id: Number(params.id),
      session: await getJwt(),
    }),
    scores: await getUserScores({
      id: Number(params.id),
      session: await getJwt(),
    }),
  };
};

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export default function UserProfile() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;

  if (!loaderData.getProfile.user) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }

  return (
    <UserPage profile={loaderData.getProfile} scores={loaderData.scores} />
  );
}
