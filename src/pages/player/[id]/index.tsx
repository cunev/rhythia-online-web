import { Navigate } from "@/router";
import { toast } from "@/shadcn/ui/use-toast";
import { useLoaderData, useParams, useSearchParams } from "react-router-dom";
import { getBeatmaps, getProfile, getUserScores } from "rhythia-api";
import { getJwt } from "../../../supabase";
import { LoaderData } from "../../../types";
import { UserPage } from "../_components/UserPage";
import { useAsync } from "react-async";
import { useCallback, useEffect } from "react";

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

export default function UserProfile() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");

  const loadScores = useCallback(async () => {
    return await getUserScores({
      id: Number(id),
      session: await getJwt(),
      limit: 10,
    });
  }, [id]);
  const {
    data: scores,
    isPending: scoresLoading,
    run: runScores,
  } = useAsync({ deferFn: loadScores });
  useEffect(() => {
    if (id) runScores();
  }, [id, runScores]);

  const loadBeatmaps = useCallback(async () => {
    return await getBeatmaps({
      page,
      creator: Number(id),
      session: await getJwt(),
    });
  }, [id, page]);
  const {
    data: beatmaps,
    isPending: beatmapsLoading,
    run: runBeatmaps,
  } = useAsync({ deferFn: loadBeatmaps });
  useEffect(() => {
    if (id) runBeatmaps();
  }, [id, page, runBeatmaps]);

  if (!loaderData.getProfile.user) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }

  return (
    <UserPage
      profile={loaderData.getProfile}
      scores={(scores as any) || { top: [], lastDay: [], reign: [] }}
      beatmaps={(beatmaps as any) || { beatmaps: [] }}
      scoresLoading={scoresLoading}
      beatmapsLoading={beatmapsLoading}
    />
  );
}
