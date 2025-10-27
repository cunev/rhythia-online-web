import { toast } from "@/shadcn/ui/use-toast";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProfile } from "rhythia-api";
import { getJwt } from "../../supabase";
import { LoaderData } from "../../types";

const makeVirtualPath = (profileId: number | string) => {
  const newPath = `/player/${profileId}`; // or append something like '?key=value'
  window.history.pushState(null, "", newPath);
};

export const Loader = async ({ params }: any) => {
  const jwt = await getJwt();
  return {
    getProfile: await getProfile({
      id: Number(params.id),
      session: jwt,
    }),
  };
};
export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export default function MyProfile() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const navigate = useNavigate();

  if (!loaderData.getProfile.user) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }
  useEffect(() => {
    navigate(`/player/${loaderData.getProfile.user!.id}`, { replace: true });
  }, [navigate, loaderData.getProfile.user?.id]);
  return null;
}
