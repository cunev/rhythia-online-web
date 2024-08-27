import { Navigate } from "@/router";
import { toast } from "@/shadcn/ui/use-toast";
import { Dot } from "lucide-react";
import { BsStarFill, BsTrophyFill } from "react-icons/bs";
import { Link, useLoaderData } from "react-router-dom";
import { getScore } from "rhythia-api";
import { getJwt } from "../../../supabase";
import { LoaderData } from "../../../types";

export const Loader = async ({ params }: any) => {
  return await getScore({
    id: Number(params.id),
    session: await getJwt(),
  });
};

export const Action = () => "Route action";
export const Catch = () => <div>Something went wrong...</div>;
export const Pending = () => <div>Loading...</div>;

export default function UserProfile() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;

  if (!loaderData.score) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }

  return <ScorePage score={loaderData.score} />;
}

export function ScorePage({
  score,
}: {
  score: Awaited<ReturnType<typeof getScore>>["score"];
}) {
  if (!score) return;
  if (score.misses == null || !score.beatmapNotes || !score.beatmapDifficulty)
    return <></>;

  let difficultyBadge = (
    <div className="bg-purple-600 z-10 px-2 rounded-sm border-purple-500 border-[1px] font-bold flex gap-2 items-center">
      <BsStarFill /> LOGIC
    </div>
  );

  if (score.beatmapDifficulty == 1) {
    difficultyBadge = (
      <div className="bg-green-600 z-10 px-2 rounded-sm border-green-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> EASY
      </div>
    );
  }
  if (score.beatmapDifficulty == 2) {
    difficultyBadge = (
      <div className="bg-yellow-600 z-10 px-2 rounded-sm border-yellow-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> MEDIUM
      </div>
    );
  }
  if (score.beatmapDifficulty == 5) {
    difficultyBadge = (
      <div className="bg-neutral-800 z-10 px-2 rounded-sm border-neutral-700 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> TATSUKETE
      </div>
    );
  }
  if (score.beatmapDifficulty == 3) {
    difficultyBadge = (
      <div className="bg-red-600 z-10 px-2 rounded-sm border-red-500 border-[1px] font-bold flex gap-2 items-center">
        <BsStarFill /> HARD
      </div>
    );
  }

  const acc = Math.round((1 - score.misses / score.beatmapNotes) * 10000) / 100;
  let letterRank = "F";
  let color = "#ff8282";

  if (acc == 100) {
    letterRank = "SS";
    color = "#91fffa";
  } else if (acc >= 98) {
    letterRank = "S";
    color = "#91fffa";
  } else if (acc >= 95) {
    letterRank = "A";
    color = "#91ff92";
  } else if (acc >= 90) {
    letterRank = "B";
    color = "#e7ffc0";
  } else if (acc >= 85) {
    letterRank = "C";
    color = "#fcf7b3";
  } else if (acc >= 80) {
    letterRank = "D";
    color = "#fcd0b3";
  }
  return (
    <div className="border-[1px] px-4 py-2 rounded-md border-neutral-800 bg-neutral-900 flex justify-start items-center">
      <Chart percent={acc} color={color} />
      <div className="flex gap-2 items-start w-full h-full flex-col px-8 justify-center">
        <div
          className="text-8xl flex items-center justify-center font-bold"
          style={{ color }}
        >
          {letterRank}
        </div>

        <div className="w-full relative">
          <div className="flex w-full justify-between items-center">
            <div className="font-extrabold text-2xl  flex items-center">
              {score.beatmapTitle}
            </div>

            {difficultyBadge}
          </div>
          <div className="flex w-full justify-between">
            <div className="flex flex-col justify-center">
              <Link to={`/player/${score.userId}`}>
                <div className="text-base hover:underline">
                  played by {score.username}
                </div>
              </Link>
              <div className="text-xs text-neutral-400">
                played on {new Date(score.created_at).toUTCString()}
              </div>
            </div>
            <div className="flex gap-2 text-xs max-md:flex-col font-bold max-md:items-end max-md:min-w-16 justify-end">
              <div className="flex gap-2 items-center ">
                <BsTrophyFill className="max-md:hidden" />
                {score.awarded_sp} SP
              </div>
              <div className="flex gap-2 items-center ">
                <Dot className="max-md:hidden" />
                {score.misses} MISS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ChartConfig, ChartContainer } from "@/shadcn/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartData = [
  { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "rgb(236 72 153)",
  },
} satisfies ChartConfig;

export function Chart({ percent, color }: { percent: number; color: string }) {
  chartConfig.safari.color = color;
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-64 min-w-64 w-64 h-64"
    >
      <RadialBarChart
        data={chartData}
        endAngle={90 - (360 * percent) / 100}
        startAngle={90}
        innerRadius={90}
        outerRadius={140}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-neutral-900 "
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="visitors" background />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {percent}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Percent
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
