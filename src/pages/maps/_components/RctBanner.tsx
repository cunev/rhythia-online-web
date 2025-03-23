import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function RctBanner({ hue }: { hue: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full  hover:scale-[1.02] hover:z-50 transition-all">
          <div
            className="bg-[url(/bgdownload.png)] h-36 rounded-md border-[1px] border-neutral-800 relative overflow-hidden flex flex-col justify-center px-6 "
            style={{ filter: `hue-rotate(${hue}deg)` }}
          >
            <img
              src="/lacuna.png"
              alt=""
              className="absolute w-[170px] right-0 -top-1"
            />
            <div className="text-xl font-extrabold">Want to Rank Maps?</div>
            <div className="flex gap-2 items-center">
              <div className="text-2xl font-normal cursor-pointer">
                Apply for{" "}
                <span className="font-black text-purple-300">
                  Ranked Curation Team
                </span>
              </div>
              <ExternalLink />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] max-h-[80vh] overflow-y-scroll">
        <Render />
      </DialogContent>
    </Dialog>
  );
}
const text = `
# 📋 RCT Application

The Ranked Curation Team (RCT) is the group in charge of pushing maps to the Ranked category, with their responsibilities being to mod (provide feedback) and nominate maps, ensuring that the maps in ranked meet quality thresholds while improving mappers themselves. We are looking for people that have a clear understanding of how maps work, along with being able to communicate aspects of a map that contribute to its quality.

### If you are interested in becoming a part of the RCT, the application is now open and can be found here: 
## ‎ 
https://docs.google.com/forms/d/e/1FAIpQLScL1_FdeUlFIZ4kXtMXntcv8yf_EqWry52x5qRT1lIQoi9jTQ/viewform?usp=dialog

# ‎ 
* The application will be open for 4 months, closing on June 1st 2025 
* Applications will be reviewed at any time within the 4 months, no waiting for after applications close.
  * Applicants will be notified of their results after their application is reviewed.
  * Applicants who pass will be added to the RCT after their application is reviewed.
  * Applicants may only apply twice every application cycle.
    * Applicants must select different maps for every attempt.
    * Applicants have a cooldown period of 1 months if their initial application is denied.
# ‎ 
### General overview of the application
* Applicants will be reviewing three maps:
  * One map that is near nomination from a pool of 5 maps
  * One map that requires improvement before nomination from a pool of 5 maps
  * One map selected by the applicant
A more thorough explanation can be found in the application itself.
# ‎ 
### Useful resources
[Ranking Criteria](https://www.rhythia.com/maps/criteria)
[Mapping Fundamentals](https://wiki.rhythia.net/mapping/basic-mapping/creating-maps.html)
[Modding Discussion](https://discord.com/channels/1064060807320702996/1331158814724063285)`;
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Render() {
  return (
    <Markdown
      className={
        "prose prose-sm dark:prose-invert prose-neutral dark min-w-full prose-h1:mb-0 prose-h2:my-0 prose-h3:my-0 prose-h4:my-0 prose-li:my-0 prose-ol:m-0 prose-ul:m-0 overflow-hidden relative "
      }
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {text}
    </Markdown>
  );
}
