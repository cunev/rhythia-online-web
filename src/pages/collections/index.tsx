import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { createCollection, getCollections } from "rhythia-api";
import { getJwt } from "@/supabase";
import { toast } from "@/shadcn/ui/use-toast";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { LoaderData } from "@/types";
import { IoMdMusicalNote } from "react-icons/io";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/shadcn/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { TbList, TbStarFilled } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { FaEdit, FaList } from "react-icons/fa";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../leaderboards/_components/pagiantions";

export const makeVirtualPath = (text: string) => {
  const newPath = `/collections?search=${text}`;
  window.history.pushState(null, "", newPath);
};

export const Loader = async ({ params }: any) => {
  const jwt = await getJwt();
  const url = new URL(location.href);

  return {
    page: Number(url.searchParams.get("page") || "1"),
    getCollections: await getCollections({
      itemsPerPage: 50,
      page: Number(url.searchParams.get("page") || "1"),
      session: jwt,
      minBeatmaps: 3,
      search: String(url.searchParams.get("search") || ""),
    }),
  };
};

const colors = [
  "hsl(142, 80%, 65%)", // Green (3 stars)
  "hsl(142, 80%, 55%)", // Green
  "hsl(142, 80%, 45%)", // Green (1 star)

  "hsl(60, 80%, 65%)", // Yellow (6 stars)
  "hsl(60, 80%, 55%)", // Yellow
  "hsl(60, 80%, 45%)", // Yellow

  "hsl(0, 80%, 65%)", // Red (9 stars)
  "hsl(0, 80%, 55%)", // Red
  "hsl(0, 80%, 45%)", // Red

  "hsl(280, 80%, 85%)", // Purple (18 stars)
  "hsl(280, 80%, 75%)", // Purple
  "hsl(280, 80%, 80%)", // Purple
  "hsl(280, 80%, 70%)", // Purple
  "hsl(280, 80%, 65%)", // Purple
  "hsl(280, 80%, 60%)", // Purple
  "hsl(280, 80%, 55%)", // Purple
  "hsl(280, 80%, 50%)", // Purple
  "hsl(280, 80%, 45%)", // Purple
];

const ChartTooltipContent = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-neutral-900 p-2 border border-neutral-700 rounded shadow-lg flex gap-2">
      <p className="text-sm font-medium">
        {data.stars} {parseInt(data.stars) === 1 ? "Star" : "Stars"}
      </p>
      <p className="text-sm text-white">
        {data.count} {data.count === 1 ? "Map" : "Maps"}
      </p>
    </div>
  );
};

export default function Collections() {
  const curPath = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(curPath.get("search") || "");

  const debounced = useDebouncedCallback(() => {
    makeVirtualPath(search);

    navigate(`/collections?search=${search}`, { replace: true });
  }, 300);

  const navigate = useNavigate();
  const { getCollections, page } = useLoaderData() as LoaderData<typeof Loader>;
  const form = useForm({
    defaultValues: {
      collectionName: "",
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between max-md:flex-col max-md:gap-4">
        <div className="flex flex-col">
          <div className="flex space-x-2 items-center">
            <IoMdMusicalNote size={24} />
            <div className="text-2xl font-bold">Collections</div>
          </div>

          <div className="text-base opacity-75">
            List of map collections to help you download or categorize maps
          </div>
        </div>

        <div className="flex gap-2 items-center max-md:flex-col max-md:items-stretch">
          <Link to={"/collections/own"}>
            <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
              <FaList />
              Your Collections
            </div>
          </Link>

          <Dialog>
            <DialogTrigger>
              <div className="bg-neutral-900 border-[1px] rounded-full px-6 py-2 flex items-center gap-2 hover:bg-neutral-800 border-neutral-800">
                <FaEdit />
                Create collection
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create collection</DialogTitle>
                <DialogDescription>
                  You will be able to add any map to this collection and it will
                  be publicly visible.
                </DialogDescription>
              </DialogHeader>
              <hr />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(async (form) => {
                    const res = await createCollection({
                      session: await getJwt(),
                      title: form.collectionName,
                    });
                    if (!res.id) {
                      toast({
                        title: "Oops",
                        description:
                          "Failed to create collection, please choose another name.",
                        variant: "destructive",
                      });
                      return;
                    }
                    navigate("/collections/" + res.id);

                    if (res.error) {
                      toast({
                        title: "Oops",
                        description: res.error,
                        variant: "destructive",
                      });
                    }
                  })}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="collectionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="My amazing collection"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This name will be displayed only in the collection
                          page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Create collection</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <input
        className="bg-neutral-900 w-full h-14 shadow-md rounded-sm outline-none placeholder:text-neutral-700 px-4 text-xl font-medium text-white border-[1px] border-neutral-800"
        placeholder="search collections by name, creator or genre..."
        value={search}
        onChange={(ev) => {
          setSearch(ev.target.value);
          debounced();
        }}
      />
      <div className="w-full grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {getCollections.collections.map((collection) => (
          <div className="border-[1px] p-2 px-4 rounded-md  flex justify-between gap-1 items-center bg-neutral-900">
            <div className="flex flex-col gap-3 items-start">
              <div className="flex flex-col ">
                <div className="flex gap-2 items-center my-1">
                  <img
                    src={collection.ownerAvatarUrl}
                    className="rounded-full w-5 h-5"
                  ></img>
                  <Link
                    to={"/player/" + collection.owner}
                    className="text-sm font-bold hover:underline"
                  >
                    {collection.ownerUsername}
                  </Link>
                </div>

                <Link
                  to={"/collections/" + collection.id}
                  className="text-lg font-bold hover:underline"
                >
                  {collection.title}
                </Link>

                <div className="text-xs opacity-70">
                  {collection.description}
                </div>
              </div>

              <div className="flex flex-col items-start gap-1">
                <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-sm font-normal">
                  <TbList />
                  {collection.beatmapCount} maps
                </div>
                <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-sm font-normal">
                  <TbStarFilled />
                  {Math.round(
                    (collection.starRatingDistribution.reduce(
                      (acc, curr) => acc + curr.stars * curr.count,
                      0
                    ) /
                      collection.starRatingDistribution.reduce(
                        (acc, curr) => acc + curr.count,
                        0
                      )) *
                      100
                  ) / 100 || 0}{" "}
                  average rating
                </div>
              </div>
            </div>

            <ChartContainer
              config={{ count: { label: "Maps", color: colors[0] } }}
              className="h-24"
            >
              <BarChart
                data={collection.starRatingDistribution}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="stars"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  radius={8}
                  fill="#000000"
                  shape={(props: any) => {
                    const { x, y, width, height, index } = props;
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={colors[index % colors.length]}
                      />
                    );
                  }}
                />
              </BarChart>
            </ChartContainer>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalItems={getCollections.totalPages * 50}
        viewPerPages={50}
      />
    </div>
  );
}
