import { ExternalLink } from "lucide-react";
import { PiDownloadFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { updates } from "./updates";
import { BsCircleFill } from "react-icons/bs";
import { Button } from "@/shadcn/ui/button";

export default function Downloads() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="flex space-x-2 items-center">
            <PiDownloadFill size={24} />
            <div className="text-2xl font-bold">Downloads</div>
          </div>

          <div className="text-base opacity-75">
            List of online versions and releases.
          </div>
        </div>
      </div>

      <div className="flex gap-2 max-md:flex-col">
        <Link
          style={{ filter: "hue-rotate(12deg)" }}
          className="w-full  hover:scale-[1.02] hover:z-50 transition-all"
          to={
            "https://github.com/cunev/rhythia-online-release/releases/download/testing-client/rhythia-online.zip"
          }
        >
          <div className="bg-[url(/bgdownload.png)] h-36 rounded-md border-[1px] border-neutral-800 relative overflow-hidden flex flex-col justify-center px-8">
            <img
              src="/magic.png"
              alt=""
              className="absolute w-[400px] -right-32 top-1/2 -translate-y-1/2"
            />
            <div className="text-xl font-extrabold">Latest Testing Version</div>
            <div className="flex gap-2 items-center">
              <div className="text-2xl font-normal cursor-pointer">
                Download Online Version
              </div>
              <ExternalLink />
            </div>
          </div>
        </Link>

        <Link
          className="w-full  hover:scale-[1.02] hover:z-50 transition-all"
          to={"https://github.com/David20122/sound-space-plus/releases"}
        >
          <div className="bg-[url(/bgdownload.png)] h-36 rounded-md border-[1px] border-neutral-800 relative overflow-hidden flex flex-col justify-center px-8">
            <img
              src="/magic.png"
              alt=""
              className="absolute w-[400px] -right-32 top-1/2 -translate-y-1/2"
            />
            <div className="text-xl font-extrabold">Stable Offline Version</div>
            <div className="flex gap-2 items-center">
              <div className="text-2xl font-normal cursor-pointer">
                Download Offline Version
              </div>
              <ExternalLink />
            </div>
          </div>
        </Link>
      </div>
      {updates.map((update) => (
        <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 ">
          <div className="text-neutral-500 font-extrabold flex items-center gap-2">
            <span className="text-white">{update.version}</span>
            <BsCircleFill size={5} />
            <span className="text-white">{update.date}</span>
            <BsCircleFill size={5} />
            <Link to={"/player/" + update.authorId} className="hover:underline">
              <span className="text-indigo-400">{update.author}</span>
            </Link>
          </div>
          <hr className="my-2" />
          <Markdown
            className={
              "prose prose-sm dark:prose-invert prose-neutral dark min-w-full prose-h1:mb-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-li:my-0 prose-ol:m-0 prose-ul:m-0 overflow-hidden relative"
            }
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {update.content}
          </Markdown>
          <Link
            className="w-full hover:scale-[1.02] hover:z-50 transition-all"
            to={update.link}
          >
            <Button className="mt-2">Download this version</Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
