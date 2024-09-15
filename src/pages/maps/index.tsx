import { FaFileUpload } from "react-icons/fa";
import { IoMdMusicalNote } from "react-icons/io";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BeatmapCard } from "./_components/BeatmapCard";
import { getBeatmaps } from "rhythia-api";
import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import Pagination from "../leaderboards/_components/pagiantions";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const Loader = async ({ params }: any) => {
  const url = new URL(location.href);
  return {
    getBeatmap: await getBeatmaps({
      page: Number(url.searchParams.get("page") || "1"),
      textFilter: String(url.searchParams.get("filter") || ""),
      session: await getJwt(),
    }),
  };
};

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;
const makeVirtualPath = (text: number | string) => {
  const newPath = `/maps?filter=${text}`;
  window.history.pushState(null, "", newPath);
};

export default function BeatmapPage() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const debounced = useDebouncedCallback((value) => {
    makeVirtualPath(value);
    navigate("/maps?filter=" + value, { replace: true });
  }, 300);
  return (
    <div className="space-y-3 text-white">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <IoMdMusicalNote size={24} />
          <div className="text-2xl font-bold">Maps</div>
        </div>
        <Link to={`/maps/upload`}>
          <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
            <FaFileUpload />
            Upload your map
          </div>
        </Link>
      </div>

      <input
        className="bg-neutral-900 w-full h-14 shadow-md rounded-sm outline-none placeholder:text-neutral-700 px-4 text-xl font-medium text-white border-[1px] border-neutral-800"
        placeholder="search map by name, creator or genre..."
        value={search}
        onChange={(ev) => {
          setSearch(ev.target.value);
          debounced(ev.target.value);
        }}
      />
      <div className="w-full grid grid-cols-2 gap-4">
        {(loaderData.getBeatmap.beatmaps || []).map((beatmap) => (
          <BeatmapCard
            starRating={beatmap.starRating || 0}
            id={beatmap.id}
            title={beatmap.title || ""}
            difficulty={beatmap.difficulty || 0}
            image={beatmap.image || ""}
            ranked={!!beatmap.ranked}
            owner={beatmap.owner || 0}
            ownerUsername={beatmap.ownerUsername || ""}
            playcount={beatmap.playcount || 0}
          />
        ))}
      </div>
      {search == "" && (
        <Pagination
          currentPage={loaderData.getBeatmap.currentPage}
          totalItems={loaderData.getBeatmap.total}
          viewPerPages={loaderData.getBeatmap.viewPerPage}
        />
      )}
    </div>
  );
}
