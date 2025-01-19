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
import { Link, useLoaderData } from "react-router-dom";
import { LoaderData } from "@/types";
import { IoMdMusicalNote } from "react-icons/io";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shadcn/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { TbList, TbStarFilled } from "react-icons/tb";

export const Loader = async ({ params }: any) => {
  const jwt = await getJwt();
  return {
    getCollections: await getCollections({
      itemsPerPage: 50,
      page: 1,
      session: jwt,
    }),
  };
};

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
const chartConfig = {
  count: {
    label: "Maps",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Collections() {
  const { getCollections } = useLoaderData() as LoaderData<typeof Loader>;
  const form = useForm({
    defaultValues: {
      collectionName: "",
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex space-x-2 items-center">
          <IoMdMusicalNote size={24} />
          <div className="text-2xl font-bold">Collections</div>
        </div>

        <div className="text-base opacity-75">
          List of map collections to help you download or categorize maps
        </div>
      </div>

      <div className="flex flex-col">
        {getCollections.collections.map((collection) => (
          <div className="border-[1px] p-2 px-4 rounded-md  flex justify-between gap-1 items-center bg-neutral-900">
            <div className="flex flex-col gap-1 items-start">
              <Link
                to={"/collections/" + collection.id}
                className="text-lg font-bold hover:underline"
              >
                {collection.title}
              </Link>
              <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-sm font-normal">
                <TbList />
                {collection.beatmapCount} maps
              </div>
              <div className="bg-neutral-900 bg-opacity-50 z-10 px-2 rounded-sm border-neutral-500 border-[1px] flex gap-2 items-center text-sm font-normal">
                <TbStarFilled />
                {collection.starRatingDistribution.reduce(
                  (acc, curr) => acc + curr.stars * curr.count,
                  0
                ) /
                  collection.starRatingDistribution.reduce(
                    (acc, curr) => acc + curr.count,
                    0
                  )}{" "}
                average rating
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-24">
              <BarChart
                accessibilityLayer
                data={collection.starRatingDistribution}
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
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </div>
        ))}
      </div>

      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (form) => {
            const res = await createCollection({
              session: await getJwt(),
              title: form.collectionName,
            });

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
                  <Input placeholder="My amazing collection" {...field} />
                </FormControl>
                <FormDescription>
                  This name will be displayed only in the collection page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create collection</Button>
        </form>
      </Form> */}
    </div>
  );
}
