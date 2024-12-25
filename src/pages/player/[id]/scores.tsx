import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shadcn/ui/chart";
import { toast } from "@/shadcn/ui/use-toast";
import { getJwt } from "@/supabase";
import { LoaderData } from "@/types";
import { Link, Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
} from "recharts";
import { getProfile, getUserScores } from "rhythia-api";
import {
  badgeMap,
  badges,
  calculateWeight,
  ProfileScore,
} from "../_components/UserPage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";
import { MdVerified } from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";

export const Loader = async ({ params }: any) => {
  const jwt = await getJwt();
  return {
    getProfile: await getProfile({
      id: Number(params.id),
      session: jwt,
    }),
    scores: await getUserScores({
      id: Number(params.id),
      session: jwt,
      limit: 100,
    }),
  };
};

export default function UserScores() {
  const loaderData = useLoaderData() as LoaderData<typeof Loader>;
  const navigate = useNavigate();

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  if (!loaderData.getProfile.user) {
    toast({
      title: "Oops",
      description: "You are not authorized, please log in.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }
  const profile = loaderData.getProfile;

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => {
          navigate("../");
        }}
        className="text-neutral-400 transition-all hover:cursor-pointer hover:text-neutral-100 w-full items-center font-bold bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 flex gap-2"
      >
        <ChevronLeft />
        Go back to user profile
      </div>
      <div className="flex-col items-center w-full bg-neutral-900 shadow-md drop-shadow-md rounded-sm p-6 text-sm border-[1px] border-neutral-800 flex">
        <img
          src={profile.user!.avatar_url || "https://a.ppy.sh/u/1"}
          onError={(event) => {
            (event.target as HTMLImageElement).src = `https://a.ppy.sh/u/1`;
          }}
          className="h-40 min-w-40 rounded-full border-8 max-md:w-40 object-cover"
        />

        <div className="flex flex-col justify-center items-center">
          <div className="text-neutral-100 text-5xl drop-shadow-lg font-bold ">
            {profile.user!.username}
          </div>
          <div className="flex gap-5 mt-1 min-w-0 justify-center">
            <Link to={"/leaderboards/" + profile.user!.flag || "US"}>
              <div className="flex gap-2 items-center">
                <img
                  src={`/flags/${profile.user!.flag || "US"}.` + "svg"}
                  className="w-8"
                />
                <div className="text-lg font-semibold text-neutral-300">
                  {regionNames.of(profile.user!.flag || "US")}
                </div>
                {/*  */}
              </div>
            </Link>

            {profile.user!.is_online ? (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <div className="flex gap-2 items-center">
                      <BsCircleFill className="w-4 h-4 fill-green-600" />
                      <div className="text-lg font-semibold text-neutral-300">
                        Online
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    This user was active in the last 30 minutes.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex gap-2 items-center">
                <BsCircleFill className="w-4 h-4 fill-red-600" />
                <div className="text-lg font-semibold text-neutral-300">
                  Not online
                </div>
              </div>
            )}
            {/*  */}
          </div>
          <div className="items-center flex flex-col w-full justify-center text-white mt-4">
            <div className="text-neutral-100 text-5xl drop-shadow-lg font-bold">
              #{profile.user!.position}
            </div>
            <div className="text-sm w-full mt-4 rounded-md text-center py-2 font-bold relative overflow-hidden">
              <div className="bg-[url(unk.png)] w-full h-full absolute top-0 -z-10 saturate-0 opacity-25"></div>
              <div className="bg-green-700 w-full h-full absolute top-0 -z-10 opacity-60 "></div>
              <div className="z-40 text-white text-xl font-extrabold">
                {profile.user!.skill_points}{" "}
                <span className="text-sm font-medium">RP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Card className="bg-neutral-900 shadow-md rounded-sm text-sm border-[1px] border-neutral-800">
        <CardHeader>
          <CardTitle>User Scores Weight</CardTitle>
          <CardDescription>All the top scores, and weighted RP</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={loaderData.scores.top
                ?.map((e, i) => ({
                  date: e.created_at,
                  "Awarded RP": e.awarded_sp,
                  "Weighted RP": Math.round(
                    calculateWeight(i) * (e.awarded_sp || 0)
                  ),
                  "Score Name": e.songId,
                }))
                .toReversed()}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 0)}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent hideLabel />}
              />
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="Weighted RP"
                type="natural"
                fill="url(#fillDesktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <Area
                dataKey="Awarded RP"
                type="natural"
                fill="url(#fillMobile)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Scores are ordered by Awarded RP <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total of {loaderData.scores.top?.length} scores
          </div>
        </CardFooter>
      </Card>
      <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800 flex gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <img src="/spinman.png" alt="" className="h-20" />
          <div className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              This user is a{" "}
              {loaderData.scores.stats!.spinScores >
              loaderData.scores.stats!.totalScores / 2
                ? "spin"
                : "non spin"}{" "}
              player.
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground mt-[2px]">
              {loaderData.scores.stats!.spinScores} spin scores out of{" "}
              {loaderData.scores.stats!.totalScores} total scores.
            </div>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="w-80 mt-2 -mb-20 -mr-12"
        >
          <RadialBarChart
            data={[
              {
                Spin: loaderData.scores.stats!.spinScores,
                "Non spin":
                  loaderData.scores.stats!.totalScores -
                  loaderData.scores.stats!.spinScores,
                total: loaderData.scores.stats!.totalScores,
              },
            ]}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {loaderData.scores.stats?.spinScores} /{" "}
                          {loaderData.scores.stats?.totalScores}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Spin Scores
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="Non spin"
              stackId="a"
              cornerRadius={5}
              fill="white"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Spin"
              fill="gray"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </div>
      <div className="w-full bg-neutral-900 shadow-md rounded-sm p-4 text-sm border-[1px] border-neutral-800">
        <div className="text-neutral-500 font-extrabold mb-4">TOP SCORES</div>
        <div className="flex flex-col gap-3">
          {loaderData.scores.top?.length ? (
            loaderData.scores.top?.map((score, i) => (
              <ProfileScore score={score} order={i} />
            ))
          ) : (
            <div className="text-white w-full flex flex-col justify-center items-center gap-2">
              <img
                src={"/not_found.png"}
                width={40}
                height={40}
                alt="Notfound"
              />
              <div className="opacity-75 italic">No scores submitted</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
