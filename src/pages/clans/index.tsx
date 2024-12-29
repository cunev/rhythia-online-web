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
import { createClan } from "rhythia-api";
import { getJwt } from "@/supabase";
import { toast } from "@/shadcn/ui/use-toast";

export default function Clans() {
  const form = useForm({
    defaultValues: {
      clanName: "",
      clanAcronym: "",
    },
  });
  return (
    <>
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
