import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import { useLoaderData } from "react-router-dom";
import { getLeaderboard } from "rhythia-api";
import { Leaders } from "./_components/leaders";

export const Loader = async () => {
  const url = new URL(location.href);
  return await getLeaderboard({
    page: Number(url.searchParams.get("page") || "1"),
    session: await getJwt(),
    spin: localStorage["spin"] === "true",
  });
};

export default function LeaderboardPage() {
  const leaders = useLoaderData() as LoaderData<typeof Loader>;
  return <Leaders leaders={leaders} />;
}
