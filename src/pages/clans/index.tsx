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
import { createClan, getClans } from "rhythia-api";
import { getJwt } from "@/supabase";
import { toast } from "@/shadcn/ui/use-toast";
import { IoMdMusicalNote } from "react-icons/io";
import { Link, useLoaderData } from "react-router-dom";
import { LoaderData } from "@/types";
import Pagination from "../leaderboards/_components/pagiantions";
export const Loader = async ({ params }: any) => {
  const jwt = await getJwt();
  const url = new URL(location.href);

  return {
    getClan: await getClans({
      page: Number(url.searchParams.get("page") || "1"),
      session: jwt,
    }),
    page: Number(url.searchParams.get("page") || "1"),
  };
};

export default function Clans() {
  const form = useForm({
    defaultValues: {
      clanName: "",
      clanAcronym: "",
    },
  });
  const leaders = useLoaderData() as LoaderData<typeof Loader>;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between max-md:flex-col max-md:gap-4">
          <div className="flex flex-col">
            <div className="flex space-x-2 items-center">
              <IoMdMusicalNote size={24} />
              <div className="text-2xl font-bold">Clans</div>
            </div>

            <div className="text-base opacity-75">
              Leaderboard of clans and their members
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full p-0 px-4 text-sm border-[1px] border-transparent flex justify-between text-neutral-500">
            <div className="flex space-x-4 w-1/2">
              <div className="">Position</div>
            </div>
            <div className="flex space-x-4 w-1/3">
              <div className="w-1/2 text-center">Members</div>
              <div className="w-1/2 text-center">Total RP</div>
            </div>
          </div>
        </div>
        {leaders.getClan.clanData.map((clan, i) => (
          <div className="w-full bg-neutral-900 hover:bg-neutral-800 shadow-md rounded-sm p-1 px-4 text-sm border-[1px] border-neutral-800 flex justify-between items-center">
            <div className="flex space-x-4 w-1/2 items-center">
              <div className="opacity-75 min-w-10">#{i + 1}</div>
              <img
                src={clan.avatar_url || "https://a.ppy.sh/u/1"}
                width={32}
                className="rounded-md"
              />
              <Link to={`/clans/${clan.id}`}>
                <span className="cursor-pointer font-extrabold mr-1 text-indigo-500">
                  [{clan.acronym}]
                </span>
                <div className="font-bold">{clan.name}</div>
              </Link>
            </div>
            <div className="flex space-x-4 w-1/3">
              <div className="font-bold w-1/2 text-center">
                {clan.member_count}
              </div>
              <div className="w-1/2 text-center">{clan.total_skill_points}</div>
            </div>
          </div>
        ))}

        <Pagination
          currentPage={leaders.page}
          totalItems={leaders.getClan.clanData.length}
          viewPerPages={20}
        />
      </div>
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (form) => {
            const res = await createClan({
              session: await getJwt(),
              acronym: form.clanAcronym,
              name: form.clanName,
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
            name="clanName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Clan Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Amazing Clan" {...field} />
                </FormControl>
                <FormDescription>
                  This name will be displayed only in the clan page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clanAcronym"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clan Acronym</FormLabel>
                <FormControl>
                  <Input placeholder="MAC" {...field} />
                </FormControl>
                <FormDescription>
                  This acronym will be displayed along you player name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Clan</Button>
        </form>
      </Form> */}
      {/* <Button>Create clan</Button> */}
    </>
  );
}
