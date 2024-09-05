import { FaFileUpload } from "react-icons/fa";
import { IoMdMusicalNote } from "react-icons/io";
import { Link } from "react-router-dom";
import { BeatmapCard } from "./_components/BeatmapCard";

export default function BeatmapPage() {
  const beatmaps: any[] = [];
  return (
    <div className="space-y-3 text-white">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <IoMdMusicalNote size={24} />
          <div className="text-2xl font-bold">Beatmaps</div>
        </div>
        <Link to={`/beatmaps/add`}>
          <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
            <FaFileUpload />
            Upload your beatmap
          </div>
        </Link>
      </div>

      <input
        className="bg-neutral-900 w-full h-14 shadow-md rounded-sm outline-none placeholder:text-neutral-700 px-4 text-xl font-medium text-white border-[1px] border-neutral-800"
        placeholder="search beatmap by name, creator or genre..."
      />
      <div className="w-full grid grid-cols-2 gap-4">
        {beatmaps.map((beatmap) => (
          <BeatmapCard {...beatmap} />
        ))}
      </div>

      {/* <div className="">
        <img src="https://assets.ppy.sh/beatmaps/2172170/covers/list@2x.jpg?1718907782" alt="" />
    </div> */}
    </div>
  );
}
