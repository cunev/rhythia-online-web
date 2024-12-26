import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import { useLoaderData } from "react-router-dom";
import { getLeaderboard } from "rhythia-api";
import { Leaders } from "./_components/leaders";

export const Loader = async (data: any) => {
  const url = new URL(location.href);
  return {
    leads: await getLeaderboard({
      page: Number(url.searchParams.get("page") || "1"),
      session: await getJwt(),
      flag: data.params.flag.toUpperCase(),
      spin: localStorage["spin"] === "true",
    }),
    flag: data.params.flag,
  };
};

export default function LeaderboardPage() {
  const leaders = useLoaderData() as LoaderData<typeof Loader>;
  return <Leaders leaders={leaders.leads} currentFlag={leaders.flag} />;
}
