import { FaFileUpload, FaReadme, FaSearch } from "react-icons/fa";
import { IoMdMusicalNote } from "react-icons/io";
import { ChevronDown, X, Eye } from "lucide-react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BeatmapCard } from "./_components/BeatmapCard";
import { getBeatmaps } from "rhythia-api";
import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import Pagination from "../leaderboards/_components/pagiantions";
import { useEffect, useState, useRef } from "react";
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [previewMapId, setPreviewMapId] = useState<number | null>(null);
  const [previewMapTitle, setPreviewMapTitle] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  const debounced = useDebouncedCallback(
    (
      searchVal = search,
      rankedVal = ranked,
      minStarsVal = minStars,
      maxStarsVal = maxStars,
      authorVal = author,
      tagsVal = tags
    ) => {
      makeVirtualPath(
        searchVal,
        rankedVal,
        minStarsVal,
        maxStarsVal,
        authorVal,
        tagsVal
      );
      navigate(
        `/maps?filter=${searchVal}&status=${rankedVal}&minStars=${minStarsVal}&maxStars=${maxStarsVal}&author=${authorVal}&tags=${tagsVal}`,
        { replace: true }
      );
    },
    300
  );

  return (
    <div className="space-y-3 text-white">
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-lg pr-4 py-4 pl-0 flex items-center gap-4 mb-3 overflow-hidden relative">
        <div className="w-24 h-full absolute left-0 top-0 overflow-hidden">
          <img
            src="/maphelper.png"
            alt="Map Helper"
            className="absolute w-24 h-40 object-contain -bottom-14"
          />
        </div>
        <div className="flex-1 ml-28">
          <h3 className="text-lg font-bold text-white mb-1">
            How to Install Maps
          </h3>
          <p className="text-gray-300 text-sm">
            Download maps from the website or in-game, then drag the downloaded
            file onto the game window to install.
          </p>
        </div>
      </div>

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

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={ranked === "RANKED"}
              onClick={() => {
                const newRanked = ranked === "RANKED" ? "UNRANKED" : "RANKED";
                setRanked(newRanked);
                debounced(search, newRanked, minStars, maxStars, author, tags);
              }}
              className={`
                relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-gray-900
                ${ranked === "RANKED" ? "bg-purple-600" : "bg-gray-600"}
              `}
            >
              <span
                className={`
                  inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out
                  ${ranked === "RANKED" ? "translate-x-5" : "translate-x-1"}
                `}
              />
            </button>
            <span className="text-sm text-gray-300">Earn RP (Ranked Maps)</span>
          </label>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Advanced Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAdvancedFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 max-md:grid-cols-2">
          <button
            onClick={() => {
              setMinStars(0);
              setMaxStars(20);
              setSearch("");
              setAuthor("");
              setTags("");
              debounced("", ranked, 0, 20, "", "");
            }}
            className={`${
              minStars === 0 &&
              maxStars === 20 &&
              search === "" &&
              author === "" &&
              tags === ""
                ? "bg-purple-900/50 border-purple-600 text-white hover:bg-purple-900/70"
                : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            } border rounded-lg px-4 py-2 text-center transition-colors`}
          >
            <div className="text-white font-semibold text-sm">Any Maps</div>
            <div
              className={`${
                minStars === 0 &&
                maxStars === 20 &&
                search === "" &&
                author === "" &&
                tags === ""
                  ? "text-purple-300"
                  : "text-gray-400"
              } text-xs`}
            >
              All difficulties
            </div>
          </button>

          <button
            onClick={() => {
              setMinStars(0);
              setMaxStars(3);
              debounced(search, ranked, 0, 3, author, tags);
            }}
            className={`${
              minStars === 0 && maxStars === 3
                ? "bg-purple-900/50 border-purple-600 text-white hover:bg-purple-900/70"
                : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            } border rounded-lg px-4 py-2 text-center transition-colors`}
          >
            <div className="text-white font-semibold text-sm">Beginner</div>
            <div
              className={`${
                minStars === 0 && maxStars === 3
                  ? "text-purple-300"
                  : "text-gray-400"
              } text-xs`}
            >
              ★ 0-3
            </div>
          </button>

          <button
            onClick={() => {
              setMinStars(3);
              setMaxStars(5);
              debounced(search, ranked, 3, 5, author, tags);
            }}
            className={`${
              minStars === 3 && maxStars === 5
                ? "bg-purple-900/50 border-purple-600 text-white hover:bg-purple-900/70"
                : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            } border rounded-lg px-4 py-2 text-center transition-colors`}
          >
            <div className="text-white font-semibold text-sm">Intermediate</div>
            <div
              className={`${
                minStars === 3 && maxStars === 5
                  ? "text-purple-300"
                  : "text-gray-400"
              } text-xs`}
            >
              ★ 3-5
            </div>
          </button>

          <button
            onClick={() => {
              setMinStars(5);
              setMaxStars(7);
              debounced(search, ranked, 5, 7, author, tags);
            }}
            className={`${
              minStars === 5 && maxStars === 7
                ? "bg-purple-900/50 border-purple-600 text-white hover:bg-purple-900/70"
                : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            } border rounded-lg px-4 py-2 text-center transition-colors`}
          >
            <div className="text-white font-semibold text-sm">Hard</div>
            <div
              className={`${
                minStars === 5 && maxStars === 7
                  ? "text-purple-300"
                  : "text-gray-400"
              } text-xs`}
            >
              ★ 5-7
            </div>
          </button>

          <button
            onClick={() => {
              setMinStars(7);
              setMaxStars(20);
              debounced(search, ranked, 7, 20, author, tags);
            }}
            className={`${
              minStars === 7 && maxStars === 20
                ? "bg-purple-900/50 border-purple-600 text-white hover:bg-purple-900/70"
                : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
            } border rounded-lg px-4 py-2 text-center transition-colors`}
          >
            <div className="text-white font-semibold text-sm">Expert</div>
            <div
              className={`${
                minStars === 7 && maxStars === 20
                  ? "text-purple-300"
                  : "text-gray-400"
              } text-xs`}
            >
              ★ 7-20
            </div>
          </button>
        </div>
      </div>

      <input
        className="bg-neutral-900 w-full h-14 shadow-md rounded-sm outline-none placeholder:text-neutral-700 px-4 text-xl font-medium text-white border-[1px] border-neutral-800"
        placeholder="search map by name, creator or genre..."
        value={search}
        onChange={(ev) => {
          const newSearch = ev.target.value;
          setSearch(newSearch);
          debounced(newSearch, ranked, minStars, maxStars, author, tags);
        }}
      />

      {showAdvancedFilters && (
        <div className="flex gap-2 max-md:flex-col p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <div className="flex flex-col gap-1">
            <div className="text-white text-sm ml-1 font-bold">
              Ranked status
            </div>
            <Select
              value={ranked}
              onValueChange={(value) => {
                setRanked(value);
                debounced(search, value, minStars, maxStars, author, tags);
              }}
            >
              <SelectTrigger className="w-[180px] max-md:w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
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
                const newMinStars = Number(val.target.value);
                setMinStars(newMinStars);
                debounced(search, ranked, newMinStars, maxStars, author, tags);
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
                const newMaxStars = Number(val.target.value);
                setMaxStars(newMaxStars);
                debounced(search, ranked, minStars, newMaxStars, author, tags);
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
                const newAuthor = val.target.value;
                setAuthor(newAuthor);
                debounced(search, ranked, minStars, maxStars, newAuthor, tags);
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
                const newTags = val.target.value;
                setTags(newTags);
                debounced(search, ranked, minStars, maxStars, author, newTags);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
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
              videoUrl={beatmap.videoUrl || ""}
              onPreview={() => {
                setPreviewMapId(beatmap.id);
                setPreviewMapTitle(beatmap.title || "");
              }}
            />
          ))}
        </div>
      </div>

      <Pagination
        currentPage={loaderData.getBeatmap.currentPage}
        totalItems={loaderData.getBeatmap.total}
        viewPerPages={loaderData.getBeatmap.viewPerPage}
      />

      {/* Preview Popup - Desktop only */}
      {previewMapId && (
        <div className="fixed bottom-4 right-4 z-50 max-md:hidden pointer-events-none">
          <div className="bg-neutral-900 rounded-lg shadow-2xl border border-neutral-800 w-[500px] pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-800">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {previewMapTitle}
                </p>
                <p className="text-xs text-gray-400">Auto-preview</p>
              </div>
              <button
                onClick={() => setPreviewMapId(null)}
                className="p-1.5 hover:bg-neutral-800 rounded transition-colors ml-2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Preview */}
            <div className="p-3">
              <iframe
                key={previewMapId}
                ref={iframeRef}
                src={`https://rhythia-online-visualizer.vercel.app/?autoplay=true`}
                height={350}
                className="overflow-hidden rounded w-full border border-neutral-700"
                onLoad={() => {
                  setTimeout(() => {
                    iframeRef.current?.contentWindow?.postMessage(
                      { type: "map", map: previewMapId },
                      "*"
                    );
                    // Send state to auto-start
                    setTimeout(() => {
                      iframeRef.current?.contentWindow?.postMessage(
                        { type: "state", state: true },
                        "*"
                      );
                    }, 200);
                  }, 100);
                }}
              />

              <Link
                to={`/maps/${previewMapId}`}
                className="block mt-3 text-center bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
              >
                View Map Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
