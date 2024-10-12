import { Input } from "@/shadcn/ui/input";
import { Progress } from "@/shadcn/ui/progress";
import { toast } from "@/shadcn/ui/use-toast";
import { getJwt } from "@/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMapUploadUrl,
  createBeatmap,
  createBeatmapPage,
  updateBeatmapPage,
} from "rhythia-api";

export default function BeatmapUpload() {
  const beatmaps: any[] = [];
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Uploading...");
  const navigate = useNavigate();
  return (
    <div className="space-y-5 text-white">
      <img
        src={"/addmascot.png"}
        width={500}
        alt=""
        className="absolute z-10 top-20 ml-14 select-none"
      />
      <div className="relative overflow-hidden h-36 rounded-md border-[1px] border-neutral-800">
        <video
          src="https://static.rhythia.com/bg.mp4#t=10"
          className="mt-[-200px]"
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute top-0 w-full h-full bg-neutral-900 opacity-70"></div>
        <div className="absolute top-0 w-full h-full z-10 flex flex-col items-end justify-center p-10">
          <div className="text-2xl font-bold">Upload your own beatmap</div>
          <div className="text-xl font-thin">Leaderboards included!</div>
        </div>
      </div>
      {uploading && (
        <div className="space-y-3">
          <div className="space-y-0">
            <p className="text-2xl font-bold">Uploading...</p>
            <p className="text-lg opacity-75">{progressText}</p>
          </div>

          <Progress value={progress} />
        </div>
      )}
      <Input
        id="name"
        type="file"
        accept=".sspm"
        disabled={uploading}
        className="col-span-3 file:text-white text-transparent"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
              try {
                setUploading(true);

                const jwt = await getJwt();
                setProgressText("Retrieving upload url...");
                setProgress(25);
                const res = await getMapUploadUrl({
                  session: jwt,
                  contentLength: (e.target?.result as ArrayBuffer).byteLength,
                  contentType: "application/octet-stream",
                });

                setProgressText("Uploading beatmap file...");
                setProgress(50);

                const result = await fetch(res.url!, {
                  method: "PUT",
                  body: e.target?.result as ArrayBuffer,
                  headers: {
                    "Content-Type": "application/octet-stream",
                  },
                });

                setProgressText("Parsing beatmap file...");
                setProgress(75);

                const url = `https://static.rhythia.com/${res.objectKey}`;
                const beatmap = await createBeatmap({ url, session: jwt });

                if (beatmap.error) {
                  throw beatmap.error;
                }

                if (!beatmap.hash) {
                  return;
                }

                setProgress(95);
                setProgressText("Creating beatmap page...");
                const page = await createBeatmapPage({ session: jwt });
                if (beatmap.error) {
                  throw page.error;
                }

                if (!page.id) {
                  return;
                }
                await updateBeatmapPage({
                  session: jwt,
                  beatmapHash: beatmap.hash,
                  id: page.id,
                });
                setProgressText("Redirecting to beatmap page...");
                setProgress(100);

                setTimeout(() => {
                  navigate(`/maps/${page.id}`);
                });
              } catch (error: any) {
                toast({
                  title: "Oops",
                  description: error.toString(),
                  variant: "destructive",
                });
              }
            };
            reader.readAsArrayBuffer(file);
          }
        }}
      />
    </div>
  );
}
