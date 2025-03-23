import { FaFileUpload, FaReadme, FaSearch } from "react-icons/fa";
import { IoMdMusicalNote } from "react-icons/io";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BeatmapCard } from "./_components/BeatmapCard";
import { getBeatmaps } from "rhythia-api";
import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import Pagination from "../leaderboards/_components/pagiantions";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { RctBanner } from "./_components/RctBanner";

export const Loader = async ({ params }: any) => {
  const url = new URL(location.href);
  return {
    getBeatmap: await getBeatmaps({
      page: Number(url.searchParams.get("page") || "1"),
      textFilter: String(url.searchParams.get("filter") || ""),
      authorFilter: String(url.searchParams.get("author") || ""),
      tagsFilter: String(url.searchParams.get("tags") || ""),
      minStars: Number(url.searchParams.get("minStars") || 0),
      maxStars: Number(url.searchParams.get("maxStars") || 20),
      status: String(url.searchParams.get("status") || "RANKED"),
      session: await getJwt(),
    }),
  };
};

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;
const makeVirtualPath = (
  text: number | string,
  status: string,
  minStars: number,
  maxStars: number,
  author: string,
  tags: string
) => {
  const newPath = `/maps?filter=${text}&status=${
    status == "Any" ? "" : status
  }&minStars=${minStars}&maxStars=${maxStars}&author=${author}&tags=${tags}`;
  window.history.pushState(null, "", newPath);
};

export default function BeatmapPage() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const curPath = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(curPath.get("filter") || "");
  const [author, setAuthor] = useState(curPath.get("author") || "");
  const [tags, setTags] = useState(curPath.get("tags") || "");
  const [ranked, setRanked] = useState(curPath.get("status") || "RANKED");
  const [minStars, setMinStars] = useState(
    Number(curPath.get("minStars")) || 0
  );
  const [maxStars, setMaxStars] = useState(
    Number(curPath.get("maxStars")) || 20
  );
  const navigate = useNavigate();

  const debounced = useDebouncedCallback(() => {
    makeVirtualPath(search, ranked, minStars, maxStars, author, tags);
    let vRank = ranked;
    if (ranked == "Any") {
      vRank = "UNRANKED";
    }
    navigate(
      `/maps?filter=${search}&status=${vRank}&minStars=${minStars}&maxStars=${maxStars}&author=${author}&tags=${tags}`,
      { replace: true }
    );
  }, 300);

  return (
    <div className="space-y-3 text-white">
      <RctBanner hue={120} />
      <hr />
      <div className="flex justify-between items-center max-md:flex-col max-md:justify-start max-md:items-start max-md:gap-4">
        <div className="flex space-x-2 items-center">
          <IoMdMusicalNote size={24} />
          <div className="text-2xl font-bold">Maps</div>
        </div>

        <div className="flex gap-2  max-md:flex-col max-md:w-full">
          <Link to={`/maps/criteria`}>
            <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
              <FaReadme />
              How to rank maps
            </div>
          </Link>
          <Link to={`/maps/find`}>
            <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
              <FaSearch />
              Find RCT & MMT
            </div>
          </Link>
          <Link to={`/maps/upload`}>
            <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
              <FaFileUpload />
              Upload your map
            </div>
          </Link>
        </div>
      </div>

      <input
        className="bg-neutral-900 w-full h-14 shadow-md rounded-sm outline-none placeholder:text-neutral-700 px-4 text-xl font-medium text-white border-[1px] border-neutral-800"
        placeholder="search map by name, creator or genre..."
        value={search}
        onChange={(ev) => {
          setSearch(ev.target.value);
          debounced();
        }}
      />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 max-md:flex-col">
          <div className="flex flex-col gap-1">
            <div className="text-white text-sm ml-1 font-bold">
              Ranked status
            </div>
            <Select
              defaultValue={ranked}
              onValueChange={(value) => {
                setRanked(value);
                debounced();
              }}
            >
              <SelectTrigger className="w-[180px] max-md:w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="RANKED">Ranked</SelectItem>
                <SelectItem value="APPROVED">Legacy</SelectItem>
                <SelectItem value="UNRANKED">Unranked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-white text-sm ml-1 font-bold">
              Minimum stars
            </div>
            <Input
              placeholder="Star rating"
              type="number"
              value={minStars}
              onChange={(val) => {
                setMinStars(Number(val.target.value));
                debounced();
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-white text-sm ml-1 font-bold">
              Maximum stars
            </div>
            <Input
              placeholder="Star rating"
              type="number"
              value={maxStars}
              onChange={(val) => {
                setMaxStars(Number(val.target.value));
                debounced();
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-white text-sm ml-1 font-bold">Author</div>
            <Input
              placeholder="Specific author"
              type="text"
              value={author}
              onChange={(val) => {
                setAuthor(val.target.value);
                debounced();
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-white text-sm ml-1 font-bold">Tag</div>
            <Input
              placeholder="Specific tags"
              type="text"
              value={tags}
              onChange={(val) => {
                setTags(val.target.value);
                debounced();
              }}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {(loaderData.getBeatmap.beatmaps || []).map((beatmap) => (
            <BeatmapCard
              key={beatmap.id}
              starRating={beatmap.starRating || 0}
              id={beatmap.id}
              title={beatmap.title || ""}
              difficulty={beatmap.difficulty || 0}
              image={beatmap.image || ""}
              status={beatmap.status || ""}
              owner={beatmap.owner || 0}
              ownerUsername={beatmap.ownerUsername || ""}
              playcount={beatmap.playcount || 0}
              url={beatmap.beatmapFile || ""}
              length={beatmap.length || 0}
            />
          ))}
        </div>
      </div>

      <Pagination
        currentPage={loaderData.getBeatmap.currentPage}
        totalItems={loaderData.getBeatmap.total}
        viewPerPages={loaderData.getBeatmap.viewPerPage}
      />
    </div>
  );
}
