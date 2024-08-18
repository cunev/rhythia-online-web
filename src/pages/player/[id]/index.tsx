import { Navigate } from "@/router";
import { toast } from "@/shadcn/ui/use-toast";
import { useLoaderData } from "react-router-dom";
import { getProfile } from "rhythia-api";
import { getJwt } from "../../../supabase";
import { LoaderData } from "../../../types";
import { UserPage } from "../_components/UserPage";

export const Loader = async ({ params }: any) => {
  return await getProfile({
    id: Number(params.id),
    session: await getJwt(),
  });
};

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export default function UserProfile() {
  const profile = useLoaderData() as LoaderData<typeof Loader>;

  if (!profile.user) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }

  return <UserPage profile={profile} />;
}
